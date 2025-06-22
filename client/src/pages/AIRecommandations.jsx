import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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
            try {
                const res = await axios.post(
                    `${apiHost}/api/ai/analyze-and-recommend/${user._id}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                );
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch AI recommendations", err);
            }
        };
        fetchData();
    }, [user]);

    if (!data) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="p-4 sm:p-6 text-gray-800">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                Your Financial Insights
            </h1>

            {/* Profile and Top Categories */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
                {/* Profile Summary */}
                <div className="w-full bg-white rounded-md shadow-md p-5 flex flex-col sm:flex-row items-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center rounded-full border-2 border-dashed border-black bg-mint-green font-bold text-5xl sm:text-6xl">
                        {getInitial(user?.name)}
                    </div>
                    <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-1">
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xl font-semibold">
                            <p>{user?.name} -</p>
                            <p className="text-[#39c184]">{data.userProfile.tag}</p>
                        </div>
                        <p className="mt-2 text-gray-700">{data.userProfile.insight}</p>
                    </div>
                </div>

                {/* Top Spending Categories */}
                <div className="w-full bg-white rounded-md shadow-md p-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#39c184] mb-4">
                        Top Spending Categories
                    </h3>
                    <hr className="mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.topSpendingCategories.map(({ category, percent }) => (
                            <div
                                key={category}
                                className="bg-white border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center gap-4"
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

            {/* Recommendations and Ratio */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
                {/* AI Recommendations */}
                <div className="w-full bg-white rounded-md shadow-md p-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#39c184] mb-4">
                        AI Recommendations
                    </h3>
                    <hr className="mb-4" />
                    <ul className="space-y-4">
                        {data.suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="bg-gray-100 border-l-4 border-[#39c184] p-4 rounded-lg shadow-sm"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Income to Expense Ratio */}
                <div className="w-full bg-white rounded-md shadow-md p-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#39c184] mb-4">
                        Income to Expense Ratio
                    </h3>
                    <hr className="mb-4" />
                    <p className="text-2xl font-bold text-green-700">
                        {data.incomeToExpenseRatio}
                    </p>
                </div>
            </div>

            {/* Similar Profiles */}
            <div className="w-full bg-white rounded-md shadow-md p-5 mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#39c184] mb-4">
                    Similar Profiles
                </h3>
                <hr className="mb-4" />
                {data.recommendations.map((rec) => (
                    <div
                        key={rec.id}
                        className="bg-gray-50 shadow-sm rounded-md p-4 mb-3"
                    >
                        <p className="font-semibold text-gray-800">
                            {rec.name} ({rec.email})
                        </p>
                        <p className="text-sm text-gray-600">
                            Profile: {rec.profile} | Similarity Score: {rec.score}
                        </p>
                    </div>
                ))}
            </div>

            {/* Notes Analysis */}
            <div className="w-full bg-white rounded-md shadow-md p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-[#39c184] mb-4">
                    Keywords From Notes
                </h3>
                <hr className="mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.notesAnalysis.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white border-2 border-dashed border-gray-300 rounded-md p-3"
                        >
                            <h4 className="font-bold text-[#39c184]">{item.note}</h4>
                            <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                                {item.keywords.map((word, i) => (
                                    <li key={i}>{word}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AIRecommandations;
