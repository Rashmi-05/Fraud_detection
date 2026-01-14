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

    const user = await userModel.findByPk(userId, {
      attributes: ["accountNumber"],
      raw: true
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myAccount = user.accountNumber;

    // 🔹 Accounts I sent money to
    const sentTxns = await txnModel.findAll({
      where: { userId },
      attributes: ["receiverTag"],
      group: ["receiverTag"],
      raw: true
    });

    const sentAccounts = sentTxns
      .map(t => t.receiverTag)
      .filter(Boolean);

    // 🔹 Users who sent money to me
    const receivedTxns = await txnModel.findAll({
      where: { receiverTag: myAccount },
      attributes: ["userId"],
      group: ["userId"],
      raw: true
    });

    const senderUserIds = receivedTxns.map(t => t.userId);

    const senderUsers = await userModel.findAll({
      where: { id: senderUserIds },
      attributes: ["accountNumber"],
      raw: true
    });

    const receivedAccounts = senderUsers.map(u => u.accountNumber);

    // 🔹 Merge + remove duplicates + remove self
    const interactedAccounts = [
      ...new Set([...sentAccounts, ...receivedAccounts])
    ].filter(acc => acc !== myAccount);

    // 4️⃣ Convert accountNumbers → usernames (userTag)
    const interactedUsers = await userModel.findAll({
      where: { accountNumber: interactedAccounts },
      attributes: ["email"],
      raw: true
    });

    const usernames = interactedUsers.map(u => u.email);

    console.log("interacted users", usernames)

    return res.json({ interactedUsers: usernames });

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

