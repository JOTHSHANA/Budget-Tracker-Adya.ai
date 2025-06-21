import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import apiHost from "../utils/api";

const TransactionFormModal = ({ form, setForm, onClose, onSubmit }) => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async (type) => {
        try {
            const res = await axios.get(`${apiHost}/api/budget-category/${type}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    useEffect(() => {
        if (form.type) {
            fetchCategories(form.type);
            setForm((prev) => ({ ...prev, category: "" }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.type]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-5px w-full max-w-md shadow-custom">
                <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-5px"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-5px"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.category}>
                                {cat.category}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-5px"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        className="w-full px-3 py-2 border rounded-5px"
                    />
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-5px"
                        required
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-5px">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-5px">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
