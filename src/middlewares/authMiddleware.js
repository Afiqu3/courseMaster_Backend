// middleware to authenticate JWT tokens

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if(user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }
    next();
  } catch {
    // Code-15 bug: calls next() when JWT verification fails instead of 401
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
