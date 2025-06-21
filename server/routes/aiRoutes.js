const express = require("express");
const router = express.Router();
const { chatWithAI, getCategoryFromDescription, suggestPreferredCategory } = require("../controllers/aiController");
const aiController = require("../controllers/ai_Controller");

router.post("/chat", chatWithAI);
// router.post("/analyze", aiController.analyzeNote);
// router.get("/recommend/:userId", aiController.getRecommendations);
router.post("/analyze-and-recommend/:userId", aiController.analyzeAndRecommend);

// router.post("/auto-category", getCategoryFromDescription);
// router.post("/preferred-category", suggestPreferredCategory);


module.exports = router;