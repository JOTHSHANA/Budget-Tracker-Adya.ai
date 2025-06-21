const Transaction = require("../models/Transaction");
const User = require("../models/User");

async function getUserPreferences(userId) {
    const transactions = await Transaction.find({ user: userId });
    let totalIncome = 0, totalExpense = 0;
    const categorySums = {};

    transactions.forEach(tx => {
        if (!categorySums[tx.category]) categorySums[tx.category] = 0;
        categorySums[tx.category] += tx.amount;
        if (tx.type === 'income') totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    const preferences = {};
    for (const [category, amount] of Object.entries(categorySums)) {
        const base = transactions.find(t => t.category === category)?.type === 'income' ? totalIncome : totalExpense;
        preferences[category] = ((amount / (base || 1)) * 100).toFixed(2);
    }

    return preferences;
}

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB || 1);
}

function generateUserProfile(preferences) {
    if (preferences.Hospital && parseFloat(preferences.Hospital) > 50) {
        return "Health Spender";
    }
    if (preferences.Food && parseFloat(preferences.Food) > 40) {
        return "Foodie";
    }
    if (preferences.Shopping && parseFloat(preferences.Shopping) > 30) {
        return "Shopper";
    }
    return "Balanced Spender";
}

async function recommendForUser(userId) {
    const currentPrefs = await getUserPreferences(userId);
    const allUsers = await User.find({ _id: { $ne: userId } });

    const userVectors = await Promise.all(allUsers.map(async user => {
        const prefs = await getUserPreferences(user._id);
        return { user, prefs };
    }));

    const currentVector = Object.values(currentPrefs).map(Number);
    const similarities = userVectors.map(({ user, prefs }) => {
        const alignedVector = Object.keys(currentPrefs).map(k => Number(prefs[k] || 0));
        const score = cosineSimilarity(currentVector, alignedVector);

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            score: parseFloat(score.toFixed(2)),
            profile: generateUserProfile(prefs)
        };
    });

    return similarities
        .filter(u => u.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

module.exports = {
    getUserPreferences,
    recommendForUser
};