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

const SummaryCards = ({ income, expense, balance, monthlyChartData }) => (
    <div className="bg-white p-6 rounded-5px shadow-custom">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">OVERALL</h3>
        <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-5px">
                <h4>Total Income</h4>
                <p className="text-xl font-bold">₹ {income}</p>
            </div>
            <div className="bg-red-100 text-red-800 p-4 rounded-5px">
                <h4>Total Expense</h4>
                <p className="text-xl font-bold">₹ {expense}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 p-4 rounded-5px">
                <h4>Balance</h4>
                <p className="text-xl font-bold">₹ {balance}</p>
            </div>
        </div>
        <div className="mt-4">
            <h4 className="font-bold mb-2">Monthly Income vs Expense</h4>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyChartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" fill="#82ca9d" />
                    <Bar dataKey="expense" fill="#f87171" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default SummaryCards;