const express = require("express");
const router = express.Router();
const { addCategory, getCategoriesByType, updateCategory, deleteCategory } = require("../controllers/budgetCategoryController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addCategory);
router.get("/:type", protect, getCategoriesByType);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);


module.exports = router;
