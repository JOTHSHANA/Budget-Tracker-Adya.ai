import React from "react";

const TransactionForm = ({ form, setForm, handleSubmit, categories, fetchCategories, navigate }) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-5px shadow-custom w-full lg:max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={form.type}
                    onChange={(e) =>
                        setForm({ ...form, type: e.target.value, category: "" })
                    }
                    className="w-full px-3 py-2 border rounded-5px focus:outline-none"
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-5px focus:outline-none"
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
                    className="w-full px-3 py-2 border rounded-5px focus:outline-none"
                    required
                />
                <input
                    type="text"
                    placeholder="Note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3 py-2 border rounded-5px focus:outline-none"
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-5px focus:outline-none"
                    required
                />
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-5px text-sm font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-5px text-sm font-bold"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
