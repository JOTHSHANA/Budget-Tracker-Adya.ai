const BudgetCategory = require("../models/BudgetCategory");

// @desc Add new budget category
exports.addCategory = async (req, res) => {
    try {
        const { category, percentage, type } = req.body;

        if (!category || !type) {
            return res.status(400).json({ error: "Category and type are required" });
        }

        const newCategory = new BudgetCategory({
            user: req.user.id,
            category,
            percentage: type === "expense" ? percentage : null,
            type
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        console.error("Add category error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Get all budget categories by type
exports.getCategoriesByType = async (req, res) => {
    try {
        const type = req.params.type; // "income" or "expense"

        const categories = await BudgetCategory.find({
            user: req.user.id,
            type
        }).sort({ createdAt: -1 });

        res.status(200).json(categories);
    } catch (err) {
        console.error("Fetch categories error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// @desc Update a budget category
exports.updateCategory = async (req, res) => {
    try {
        const { category, percentage } = req.body;

        const updated = await BudgetCategory.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                category,
                ...(percentage !== undefined && { percentage }),
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(updated);
    } catch (err) {
        console.error("Update category error:", err);
        res.status(500).json({ error: "Server error" });
    }
};



// @desc Delete a budget category
exports.deleteCategory = async (req, res) => {
    try {
        const deleted = await BudgetCategory.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete category error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
