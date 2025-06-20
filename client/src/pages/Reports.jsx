// src/pages/Reports.jsx

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a78bfa", "#facc15"];

const Reports = () => {
    const { user } = useContext(AuthContext);
    const [allTransactions, setAllTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);

    // Fetch all transactions (for line chart)
    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/transactions", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAllTransactions(res.data);
            } catch (err) {
                console.error("Error fetching all transactions:", err);
            }
        };

        fetchAllTransactions();
    }, [user.token]);

    // Fetch only expense transactions (for category-wise charts)
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/transactions/expense", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setExpenseTransactions(res.data);
            } catch (err) {
                console.error("Error fetching expense transactions:", err);
            }
        };

        fetchExpenses();
    }, [user.token]);

    // Monthly Income vs Expense
    const monthlySummary = {};
    allTransactions.forEach((tx) => {
        const month = new Date(tx.createdAt).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        if (!monthlySummary[month]) {
            monthlySummary[month] = { income: 0, expense: 0 };
        }
        if (tx.type === "income") monthlySummary[month].income += tx.amount;
        else if (tx.type === "expense") monthlySummary[month].expense += tx.amount;
    });

    const lineChartData = Object.keys(monthlySummary).map((month) => ({
        month,
        income: monthlySummary[month].income,
        expense: monthlySummary[month].expense,
    }));

    // Category-wise Expense Summary
    const categorySummary = {};
    expenseTransactions.forEach((tx) => {
        if (!categorySummary[tx.category]) {
            categorySummary[tx.category] = 0;
        }
        categorySummary[tx.category] += tx.amount;
    });

    const categoryData = Object.keys(categorySummary).map((category) => ({
        name: category,
        value: categorySummary[category],
    }));

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>

            {/* Monthly Income vs Expense Line Chart */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Monthly Income vs Expense</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#4ade80"
                            strokeWidth={2}
                            name="Income"
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#f87171"
                            strokeWidth={2}
                            name="Expense"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Category-wise Expense Report */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Expense Distribution by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Category-wise Expense Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#60a5fa" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Export Buttons (Optional) */}
            <div className="mt-6 flex gap-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Export as PDF
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Download CSV
                </button>
            </div>
        </div>
    );
};

export default Reports;
