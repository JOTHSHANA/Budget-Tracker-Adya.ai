const Transaction = require("../models/Transaction");
const BudgetCategory = require("../models/BudgetCategory");

const checkBudgetViolations = async (req, res) => {
    const userId = req.user.id;

    try {
        const [transactions, budgetCategories] = await Promise.all([
            Transaction.find({ user: userId }),
            BudgetCategory.find({ user: userId }),
        ]);

        const totalIncome = transactions
            .filter(tx => tx.type === "income")
            .reduce((sum, tx) => sum + tx.amount, 0);

        const expensesByCategory = transactions
            .filter(tx => tx.type === "expense")
            .reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {});

        const violations = [];

        for (const budget of budgetCategories) {
            if (budget.type === "expense" && budget.percentage !== null) {
                const expense = expensesByCategory[budget.category] || 0;
                const limit = (budget.percentage / 100) * totalIncome;
                if (expense > limit) {
                    violations.push({
                        category: budget.category,
                        spent: expense,
                        limit: limit,
                        exceededBy: expense - limit,
                    });
                }
            }
        }

        return res.status(200).json({ violations });
    } catch (error) {
        console.error("Budget check error:", error);
        return res.status(500).json({ error: "Server error checking budgets" });
    }
};

module.exports = { checkBudgetViolations };
