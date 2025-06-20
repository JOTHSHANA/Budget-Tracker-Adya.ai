import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [selectedMonth, setSelectedMonth] = useState("All");
  const { user } = useContext(AuthContext);

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
      setFormOpen(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const filterByMonth = (txns) => {
    if (selectedMonth === "All") return txns;
    return txns.filter((tx) => {
      const date = new Date(tx.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      return monthYear === selectedMonth;
    });
  };

  const filteredTxns = filterByMonth(transactions);

  const allIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const allExpense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const allBalance = allIncome - allExpense;

  const monthlyIncome = filteredTxns
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyExpense = filteredTxns
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyBalance = monthlyIncome - monthlyExpense;

  const chartData = filteredTxns.reduce((acc, txn) => {
    const key = txn.category;
    if (!acc[key]) acc[key] = 0;
    if (txn.type === "expense") acc[key] += txn.amount;
    return acc;
  }, {});

  const data = Object.keys(chartData).map((key) => ({
    name: key,
    value: chartData[key],
  }));

  const monthOptions = Array.from(
    new Set(
      transactions.map((tx) => {
        const date = new Date(tx.createdAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    )
  );

  return (
    <div className="min-h-screen bg-gray text-gray-800 px-4 py-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="All">All</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <button
              onClick={() => setFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
            >
              + Add Transaction
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">TOTAL</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                <h4 className="font-medium text-md">Total Income</h4>
                <p className="text-xl font-bold">₹ {allIncome}</p>
              </div>
              <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                <h4 className="font-medium text-md">Total Expense</h4>
                <p className="text-xl font-bold">₹ {allExpense}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                <h4 className="font-medium text-md">Balance</h4>
                <p className="text-xl font-bold">₹ {allBalance}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-bold mb-2">Monthly Income vs Expense</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.values(
                    transactions.reduce((acc, tx) => {
                      const date = new Date(tx.createdAt);
                      const month = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, "0")}`;
                      if (!acc[month])
                        acc[month] = { month, income: 0, expense: 0 };
                      acc[month][tx.type] += tx.amount;
                      return acc;
                    }, {})
                  )}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#82ca9d" />
                  <Bar dataKey="expense" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">MONTHLY</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <h4 className="font-medium text-sm">Monthly Income</h4>
                <p className="text-lg font-bold">₹ {monthlyIncome}</p>
              </div>
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                <h4 className="font-medium text-sm">Monthly Expense</h4>
                <p className="text-lg font-bold">₹ {monthlyExpense}</p>
              </div>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                <h4 className="font-medium text-sm">Monthly Balance</h4>
                <p className="text-lg font-bold">₹ {monthlyBalance}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-bold mb-2">Expenses by Category</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart & Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Expense by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Note</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id} className="border-t hover:bg-gray-50">
                      <td className="p-2 capitalize">{txn.type}</td>
                      <td className="p-2">{txn.category}</td>
                      <td className="p-2 text-blue-600">₹{txn.amount}</td>
                      <td className="p-2">{txn.note}</td>
                      <td className="p-2">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {formOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
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
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
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
                    onClick={() => setFormOpen(false)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
