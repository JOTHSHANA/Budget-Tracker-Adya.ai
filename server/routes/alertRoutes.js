const express = require("express");
const router = express.Router();
const { checkBudgetViolations } = require("../controllers/alertController");
const { protect } = require("../middleware/authMiddleware");

router.get("/budget-check", protect, checkBudgetViolations);

module.exports = router;
