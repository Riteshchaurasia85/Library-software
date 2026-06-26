const express = require("express");
const router = express.Router();
const birthdayController = require("../Controllers/birthdayController");

// Get birthdays page
router.get("/birthday", birthdayController.getBirthdays);

module.exports = router;
