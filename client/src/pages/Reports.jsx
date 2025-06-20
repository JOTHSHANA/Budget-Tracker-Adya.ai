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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

const Reports = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/transactions", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTransactions();
    }, [user.token]);

    const monthlyData = {};
    const categorySummary = {};

    transactions.forEach(tx => {
        const month = new Date(tx.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        if (tx.type === "income") monthlyData[month].income += tx.amount;
        else monthlyData[month].expense += tx.amount;

        if (!categorySummary[tx.category]) categorySummary[tx.category] = 0;
        if (tx.type === "expense") categorySummary[tx.category] += tx.amount;
    });

    const lineData = Object.keys(monthlyData).map(month => ({
        month,
        income: monthlyData[month].income,
        expense: monthlyData[month].expense,
    }));

    const categoryData = Object.keys(categorySummary).map(cat => ({
        name: cat,
        value: categorySummary[cat],
    }));

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Reports</h2>

            {/* Income vs Expense Line Chart */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Monthly Income vs Expense</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} />
                        <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Category-wise Pie Chart */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Expense Distribution by Category</h3>
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart by Category */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Category-wise Expense Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#60a5fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Optional Export Button */}
            <div className="flex gap-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded">Export as PDF</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Download CSV</button>
            </div>
        </div>
    );
};

export default Reports; 