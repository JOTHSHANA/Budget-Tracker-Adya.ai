const mongoose = require("mongoose");

const budgetCategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        default: null,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("BudgetCategory", budgetCategorySchema);
