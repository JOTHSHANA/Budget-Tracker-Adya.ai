import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/Transactions/TransactionForm";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import { BudgetAlertContext } from "../context/BudgetAlertContext";
import apiHost from "../components/utils/api";


const AddTransactionPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { fetchViolations } = useContext(BudgetAlertContext);

    const [form, setForm] = useState({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const fetchCategories = async (type) => {
        try {
            const res = await axios.get(`${apiHost}/api/budget-category/${type}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${apiHost}/api/transactions`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        fetchCategories(form.type);
        setForm((prev) => ({ ...prev, category: "" }));
    }, [form.type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${apiHost}/api/transactions`,
                {
                    ...form,
                    createdAt: new Date(form.date),
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            );
            setForm({
                type: "income",
                category: "",
                amount: "",
                note: "",
                date: new Date().toISOString().split("T")[0],
            });
            fetchTransactions();
            fetchViolations();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Transactions</h2>
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 items-start">
                    <TransactionForm
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                        categories={categories}
                        setCategories={setCategories}
                        fetchCategories={fetchCategories}
                        navigate={navigate}
                    />
                    <TransactionsTable
                        transactions={transactions}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddTransactionPage;