// src/components/dashboard/MonthlySummary.jsx

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const MonthlySummary = ({ income, expense, balance, categoryData }) => {
    const [page, setPage] = useState(0);
    const pageSize = 5;

    const paginatedData = categoryData.slice(
        page * pageSize,
        page * pageSize + pageSize
    );

    const totalPages = Math.ceil(categoryData.length / pageSize);

    return (
        <div className="bg-white p-6 rounded-5px shadow-custom">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">MONTHLY</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 text-green-800 p-4 rounded-5px">
                    <h4>Monthly Income</h4>
                    <p className="text-lg font-bold">₹ {income}</p>
                </div>
                <div className="bg-red-50 text-red-800 p-4 rounded-5px">
                    <h4>Monthly Expense</h4>
                    <p className="text-lg font-bold">₹ {expense}</p>
                </div>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-5px">
                    <h4>Monthly Balance</h4>
                    <p className="text-lg font-bold">₹ {balance}</p>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="font-bold mb-2">Expenses by Category</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={paginatedData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Pagination Controls */}
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-5px disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-2 text-sm font-medium text-gray-700">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-px disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MonthlySummary;
