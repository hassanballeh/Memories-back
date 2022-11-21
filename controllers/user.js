import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    const ispasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!ispasswordCorrect)
      res.status(400).json({ message: "invalid credentials." });
    const token = jwt.sign(
      { email: existingUser, id: existingUser._id },
      process.env.SECRET || "test",
      { expiresIn: "1d" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, cPassword, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist." });
    }
    if (password !== cPassword) {
      return res.status(400).json({ message: "Passwords don't match." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET || "test",
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong." });
  }
};
