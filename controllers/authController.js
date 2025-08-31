const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ethers = require("ethers");

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const wallet = ethers.Wallet.createRandom();
    const user = new User({ email, password, role, walletAddress: wallet.address });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, email, role: user.role, walletAddress: user.walletAddress } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};