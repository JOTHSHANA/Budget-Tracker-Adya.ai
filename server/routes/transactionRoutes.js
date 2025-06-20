const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token
const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// @POST /api/transactions
router.post('/', protect, async (req, res) => {
    try {
        const { type, category, amount, note, createdAt } = req.body;

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            category,
            amount,
            note,
            createdAt: createdAt ? new Date(createdAt) : new Date(),
        });

        await transaction.save();

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// @GET /api/transactions
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
