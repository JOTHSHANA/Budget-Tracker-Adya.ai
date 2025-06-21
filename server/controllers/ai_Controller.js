const { analyzeNoteJS } = require("../ai/analyzeNote");
const Transaction = require('../models/Transaction');
const { getUserPreferences, recommendForUser } = require("../ai/recommend");
const { getSuggestionsFromGemini } = require("../utils/geminiSuggest");
const { getUserProfileFromGemini } = require("../utils/geminiProfile");

// Extract top 3 categories by percentage
function getTopSpendingCategories(preferences) {
  return Object.entries(preferences)
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
    .slice(0, 3)
    .map(([category, percent]) => ({ category, percent }));
}

// Sum category totals from transactions
function getCategoryTotals(transactions) {
  const totals = {};
  transactions.forEach(tx => {
    if (!totals[tx.category]) totals[tx.category] = 0;
    totals[tx.category] += tx.amount;
  });
  return totals;
}

// Compute income-to-expense ratio
function getIncomeToExpenseRatio(transactions) {
  let income = 0, expense = 0;
  transactions.forEach(tx => {
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  });
  return expense > 0 ? (income / expense).toFixed(2) : "N/A";
}

exports.analyzeAndRecommend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ user: userId });

    // 1. Analyze notes
    const notesAnalysis = [];
    for (const tx of transactions) {
      if (tx.note) {
        const result = analyzeNoteJS(tx.note);
        notesAnalysis.push({ note: tx.note, keywords: result.keywords });
      }
    }

    // 2. Preferences and category totals
    const preferences = await getUserPreferences(userId);
    const categoryTotals = getCategoryTotals(transactions);
    const topSpendingCategories = getTopSpendingCategories(preferences);
    const incomeToExpenseRatio = getIncomeToExpenseRatio(transactions);

    // 3. Gemini - generate user profile
    const userProfile = await getUserProfileFromGemini(preferences);

    // 4. Gemini - generate suggestions
    const suggestions = await getSuggestionsFromGemini(
      preferences,
      userProfile.tag,
      topSpendingCategories
    );

    // 5. Recommend similar users
    const recommendations = await recommendForUser(userId);

    // 6. Send full response
    res.json({
      preferences,
      categoryTotals,
      topSpendingCategories,
      incomeToExpenseRatio,
      userProfile,
      notesAnalysis,
      recommendations,
      suggestions
    });

  } catch (err) {
    console.error("Error in analyzeAndRecommend:", err);
    res.status(500).json({ error: err.message });
  }
};