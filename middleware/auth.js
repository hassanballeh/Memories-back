import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const isCustomAuth = token.length < 500;
    if (!token) return res.status(401).json({ message: "No token provided" });
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET || "test");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Token is not valid" });
  }
};

export default auth;
