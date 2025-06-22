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

    const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

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

        <div className="p-3 sm:p-10 text-gray-800">
            <h1 className="text-3xl sm:text-2xl font-bold mb-6">Your Financial Insights</h1>
            <div className="flex gap-2">
                <div className="flex-1 flex gap-3 items-center justify-center bg-white rounded-5px shadow-md p-6 mb-3">
                    <div className="w-40 h-40 flex items-center justify-center rounded-full border-2 border-dashed border-black bg-mint-green font-bold text-6xl">
                        {getInitial(user?.name)}
                    </div>
                    <div className="flex-1 ml-7">
                        <div className="flex">
                            <p className="text-3xl sm:text-2xl"> {user?.name}-</p>
                            <h2 className="text-2xl font-bold text-mint-green">{data.userProfile.tag}</h2>
                        </div>
                        <p className="mt-2 text-gray-700">{data.userProfile.insight}</p>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-5px shadow-md p-6 mb-3">
                    {/* Top Spending Categories */}
                    <h3 className="text-xl font-semibold text-mint-green mb-4">Top Spending Categories</h3>
                    <hr />
                    <br />
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-2">
                        {data.topSpendingCategories.map(({ category, percent }) => (
                            <div
                                key={category}
                                className="bg-white border-2 border-dashed border-gray rounded-5px p-4 flex items-center gap-4"
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
            </div>
            <div className="flex gap-2 mb-3">
                {/* Income to Expense Ratio */}
                {/* <div className="flex-1 p-3 rounded-5px shadow-md bg-white">
                    <h3 className="text-lg font-semibold text-green-700">Income to Expense Ratio</h3>
                    <p className="text-2xl font-bold text-green-800">{data.incomeToExpenseRatio}</p>
                </div> */}
                <div className="flex-1 p-3 bg-white rounded-5px shadow-md">
                    {/* Recommendations */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-mint-green mb-4">AI Recommendations</h3>
                        <hr />
                    <br />
                        <ul className="space-y-4">
                            {data.suggestions.map((suggestion, index) => (
                                <li key={index} className="bg-gray-100 border-l-4 border-mint-green p-4 rounded-lg shadow-sm">
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mb-3">
                <div className="flex-1 p-3 rounded-5px shadow-md bg-white">
                    <h3 className="text-xl font-semibold text-mint-green mb-2">Income to Expense Ratio</h3>

                    <hr />
                    <br />
                    <p className="text-2xl font-bold text-green-800">{data.incomeToExpenseRatio}</p>
                </div>
                <div className="flex-1 p-3 bg-white rounded-5px shadow-md">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-mint-green mb-2">Similar Profiles</h3>
                        <hr />
                    <br />
                        {data.recommendations.map((rec) => (
                            <div key={rec.id} className="bg-white shadow rounded-xl p-4 mb-2">
                                <p className="font-semibold text-gray-800">{rec.name} ({rec.email})</p>
                                <p className="text-sm text-gray-600">Profile: {rec.profile} | Similarity Score: {rec.score}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-5px shadow-md p-3">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-mint-green mb-4">Keywords From Notes</h3>
                    <hr />
                    <br />
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {data.notesAnalysis.map((item, idx) => (
                            <div key={idx} className="bg-white border-2 border-dashed border-gray rounded-xl p-3">
                                <h4 className="font-bold text-mint-green">{item.note}</h4>
                                <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                                    {item.keywords.map((word, i) => <li key={i}>{word}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AIRecommandations;
