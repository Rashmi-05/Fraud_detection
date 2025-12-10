import { userModel, txnModel } from "../db.js";
import { Op } from "sequelize";

export const getPastTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    const txns = await txnModel.findAll({
      where: { userId },
      order: [["timestamp", "DESC"]],
      attributes: ["id", "amount", "timestamp", "receiverTag"]
    });
    console.log("transaction",txns)
    return res.json({ transactions: txns });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

export const getPastReceivers = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findByPk(userId);
    const myAccount = user.accountNumber;

    const txns = await txnModel.findAll({
      where: { userId },
      attributes: ["receiverTag"],
      group: ["receiverTag"]
    });

     // YOU received money → get sender userIds
    const received = await txnModel.findAll({
      where: { receiverTag: myAccount },
      attributes: ["userId"],
      group: ["userId"]
    });

    // find sender account numbers
    const senderUsers = await userModel.findAll({
      where: {
        id: received.map(x => x.userId)
      },
      attributes: ["accountNumber"]
    });

    // extract account numbers
    const receivers = txns.map(t => t.receiverTag).filter(Boolean);

    const receivedList = senderUsers.map(r => r.User.accountNumber);

    const interactedUsers = [...new Set([...receivers, ...receivedList])];

    return res.json({ interactedUsers });

  } catch (error) {
    console.error("Get receivers error:", error);
    res.status(500).json({ message: "Failed to fetch receivers" });
  }
};

export const getBalance = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findByPk(userId, {
      attributes: ["accountBalance"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      balance: user.accountBalance
    });

  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({ message: "Failed to fetch balance" });
  }
};

