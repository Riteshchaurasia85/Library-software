const express =
require('express');

const router =
express.Router();

const libraryController =
require('../Controllers/libraryController');

// SHOW LIBRARY
router.get(
'/library',
libraryController.libraryPage
);

// ADD PAGE
router.get(
'/add-course',
libraryController.addPage
);

// SAVE COURSE
router.post(
'/add-course',
libraryController.addCourse
);

module.exports =
router;