import  User from "../models/Admin.js";
import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
console.log("I am here causing the error")
    return res.status(401).json({ status: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ status: false, message: "yea,User not found" });
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ status: false, message: "Token invalid or expired" });
  }
};

