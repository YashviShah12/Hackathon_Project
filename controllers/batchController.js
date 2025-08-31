const Batch = require("../models/Batch");
const ethers = require("ethers");

exports.submitBatch = async (req, res) => {
  try {
    const { amount, productionDate } = req.body;
    console.log(req.body);
    const batch = new Batch({
      producerId: req.user.id,
      amount,
      productionDate,
      status: "PENDING",
    });
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: "Error submitting batch", error: error.message });
  }
};

exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate("producerId", "email");
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches", error: error.message });
  }
};

exports.verifyBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    if (req.user.role !== "certifier") return res.status(403).json({ message: "Only certifiers can verify" });
    batch.status = "CERTIFIED";
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ["function mintCredit(address to) returns (uint256)"], wallet);
    const tx = await contract.mintCredit(req.user.walletAddress);
    const receipt = await tx.wait();
    batch.transactionHash = receipt.hash;
    await batch.save();
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Error verifying batch", error: error.message });
  }
};