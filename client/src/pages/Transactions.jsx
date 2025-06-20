import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";

const AddTransactionPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        type: "income",
        category: "",
        amount: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [transactions, setTransactions] = useState([]);

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

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/transactions",
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
        } catch (err) {
            console.error(err);
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedTransactions = transactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex gap-6 items-start">
                {/* Transaction Form */}
                <div className="bg-white p-6 rounded-lg shadow-xl flex-1 max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-center">Add Transaction</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Category"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Note"
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            required
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>

                {/* Transactions Table */}
                {/* Transactions Table */}
                <div className="bg-white p-6 rounded-xl shadow-md flex-[2] w-full">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Recent Transactions</h3>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Note</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedTransactions.map((txn) => (
                                    <TableRow key={txn._id}>
                                        <TableCell sx={{ textTransform: "capitalize" }}>{txn.type}</TableCell>
                                        <TableCell>{txn.category}</TableCell>
                                        <TableCell sx={{ color: "#2563EB" }}>₹{txn.amount}</TableCell>
                                        <TableCell>{txn.note}</TableCell>
                                        <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                                {paginatedTransactions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ color: "#888" }}>
                                            No transactions yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={transactions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </div>

            </div>
        </div>
    );
};

export default AddTransactionPage;
