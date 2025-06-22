// src/pages/BudgetFix.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import DeleteSweepSharpIcon from '@mui/icons-material/DeleteSweepSharp';
import AddToPhotosSharpIcon from '@mui/icons-material/AddToPhotosSharp';
import apiHost from "../components/utils/api";
import Loader from "../components/Loader";

const BudgetFix = () => {
    const { user } = useContext(AuthContext);
    const [popupOpen, setPopupOpen] = useState(false);
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [percentage, setPercentage] = useState("");
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loadingIncome, setLoadingIncome] = useState(true);
    const [loadingExpense, setLoadingExpense] = useState(true);
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);


    const [incomePage, setIncomePage] = useState(0);
    const [incomeRowsPerPage, setIncomeRowsPerPage] = useState(5);
    const [expensePage, setExpensePage] = useState(0);
    const [expenseRowsPerPage, setExpenseRowsPerPage] = useState(5);

    const paginate = (data, page, rows) => data.slice(page * rows, page * rows + rows);

    useEffect(() => {
        if (localStorage.getItem("justRegistered") === "true") {
            setShowWelcomePopup(true);
            localStorage.removeItem("justRegistered"); // remove so it's shown only once
        }
    }, []);


    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!category || (type === "expense" && !percentage)) {
            return alert("Please fill all required fields");
        }

        try {
            if (editId) {
                await axios.put(
                    `${apiHost}/api/budget-category/${editId}`,
                    {
                        category,
                        ...(type === "expense" && { percentage }),
                    },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                alert("Category updated successfully");
            } else {
                await axios.post(
                    `${apiHost}/api/budget-category`,
                    {
                        category,
                        type,
                        ...(type === "expense" && { percentage }),
                    },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                alert("Category added successfully");
            }

            setCategory("");
            setPercentage("");
            setEditId(null);
            setPopupOpen(false);
            fetchAllCategories();
        } catch (err) {
            console.error("Save category error:", err);
            alert("Something went wrong!");
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this category?");
        if (!confirm) return;

        try {
            await axios.delete(`${apiHost}/api/budget-category/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert("Deleted successfully");
            fetchAllCategories();
        } catch (err) {
            console.error("Delete error", err);
            alert("Failed to delete.");
        }
    };

    const fetchAllCategories = async () => {
        setLoadingIncome(true);
        setLoadingExpense(true);
        try {
            const [incomeRes, expenseRes] = await Promise.all([
                axios.get(`${apiHost}/api/budget-category/income`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                }),
                axios.get(`${apiHost}/api/budget-category/expense`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                }),
            ]);
            setIncomeCategories(incomeRes.data);
            setExpenseCategories(expenseRes.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        } finally {
            setLoadingIncome(false);
            setLoadingExpense(false);
        }
    };

    useEffect(() => {
        if (popupOpen) {
            setCategory("");
            setPercentage("");
        }
    }, [popupOpen]);

    useEffect(() => {
        if (!popupOpen) {
            setCategory("");
            setPercentage("");
            setEditId(null);
        }
    }, [popupOpen]);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    return (
        <div className="bg-gray-100 px-4 py-6">
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold">Budget Categories</h2>
                    <button
                        onClick={() => setPopupOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-5px text-sm font-bold"
                    >
                        <AddToPhotosSharpIcon /> Add Category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {/* Income Categories */}
                    <div className="bg-white p-4 rounded-5px shadow-custom overflow-x-auto">
                        <h3 className="text-xl font-semibold mb-3">Income Categories</h3>
                        {loadingIncome ? (
                            <Loader />
                        ) : incomeCategories.length === 0 ? (
                            <p className="text-gray-500">No categories found.</p>
                        ) : (
                            <>
                                <table className="min-w-full text-sm border">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="text-left px-3 py-2">Category</th>
                                            <th className="text-right px-3 py-2">Percentage</th>
                                            <th className="text-right px-3 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginate(incomeCategories, incomePage, incomeRowsPerPage).map((cat) => (
                                            <tr key={cat._id} className="border-t">
                                                <td className="px-3 py-2">{cat.category}</td>
                                                <td className="px-3 py-2 text-right">{cat.percentage ? `${cat.percentage}%` : "-"}</td>
                                                <td className="px-3 py-2 text-right space-x-2">
                                                    <button
                                                        className="text-blue-600 hover:underline text-sm font-bold"
                                                        onClick={() => {
                                                            setCategory(cat.category);
                                                            setType(cat.type);
                                                            setPercentage(cat.percentage || "");
                                                            setEditId(cat._id);
                                                            setPopupOpen(true);
                                                        }}
                                                    >
                                                        <DriveFileRenameOutlineSharpIcon />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:underline text-sm font-bold"
                                                        onClick={() => handleDelete(cat._id)}
                                                    >
                                                        <DeleteSweepSharpIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-center mt-3 text-sm">
                                    <div className="flex gap-2 items-center">
                                        <span>Rows per page:</span>
                                        <select
                                            value={incomeRowsPerPage}
                                            onChange={(e) => {
                                                setIncomeRowsPerPage(parseInt(e.target.value));
                                                setIncomePage(0);
                                            }}
                                            className="border px-2 py-1 rounded-md"
                                        >
                                            {[5, 10, 15].map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIncomePage((prev) => Math.max(prev - 1, 0))}
                                            disabled={incomePage === 0}
                                            className="px-2 py-1 text-gray-600 disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => setIncomePage((prev) =>
                                                (prev + 1) * incomeRowsPerPage < incomeCategories.length ? prev + 1 : prev
                                            )}
                                            disabled={(incomePage + 1) * incomeRowsPerPage >= incomeCategories.length}
                                            className="px-2 py-1 text-gray-600 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Expense Categories */}
                    <div className="bg-white p-4 rounded-5px shadow-custom overflow-x-auto">
                        <h3 className="text-xl font-semibold mb-3">Expense Categories</h3>
                        {loadingExpense ? (
                            <Loader />
                        ) : expenseCategories.length === 0 ? (
                            <p className="text-gray-500">No categories found.</p>
                        ) : (
                            <>
                                <table className="min-w-full text-sm border">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="text-left px-3 py-2">Category</th>
                                            <th className="text-right px-3 py-2">Percentage</th>
                                            <th className="text-right px-3 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginate(expenseCategories, expensePage, expenseRowsPerPage).map((cat) => (
                                            <tr key={cat._id} className="border-t">
                                                <td className="px-3 py-2">{cat.category}</td>
                                                <td className="px-3 py-2 text-right">{cat.percentage ? `${cat.percentage}%` : "-"}</td>
                                                <td className="px-3 py-2 text-right space-x-2">
                                                    <button
                                                        className="text-blue-600 hover:underline text-sm font-bold"
                                                        onClick={() => {
                                                            setCategory(cat.category);
                                                            setType(cat.type);
                                                            setPercentage(cat.percentage || "");
                                                            setEditId(cat._id);
                                                            setPopupOpen(true);
                                                        }}
                                                    >
                                                        <DriveFileRenameOutlineSharpIcon />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:underline text-sm font-bold"
                                                        onClick={() => handleDelete(cat._id)}
                                                    >
                                                        <DeleteSweepSharpIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-center mt-3 text-sm">
                                    <div className="flex gap-2 items-center">
                                        <span>Rows per page:</span>
                                        <select
                                            value={expenseRowsPerPage}
                                            onChange={(e) => {
                                                setExpenseRowsPerPage(parseInt(e.target.value));
                                                setExpensePage(0);
                                            }}
                                            className="border px-2 py-1 rounded-md"
                                        >
                                            {[5, 10, 15].map((num) => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setExpensePage((prev) => Math.max(prev - 1, 0))}
                                            disabled={expensePage === 0}
                                            className="px-2 py-1 text-gray-600 disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => setExpensePage((prev) =>
                                                (prev + 1) * expenseRowsPerPage < expenseCategories.length ? prev + 1 : prev
                                            )}
                                            disabled={(expensePage + 1) * expenseRowsPerPage >= expenseCategories.length}
                                            className="px-2 py-1 text-gray-600 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup Modal */}
            {popupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-6 rounded-5px shadow-custom w-full max-w-md relative">
                        <button
                            onClick={() => setPopupOpen(false)}
                            className="absolute top-2 right-3 text-xl font-bold text-gray-500"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-bold mb-4">
                            {editId ? "Edit Category" : "Add New Category"}
                        </h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-5px"
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Category Name"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border rounded-5px"
                                required
                            />

                            {type === "expense" && (
                                <input
                                    type="number"
                                    placeholder="Max percentage use%"
                                    value={percentage}
                                    onChange={(e) => setPercentage(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-5px"
                                    required
                                />
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-5px font-bold"
                            >
                                {editId ? "Update Category" : "Add Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}


            {showWelcomePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white p-6 rounded-5px shadow-custom w-full max-w-md relative">
                        <button
                            onClick={() => setShowWelcomePopup(false)}
                            className="absolute top-2 right-3 text-xl font-bold text-gray-500"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-bold mb-3">Welcome to Budget Tracker!</h3>
                        <ul className="list-disc list-inside text-sm space-y-2">
                            <li>This is where you define your income and expense categories.</li>
                            <li>For expenses, assign a max usage percentage for alerts.</li>
                            <li>Click “Add Category” to create new categories and proceed with the other pages.</li>
                            <li>You can edit or delete categories anytime.</li>
                        </ul>
                        <button
                            onClick={() => setShowWelcomePopup(false)}
                            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-5px font-bold"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BudgetFix;
