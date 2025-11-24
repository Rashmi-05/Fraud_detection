import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log("in auth");
  const token = req.cookies.token;  
  console.log("Token:", token);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("Decoded JWT:", decoded);

    req.userId = decoded.id;   // ✅ attach userId directly
    req.user = decoded;        // optional, if you want whole payload
    return next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    req.user = null;
    req.userId = null;
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
