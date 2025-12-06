import { userModel, txnModel } from "../db.js";
import sequelize from "../Models/index.js";
import { buildMLPayload } from "./mlPayload.js";
import bcrypt from 'bcrypt'

const pinAttemptStore = new Map();   // senderId → pin failure count

import computeRisk from "../Utils/computeRisk.js"


export async function updateUserMetrics(userId, amount, transaction) {
  const user = await userModel.findByPk(userId, { transaction });

  const newTxnCount = user.txnCount + 1;

  const newAvg =
    (user.avgSpending * user.txnCount + parseFloat(amount)) / newTxnCount;

  const newBalance = user.accountBalance - parseFloat(amount);

  await user.update({
    txnCount: newTxnCount,
    avgSpending: newAvg,
    accountBalance: newBalance
  }, { transaction });
}

export async function updateLocationMetrics(userId, latitude, longitude, transaction) {

  if (!latitude || !longitude) return;

  const user = await userModel.findByPk(userId, { transaction });

  let { centroidLat, centroidLng, txnCount, sumDeviation } = user;

  // txnCount already updated before this function is called ✅

  // first location stored
  if (txnCount === 1 || centroidLat === null || centroidLng === null || (centroidLat === 0 && centroidLng === 0)) {
    await user.update({
      centroidLat: latitude,
      centroidLng: longitude,
      sumDeviation: 0,
      meanDeviation: 0
    }, { transaction });
    return;
  }

  const prevCount = txnCount - 1; // previous count BEFORE this txn

  // Update centroid correctly
  const newCentroidLat =
    (centroidLat * prevCount + latitude) / txnCount;

  const newCentroidLng =
    (centroidLng * prevCount + longitude) / txnCount;

  // Haversine distance
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;

  const dLat = toRad(latitude - newCentroidLat);
  const dLng = toRad(longitude - newCentroidLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(newCentroidLat)) *
    Math.cos(toRad(latitude)) *
    Math.sin(dLng / 2) ** 2;

  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Update sum only (NOT count)
  const updatedSum = sumDeviation + distance;

  await user.update({
    centroidLat: newCentroidLat,
    centroidLng: newCentroidLng,
    sumDeviation: updatedSum,
    meanDeviation: updatedSum / txnCount
  }, { transaction });
}




export const sendMoney = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const { amount, receiverAccountNumber, pin, latitude, longitude } = req.body;
    const senderId = req.userId;

    // ✅ restore previous failure count instead of resetting to 0
    let pinFailures = pinAttemptStore.get(senderId) || 0;

    if (!amount || !receiverAccountNumber || isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(200).json({ message: "Invalid data" });
    }

    const sender = await userModel.findByPk(senderId, { transaction: t });
    if (!sender) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ PIN validation
    if (!pin) {
      await t.rollback();
      return res.status(400).json({ message: "PIN required" });
    }

    const pinValid = await bcrypt.compare(pin, sender.pin);

    // ❌ WRONG PIN
    if (!pinValid) {

      pinFailures++;   // ✅ increment count
      pinAttemptStore.set(senderId, pinFailures);  // ✅ persist

      await t.rollback();
      return res.status(401).json({
        message: "Invalid PIN",
        failedAttempts: pinFailures   // optional debug output
      });
    }

    // ✅ RESET COUNTER ON SUCCESS
    pinAttemptStore.delete(senderId);

    const receiver = await userModel.findOne({
      where: { accountNumber: receiverAccountNumber },
      transaction: t
    });

    if (!receiver) {
      await t.rollback();
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.accountBalance < amount) {
      await t.rollback();
      return res.status(200).json({ message: "Insufficient balance" });
    }

    await sender.reload({ transaction: t });

    // ✅ STORE failure count in transaction record
    const newTxn = await txnModel.create({
      userId: senderId,
      amount,
      receiverTag: receiver.accountNumber,
      latitude,
      longitude,
      pinFailures   // ✅ now real value, not always 0
    }, { transaction: t });

    // ✅ update sender metrics
    await updateUserMetrics(senderId, amount, t);
    await updateLocationMetrics(senderId, latitude, longitude, t);

    await sender.reload({ transaction: t });

    const mlPayload = await buildMLPayload(sender, amount, pinFailures);
    console.log(mlPayload);

    // ✅ credit receiver
    await receiver.update({
      accountBalance: parseFloat(receiver.accountBalance) + parseFloat(amount)
    }, { transaction: t });
 
    const updatedReceiver = await receiver.update(
  { accountBalance: parseFloat(receiver.accountBalance) + parseFloat(amount) },
  { transaction: t, returning: true }
);

console.log(updatedReceiver.accountBalance);  // ✅ updated

 const risk = await computeRisk();
 const yellowthreshold = 0.3 //placeholder value
 const redthreshold = 0.75 //placeholder value

    if (risk > redthreshold) {
        console.log("⚠️ High risk — rolling back");
        await t.rollback();
        return res.status(200).json({ message: "Transaction Blocked Due to High Risk" });
    }
    
    console.log("Risk score is: ", risk)
    await t.commit();   // ✅ everything ok

    // ✅ fetch fresh sender balance
    const updatedSender = await userModel.findByPk(senderId);

    return res.json({
      message: "Transaction successful",
      transactionId: newTxn.id,
      newBalance: updatedSender.accountBalance,
      pinFailures    // optional: visible response
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: "Transaction failed" });
  }
};
