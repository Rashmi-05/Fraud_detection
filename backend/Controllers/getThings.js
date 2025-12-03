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

    const txns = await txnModel.findAll({
      where: { userId },
      attributes: ["receiverTag"],
      group: ["receiverTag"]
    });

    // extract account numbers
    const receivers = txns.map(t => t.receiverTag).filter(Boolean);

    return res.json({ receivers });

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

