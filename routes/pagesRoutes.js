const express = require('express');
const router = express.Router();
const pageController = require('../Controllers/pageController');

router.get('/', pageController.rootRedirect);
router.get('/dashboard', pageController.dashboard);
router.get('/create-test', pageController.createTestPage);
router.get('/tests/all', pageController.viewAllTests);
router.get('/test-builder/:testId', pageController.testBuilder);
// router.get('/take-test/:publicLink', pageController.takeTestPublic);
router.get('/test-results/:responseId', pageController.testResults);
router.get('/page/:page', pageController.renderPage);

module.exports = router;
