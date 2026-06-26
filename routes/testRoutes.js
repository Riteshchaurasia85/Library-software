const express = require("express");
const router = express.Router();
const testController = require("../Controllers/testController");

// Test CRUD routes
router.post("/create", testController.createTest);
router.get("/all", testController.getAllTests);
router.get("/:testId", testController.getTestById);
router.put("/:testId", testController.updateTest);
router.delete("/:testId", testController.deleteTest);

// Question routes
router.post("/:testId/questions", testController.addQuestion);
router.put("/questions/:questionId", testController.updateQuestion);
router.delete("/questions/:questionId", testController.deleteQuestion);

// Publish and share
router.post("/:testId/publish", testController.publishTest);
router.get("/public/:publicLink", testController.getTestByPublicLink);

// Student test submission
router.post("/:testId/submit", testController.submitTestResponse);

// Results and evaluation
router.get("/:testId/results", testController.getTestResults);
router.put("/response/:responseId/evaluate/:answerId", testController.evaluateAnswer);

// AI and Categories
router.post("/ai/generate-questions", testController.generateAIQuestions);
router.get("/meta/categories", testController.getCategories);

router.get("/take-test/:publicLink", testController.takeTest);

router.get("/test-results/:responseId", testController.renderTestResultsPage);
router.get("/test-builder/:testId", testController.renderTestBuilderPage);

module.exports = router;
