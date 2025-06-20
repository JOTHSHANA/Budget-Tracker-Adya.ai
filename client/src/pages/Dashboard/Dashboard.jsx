import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    ResponsiveContainer,
} from "recharts";
import CategoryCharts from "../../components/dashboard/CategoryCharts";
import SummaryCards from "../../components/dashboard/SummaryCards";
import MonthlySummary from "../../components/dashboard/MonthlySummary";
import TransactionTable from "../../components/dashboard/TransactionTable";
import TransactionFormModal from "../../components/dashboard/TransactionFormModal";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [yearlySummary, setYearlySummary] = useState(null);
    const selectedYear = "2025"; // or dynamically from user input
    const [form, setForm] = useState({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [selectedMonth, setSelectedMonth] = useState("All");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = "http://localhost:5000/api/transactions";
                if (selectedMonth !== "All") {
                    url = `http://localhost:5000/api/transactions/by-month?month=${selectedMonth}`;
                }

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                setTransactions(res.data);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            }
        };

        fetchData();
    }, [selectedMonth, user.token]);

    useEffect(() => {
        const fetchYearlySummary = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/transactions/yearly-summary?year=${selectedYear}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                setYearlySummary(res.data);
            } catch (err) {
                console.error("Failed to fetch yearly summary", err);
            }
        };

        fetchYearlySummary();
    }, [selectedYear, user.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/transactions",
                { ...form, createdAt: new Date(form.date) },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setForm({
                type: "income",
                category: "",
                amount: "",
                note: "",
                date: new Date().toISOString().split("T")[0],
            });
            setFormOpen(false);
            // Refetch after new transaction
            if (selectedMonth === "All") {
                const res = await axios.get("http://localhost:5000/api/transactions", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setTransactions(res.data);
            } else {
                const res = await axios.get(
                    `http://localhost:5000/api/transactions/by-month?month=${selectedMonth}`,
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                setTransactions(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTxns = transactions;

    const sumByType = (type, list = transactions) =>
        list.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);

    const chartData = filteredTxns.reduce((acc, txn) => {
        if (txn.type === "expense") {
            acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
        }
        return acc;
    }, {});
    const categoryData = Object.entries(chartData).map(([name, value]) => ({ name, value }));

    const monthlyChartData = Object.values(
        transactions.reduce((acc, tx) => {
            const date = new Date(tx.createdAt);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
            acc[month][tx.type] += tx.amount;
            return acc;
        }, {})
    );

    const monthOptions = [
        "All",
        ...Array.from(
            new Set(
                transactions.map((tx) => {
                    const d = new Date(tx.createdAt);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                })
            )
        ).sort((a, b) => (a > b ? -1 : 1)),
    ];

    return (
        <div className="text-gray-800">
            <div className="container mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <div className="flex gap-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={["year", "month"]}
                                label="Select Month"
                                value={selectedMonth === "All" ? null : dayjs(selectedMonth)}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const formatted = newValue.format("YYYY-MM");
                                        setSelectedMonth(formatted);
                                    } else {
                                        setSelectedMonth("All");
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        className: "bg-white rounded-md",
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <button
                            onClick={() => setFormOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                        >
                            + Add Transaction
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {yearlySummary && (
                        <SummaryCards
                            income={yearlySummary.income}
                            expense={yearlySummary.expense}
                            balance={yearlySummary.balance}
                            monthlyChartData={yearlySummary.monthlyChartData}
                        />
                    )}
                    <MonthlySummary
                        income={sumByType("income", filteredTxns)}
                        expense={sumByType("expense", filteredTxns)}
                        balance={
                            sumByType("income", filteredTxns) - sumByType("expense", filteredTxns)
                        }
                        categoryData={categoryData}
                    />
                </div>

                <div className="gap-6 flex ">
                    <div className="flex-1">
                        <CategoryCharts data={categoryData} />
                    </div>
                    <div className="flex-[2]">
                        <TransactionTable transactions={transactions} />
                    </div>
                </div>

                {formOpen && (
                    <TransactionFormModal
                        form={form}
                        setForm={setForm}
                        onClose={() => setFormOpen(false)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
