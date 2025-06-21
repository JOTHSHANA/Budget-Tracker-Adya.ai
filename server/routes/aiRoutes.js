const express = require("express");
const router = express.Router();
const { chatWithAI, getCategoryFromDescription, suggestPreferredCategory } = require("../controllers/aiController");

router.post("/chat", chatWithAI);
// router.post("/auto-category", getCategoryFromDescription);
// router.post("/preferred-category", suggestPreferredCategory);


module.exports = router;
