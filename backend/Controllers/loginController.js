import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../db.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check duplicate
    const existing = await userModel.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // generate random account number (like a bank)
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const balance = Math.floor(Math.random() * (100000 - 2000 + 1)) + 2000;

    // create user
    const user = await userModel.create({
      email,
      password: hashed,
      accountNumber:accountNumber,
      accountBalance:balance,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.accountBalance,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const login = async (req, res) => {
  try {
    const { loginType, email, password, accountNumber } = req.body;

    let user;

    // login via email + password
    if (loginType === "email") {
      user = await userModel.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Incorrect password" });
    }

    // login via account number
    else if (loginType === "account") {
      user = await userModel.findOne({ where: { accountNumber } });
      if (!user) return res.status(400).json({ message: "Invalid account number" });
    }

    // create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // send cookie
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/" ,
  maxAge: 7 * 24 * 60 * 60 * 1000,

});

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        accountNumber: user.accountNumber
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
