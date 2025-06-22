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
import Loader from "../components/Loader"; // 🆕 Import Loader

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#a78bfa", "#facc15"];

const Reports = () => {
    const { user } = useContext(AuthContext);

    const [allTransactions, setAllTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [incomeTransactions, setIncomeTransactions] = useState([]);

    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingExpense, setLoadingExpense] = useState(true);
    const [loadingIncome, setLoadingIncome] = useState(true);

    useEffect(() => {
        const fetchAllTransactions = async () => {
            setLoadingAll(true);
            try {
                const res = await axios.get(`${apiHost}/api/transactions`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAllTransactions(res.data);
            } catch (err) {
                console.error("Error fetching all transactions:", err);
            } finally {
                setLoadingAll(false);
            }
        };

        fetchAllTransactions();
    }, [user.token]);

    useEffect(() => {
        const fetchExpenses = async () => {
            setLoadingExpense(true);
            try {
                const res = await axios.get(`${apiHost}/api/transactions/expense`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setExpenseTransactions(res.data);
            } catch (err) {
                console.error("Error fetching expense transactions:", err);
            } finally {
                setLoadingExpense(false);
            }
        };

        fetchExpenses();
    }, [user.token]);

    useEffect(() => {
        const fetchIncome = async () => {
            setLoadingIncome(true);
            try {
                const res = await axios.get(`${apiHost}/api/transactions/income`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setIncomeTransactions(res.data);
            } catch (err) {
                console.error("Error fetching income transactions:", err);
            } finally {
                setLoadingIncome(false);
            }
        };

        fetchIncome();
    }, [user.token]);

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

            {/* Monthly Income vs Expense */}
            <div className="mb-4 bg-white p-6 rounded-5px shadow-custom">
                <h3 className="text-xl font-semibold mb-2">Monthly Income vs Expense</h3>
                {loadingAll ? (
                    <Loader />
                ) : lineChartData.length === 0 ? (
                    <p className="text-gray-500 text-center">No data available.</p>
                ) : (
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
                )}
            </div>

            {/* Expense Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Expense Distribution by Category</h3>
                    {loadingExpense ? (
                        <Loader />
                    ) : categoryExpenseData.length === 0 ? (
                        <p className="text-gray-500 text-center">No expense data available.</p>
                    ) : (
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
                    )}
                </div>

                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Category-wise Expense Comparison</h3>
                    {loadingExpense ? (
                        <Loader />
                    ) : categoryExpenseData.length === 0 ? (
                        <p className="text-gray-500 text-center">No expense data available.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryExpenseData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#f97316" name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Income + Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-6 rounded-5px shadow-custom">
                    <h3 className="text-xl font-semibold mb-4">Category-wise Income Comparison</h3>
                    {loadingIncome ? (
                        <Loader />
                    ) : categoryIncomeData.length === 0 ? (
                        <p className="text-gray-500 text-center">No income data available.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryIncomeData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10b981" name="Income" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="rounded-5px shadow-custom overflow-auto">
                    {loadingAll ? (
                        <Loader />
                    ) : allTransactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No transactions to display.</p>
                    ) : (
                        <TransactionTable transactions={allTransactions} />
                    )}
                </div>
            </div>

            <ExportButtons transactions={allTransactions} userToken={user.token} />
        </div>
    );
};

export default Reports;
