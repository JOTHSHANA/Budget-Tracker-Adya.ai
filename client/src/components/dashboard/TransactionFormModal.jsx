const TransactionFormModal = ({ form, setForm, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    placeholder="Note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default TransactionFormModal;