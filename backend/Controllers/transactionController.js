import { userModel, txnModel } from "../db.js";
import sequelize from "../Models/index.js";



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


export const sendMoney = async (req, res) => {
  const t = await sequelize.transaction();   // ✅ start atomic block
  try {
    const { amount, receiverAccountNumber, pin } = req.body;
    const senderId = req.userId;     // ✅ safer from your middleware

    if (!amount || !receiverAccountNumber || isNaN(amount) || amount <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid data" });
    }

    const sender = await userModel.findByPk(senderId, { transaction: t });
    if (!sender) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

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
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // ✅ create transaction
    const newTxn = await txnModel.create({
      userId: senderId,
      amount,
      receiverTag: receiver.accountNumber
    }, { transaction: t });

    // ✅ update sender
    await updateUserMetrics(senderId, amount, t);

    // ✅ credit receiver
    await receiver.update({
      accountBalance: receiver.accountBalance + parseFloat(amount)
    }, { transaction: t });
 
    const updatedReceiver = await receiver.update(
  { accountBalance: parseFloat(receiver.accountBalance) + parseFloat(amount) },
  { transaction: t, returning: true }
);

console.log(updatedReceiver.accountBalance);  // ✅ updated


    await t.commit();   // ✅ everything ok

    // ✅ fetch fresh sender balance
    const updatedSender = await userModel.findByPk(senderId);

    
    

    return res.json({
      message: "Transaction successful",
      transactionId: newTxn.id,
      newBalance: updatedSender.accountBalance
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: "Transaction failed" });
  }
};

