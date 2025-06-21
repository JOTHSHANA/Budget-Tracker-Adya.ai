// const Transaction = require("../models/Transaction");

// const getTransactionsByMonth = async (req, res) => {
//     const userId = req.user.id;
//     const { month } = req.query; // Expected format: "2025-06"

//     if (!month || !/^\d{4}-\d{2}$/.test(month)) {
//         return res.status(400).json({ error: "Invalid or missing month (format: YYYY-MM)" });
//     }

//     try {
//         const [year, mon] = month.split("-");
//         const startDate = new Date(`${year}-${mon}-01T00:00:00.000Z`);
//         const endDate = new Date(startDate);
//         endDate.setMonth(endDate.getMonth() + 1); // move to 1st of next month

//         const transactions = await Transaction.find({
//             user: userId,
//             createdAt: {
//                 $gte: startDate,
//                 $lt: endDate,
//             },
//         }).sort({ createdAt: -1 });

//         res.status(200).json(transactions);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// };

// module.exports = {
//     getTransactionsByMonth,
// };
