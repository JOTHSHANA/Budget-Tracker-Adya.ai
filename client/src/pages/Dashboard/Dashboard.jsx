// src/pages/Dashboard.jsx

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import apiHost from "../../components/utils/api";

import CategoryCharts from "../../components/dashboard/CategoryCharts";
import SummaryCards from "../../components/dashboard/SummaryCards";
import MonthlySummary from "../../components/dashboard/MonthlySummary";
import TransactionTable from "../../components/dashboard/TransactionTable";
import TransactionFormModal from "../../components/dashboard/TransactionFormModal";
import AddToPhotosSharpIcon from '@mui/icons-material/AddToPhotosSharp';
import { BudgetAlertContext } from "../../context/BudgetAlertContext";
import Loader from "../../components/Loader"; 

const Dashboard = () => {
    const { fetchViolations } = useContext(BudgetAlertContext);
    const { user } = useContext(AuthContext);

    const [transactions, setTransactions] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [yearlySummary, setYearlySummary] = useState(null);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
    });

    const selectedYear = "2025";

    const fetchData = async () => {
        setLoading(true);
        try {
            // Transactions
            let txnUrl = selectedMonth === "All"
                ? `${apiHost}/api/transactions`
                : `${apiHost}/api/transactions/by-month?month=${selectedMonth}`;

            const txnPromise = axios.get(txnUrl, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            // Yearly Summary
            const summaryPromise = axios.get(
                `${apiHost}/api/transactions/yearly-summary?year=${selectedYear}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Expense Categories
            const catPromise = axios.get(`${apiHost}/api/budget-category/expense`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const [txnRes, summaryRes, catRes] = await Promise.all([txnPromise, summaryPromise, catPromise]);

            setTransactions(txnRes.data);
            setYearlySummary(summaryRes.data);
            setExpenseCategories(catRes.data);
        } catch (err) {
            console.error("Error loading dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${apiHost}/api/transactions`,
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
            fetchViolations();
            fetchData(); // Refresh everything
        } catch (err) {
            console.error(err);
        }
    };

    const sumByType = (type, list = transactions) =>
        list.filter((tx) => tx.type === type).reduce((sum, tx) => sum + tx.amount, 0);

    const expenseTxns = transactions.filter((tx) => tx.type === "expense");
    const chartMap = {};

    expenseCategories.forEach((cat) => {
        chartMap[cat.category] = 0;
    });

    expenseTxns.forEach((tx) => {
        if (chartMap.hasOwnProperty(tx.category)) {
            chartMap[tx.category] += tx.amount;
        } else {
            chartMap[tx.category] = tx.amount;
        }
    });

    const categoryData = Object.entries(chartMap).map(([name, value]) => ({
        name,
        value,
    }));

    if (loading) return <Loader />;

    return (
        <div className="text-gray-800 px-4 sm:px-6 py-4">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Dashboard</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={["year", "month"]}
                                label="Select Month"
                                value={selectedMonth === "All" ? null : dayjs(selectedMonth)}
                                onChange={(newValue) =>
                                    setSelectedMonth(newValue ? newValue.format("YYYY-MM") : "All")
                                }
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        className: "bg-white rounded-5px w-full sm:w-auto",
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <button
                            onClick={() => setFormOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-5px text-sm font-bold w-full sm:w-auto"
                        >
                            <AddToPhotosSharpIcon /> Add Transaction
                        </button>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 mb-3">
                    {yearlySummary && (
                        <SummaryCards
                            income={yearlySummary.income}
                            expense={yearlySummary.expense}
                            balance={yearlySummary.balance}
                            monthlyChartData={yearlySummary.monthlyChartData}
                        />
                    )}
                    <MonthlySummary
                        income={sumByType("income")}
                        expense={sumByType("expense")}
                        balance={sumByType("income") - sumByType("expense")}
                        categoryData={categoryData}
                    />
                </div>

                {/* Chart and Table Section */}
                <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 mb-2">
                    <div className="w-full lg:w-1/3">
                        <CategoryCharts data={categoryData} />
                    </div>
                    <div className="w-full lg:w-2/3">
                        <TransactionTable transactions={transactions} />
                    </div>
                </div>

                {/* Modal */}
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
