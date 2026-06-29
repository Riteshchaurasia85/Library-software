const express = require("express");
const router = express.Router();
const testController = require("../Controllers/testController");

// ===== AI =====
router.post("/ai/generate-questions", testController.generateAIQuestions);
router.get("/meta/categories", testController.getCategories);

// ===== Test =====
router.post("/create", testController.createTest);
router.get("/all", testController.getAllTests);

// ===== Public =====
router.get("/public/:publicLink", testController.getTestByPublicLink);
router.get("/take-test/:publicLink", testController.takeTest);

// ===== Publish =====
router.post("/:testId/publish", testController.publishTest);

// ===== Questions =====
router.post("/:testId/questions", testController.addQuestion);
router.put("/questions/:questionId", testController.updateQuestion);
router.delete("/questions/:questionId", testController.deleteQuestion);

// ===== Student =====
router.post("/:testId/submit", testController.submitTestResponse);

// ===== Results =====
router.get("/:testId/results", testController.getTestResults);
router.put("/response/:responseId/evaluate/:answerId", testController.evaluateAnswer);
router.get("/test-results/:responseId", testController.renderTestResultsPage);
router.get("/test-builder/:testId", testController.renderTestBuilderPage);

// ===== Dynamic routes (LAST) =====
router.get("/:testId", testController.getTestById);
router.put("/:testId", testController.updateTest);
router.delete("/:testId", testController.deleteTest);

module.exports = router;