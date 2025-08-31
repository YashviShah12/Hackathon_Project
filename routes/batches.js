const express = require("express");
const router = express.Router();
const { submitBatch, getBatches, verifyBatch } = require("../controllers/batchController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, submitBatch);
router.get("/", authMiddleware, getBatches);
router.patch("/:id/verify", authMiddleware, verifyBatch);

module.exports = router;