const express = require("express");
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransactionsByMonth,
    getYearlySummary,
    getIncomeTransactions,
    getExpenseTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTransaction);
router.get("/", protect, getTransactions);
router.get("/by-month", protect, getTransactionsByMonth);
router.get("/yearly-summary", protect, getYearlySummary);
router.get("/income", protect, getIncomeTransactions);
router.get("/expense", protect, getExpenseTransactions);

module.exports = router;
