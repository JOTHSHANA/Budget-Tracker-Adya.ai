import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { AuthContext } from "../context/AuthContext";
import apiHost from "../components/utils/api";

const categoryIcons = {
    Salary: <AttachMoneyIcon className="text-green-600" />,
    Hospital: <LocalHospitalIcon className="text-red-500" />,
    Food: <FastfoodIcon className="text-orange-500" />,
    Bills: <ReceiptIcon className="text-blue-500" />,
};

function AIRecommandations() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching AI recommendations for user:", user._id);
            try {
                const res = await axios.post(`${apiHost}/api/ai/analyze-and-recommend/${user._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch AI recommendations", err);
            }
        };
        fetchData();
    }, [user]);

    if (!data) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="p-6 sm:p-10 bg-gradient-to-r from-blue-50 to-purple-100 min-h-screen text-gray-800">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-800">Your Financial Insights</h1>

            {/* User Profile Tag and Insight */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-8 border-purple-500">
                <h2 className="text-xl font-bold text-purple-700">Profile: {data.userProfile.tag}</h2>
                <p className="mt-2 text-gray-700">{data.userProfile.insight}</p>
            </div>

            {/* Top Spending Categories */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">Top Spending Categories</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {data.topSpendingCategories.map(({ category, percent }) => (
                        <div
                            key={category}
                            className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all border-b-4 border-purple-200"
                        >
                            {categoryIcons[category] || <EmojiObjectsIcon />}
                            <div>
                                <h4 className="font-semibold text-lg">{category}</h4>
                                <p className="text-sm text-gray-600">{percent}% of total</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Income to Expense Ratio */}
            <div className="mb-6 bg-white shadow-md rounded-xl p-4 border-l-8 border-green-400">
                <h3 className="text-lg font-semibold text-green-700">Income to Expense Ratio</h3>
                <p className="text-2xl font-bold text-green-800">{data.incomeToExpenseRatio}</p>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">AI Recommendations</h3>
                <ul className="space-y-4">
                    {data.suggestions.map((suggestion, index) => (
                        <li key={index} className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg shadow-sm">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Similar Profiles */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">Similar Profiles</h3>
                {data.recommendations.map((rec) => (
                    <div key={rec.id} className="bg-white shadow rounded-xl p-4 mb-2">
                        <p className="font-semibold text-gray-800">{rec.name} ({rec.email})</p>
                        <p className="text-sm text-gray-600">Profile: {rec.profile} | Similarity Score: {rec.score}</p>
                    </div>
                ))}
            </div>

            {/* Notes Analysis */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">Keywords From Notes</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {data.notesAnalysis.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl shadow">
                            <h4 className="font-bold text-purple-600">{item.note}</h4>
                            <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                                {item.keywords.map((word, i) => <li key={i}>{word}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AIRecommandations;
