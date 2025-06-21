const chatWithAI = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Simple mock logic
    let reply = "";

    const lower = message.toLowerCase();
    if (lower.includes("save") || lower.includes("saving")) {
        reply = "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Track your expenses weekly!";
    } else if (lower.includes("expenses") || lower.includes("reduce expenses")) {
        reply = "List all expenses and identify non-essentials. Cancel unused subscriptions and limit food delivery.";
    } else if (lower.includes("budget") || lower.includes("monthly budget")) {
        reply = "Use a budgeting method like zero-based or envelope budgeting. Review your budget weekly.";
    } else if (lower.includes("income")) {
        reply = "Try increasing income through freelance gigs, tutoring, or internships alongside your main source.";
    } else if (lower.includes("student") || lower.includes("college")) {
        reply = "As a student, limit spending to essentials. Track books, food, transport, and cut out impulse buys.";
    } else if (lower.includes("debt")) {
        reply = "Pay high-interest debts first (like credit cards). Try the debt snowball or avalanche method.";
    } else if (lower.includes("emergency fund")) {
        reply = "Save at least 3-6 months of expenses in a separate account for emergencies. Start small, be consistent.";
    } else if (lower.includes("food") || lower.includes("groceries")) {
        reply = "Plan meals, cook in bulk, avoid eating out, and shop with a grocery list to reduce food spending.";
    } else if (lower.includes("transport") || lower.includes("commute")) {
        reply = "Use public transport, bike or walk when possible. Combine trips to save on fuel.";
    } else if (lower.includes("subscription") || lower.includes("netflix")) {
        reply = "Cancel unused subscriptions. Share streaming accounts with family or friends if allowed.";
    } else if (lower.includes("vacation") || lower.includes("travel")) {
        reply = "Set a clear travel budget, book in advance, and track spending using a trip planner or travel app.";
    } else if (lower.includes("bye") || lower.includes("tata")) {
        reply = "byee byee!!";
    } else if (lower.includes("hello") || lower.includes("hii") || lower.includes("good")) {
        reply = "Hii! How can i help you?";
    } else {
        reply = "That’s a great question! Try asking things like 'How to reduce food expenses?' or 'How to budget as a student?'.";
    }

    res.json({ reply });
};



// controllers/aiController.js
const getCategoryFromDescription = async (req, res) => {
    const { description } = req.body;

    const lower = description.toLowerCase();
    let category = "Other";

    if (lower.includes("pizza") || lower.includes("restaurant") || lower.includes("starbucks")) {
        category = "Food";
    } else if (lower.includes("uber") || lower.includes("bus") || lower.includes("train")) {
        category = "Transport";
    } else if (lower.includes("zara") || lower.includes("amazon")) {
        category = "Shopping";
    } else if (lower.includes("rent") || lower.includes("house")) {
        category = "Housing";
    }

    res.json({ category });
};

const suggestPreferredCategory = async (req, res) => {
    // Simulate based on history (in real use, query DB)
    const simulatedPreferences = {
        userId: req.body.userId,
        preferences: ["Food", "Shopping"],
    };

    res.json(simulatedPreferences);
};




module.exports = { chatWithAI, getCategoryFromDescription, suggestPreferredCategory };
