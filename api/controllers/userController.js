import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields must" });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hash,
      email,
    });
    res.status(201).json({ message: "Registration success" });
  } catch (error) {
    res.status(500).json({ message: "Server error when register" });
  }
};
export const me = async (req, res) => {
  const id = req.user.id;
  try {
    if (!id) {
      return res.status(400).json({ message: "user id not found" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json({
      message: "user found",
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error when getting me." });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if ((!email, !password)) {
      return res.status(400).json({ message: "All fields must" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const checkPwd = await bcrypt.compare(password, user.password);
    if (!checkPwd) {
      return res.status(400).json({ message: "Password incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "login successfull",
      username: user.username,
    });
  } catch {
    res.status(500).json({ message: "Server error when login" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch {
    res.status(500).json({ message: "Server error when logout" });
  }
};
