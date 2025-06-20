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

const MonthlySummary = ({ income, expense, balance, categoryData }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">MONTHLY</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <h4>Monthly Income</h4>
                <p className="text-lg font-bold">₹ {income}</p>
            </div>
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                <h4>Monthly Expense</h4>
                <p className="text-lg font-bold">₹ {expense}</p>
            </div>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                <h4>Monthly Balance</h4>
                <p className="text-lg font-bold">₹ {balance}</p>
            </div>
        </div>
        <div className="mt-4">
            <h4 className="font-bold mb-2">Expenses by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default MonthlySummary;