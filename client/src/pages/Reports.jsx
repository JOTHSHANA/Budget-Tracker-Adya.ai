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
import TransactionTable from "../components/dashboard/TransactionTable";
import ExportButtons from "../components/reports/ExportButtons";
import apiHost from "../components/utils/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a78bfa", "#facc15"];

const Reports = () => {
    const { user } = useContext(AuthContext);
    const [allTransactions, setAllTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [incomeTransactions, setIncomeTransactions] = useState([]);

    // 1. All Transactions - For Monthly Line Chart
    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                const res = await axios.get(`${apiHost}/api/transactions`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAllTransactions(res.data);
            } catch (err) {
                console.error("Error fetching all transactions:", err);
            }
        };

        fetchAllTransactions();
    }, [user.token]);

    // 2. Expense Transactions - For Expense Charts
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get(`${apiHost}/api/transactions/expense`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setExpenseTransactions(res.data);
            } catch (err) {
                console.error("Error fetching expense transactions:", err);
            }
        };

        fetchExpenses();
    }, [user.token]);

    // 3. Income Transactions - For Category-wise Income Chart
    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await axios.get(`${apiHost}/api/transactions/income`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setIncomeTransactions(res.data);
            } catch (err) {
                console.error("Error fetching income transactions:", err);
            }
        };

        fetchIncome();
    }, [user.token]);

    // Monthly Line Chart Data
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

    // Category-wise Expense Data
    const categoryExpenseSummary = {};
    expenseTransactions.forEach((tx) => {
        if (!categoryExpenseSummary[tx.category]) {
            categoryExpenseSummary[tx.category] = 0;
        }
        categoryExpenseSummary[tx.category] += tx.amount;
    });

    const categoryExpenseData = Object.keys(categoryExpenseSummary).map((category) => ({
        name: category,
        value: categoryExpenseSummary[category],
    }));

    // Category-wise Income Data
    const categoryIncomeSummary = {};
    incomeTransactions.forEach((tx) => {
        if (!categoryIncomeSummary[tx.category]) {
            categoryIncomeSummary[tx.category] = 0;
        }
        categoryIncomeSummary[tx.category] += tx.amount;
    });

    const categoryIncomeData = Object.keys(categoryIncomeSummary).map((category) => ({
        name: category,
        value: categoryIncomeSummary[category],
    }));

    return (
        <div className="p-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Reports</h2>

            {/* Line Chart - Monthly Income vs Expense */}
            <div className="mb-4 bg-white p-6 rounded-5px shadow-custom">
                <h3 className="text-xl font-semibold mb-2">Monthly Income vs Expense</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} name="Expense" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Category-wise Expense and Income Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Expense Pie Chart */}
                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Expense Distribution by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryExpenseData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {categoryExpenseData.map((entry, index) => (
                                    <Cell key={`cell-exp-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Category-wise Expense Bar Chart */}
                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Category-wise Expense Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryExpenseData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#f97316" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category-wise Income & Table side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Category-wise Income Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryIncomeData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10b981" name="Income" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-5px shadow-custom overflow-auto">
                    <TransactionTable transactions={allTransactions} />
                </div>
            </div>
            <ExportButtons transactions={allTransactions} userToken={user.token} />


        </div>
    );
};

export default Reports;