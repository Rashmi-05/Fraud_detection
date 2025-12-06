import { userModel, txnModel } from "../db.js";
export const getAccNos = async (req, res) => {
  try {
    
    //const userId = req.userId;

    const users = await userModel.findAll({
     
      attributes: ["id","email", "accountNumber", "password"]
    });

    return res.json({ transactions: users });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
