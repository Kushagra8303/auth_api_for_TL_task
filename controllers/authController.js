const bcrypt = require("bcryptjs");
const User = require("../models/user");

// signup creates a new user with hashed password
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    // basic input validation to avoid 500s caused by missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    // log unexpected errors for debugging
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// login checks credentials, records login time, and returns a simple success response
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // record login time
    const now = new Date();
    user.lastLogin = now;
    user.loginHistory.push(now);
    await user.save();

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, lastLogin: user.lastLogin },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
}


// ADMIN: fetch all users with timestamps
async function getUsers(req, res) {
  try {
    const users = await User.find({}, "name email createdAt lastLogin loginHistory").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { signup, login, getUsers };