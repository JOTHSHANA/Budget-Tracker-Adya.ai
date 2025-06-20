const Transaction = require("../models/Transaction");

// @POST /api/transactions
const createTransaction = async (req, res) => {
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

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @GET /api/transactions/by-month?month=YYYY-MM
const getTransactionsByMonth = async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: "Invalid or missing month (format: YYYY-MM)" });
    }

    try {
        const [year, mon] = month.split("-");
        const startDate = new Date(`${year}-${mon}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const transactions = await Transaction.find({
            user: userId,
            createdAt: { $gte: startDate, $lt: endDate },
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const getYearlySummary = async (req, res) => {
    const userId = req.user.id;
    const { year } = req.query;

    if (!year || !/^\d{4}$/.test(year)) {
        return res.status(400).json({ error: "Invalid or missing year (format: YYYY)" });
    }

    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

        const transactions = await Transaction.find({
            user: userId,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        let income = 0;
        let expense = 0;
        const monthlyChartData = {};

        for (let i = 1; i <= 12; i++) {
            const monthKey = `${year}-${String(i).padStart(2, "0")}`;
            monthlyChartData[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }

        transactions.forEach((tx) => {
            const txDate = new Date(tx.createdAt);
            const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;

            if (tx.type === "income") {
                income += tx.amount;
                monthlyChartData[monthKey].income += tx.amount;
            } else if (tx.type === "expense") {
                expense += tx.amount;
                monthlyChartData[monthKey].expense += tx.amount;
            }
        });

        res.status(200).json({
            income,
            expense,
            balance: income - expense,
            monthlyChartData: Object.values(monthlyChartData),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const getIncomeTransactions = async (req, res) => {
    try {
        const incomeTxns = await Transaction.find({
            user: req.user._id,
            type: "income",
        }).sort({ createdAt: -1 });

        res.status(200).json(incomeTxns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @GET /api/transactions/expense
const getExpenseTransactions = async (req, res) => {
    try {
        const expenseTxns = await Transaction.find({
            user: req.user._id,
            type: "expense",
        }).sort({ createdAt: -1 });

        res.status(200).json(expenseTxns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    createTransaction,
    getTransactions,
    getTransactionsByMonth,
    getYearlySummary,
    getIncomeTransactions,
    getExpenseTransactions,
};
