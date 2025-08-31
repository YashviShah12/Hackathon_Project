const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  producerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  productionDate: { type: Date, required: true },
  status: { type: String, enum: ["PENDING", "CERTIFIED"], default: "PENDING" },
  transactionHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Batch", batchSchema);