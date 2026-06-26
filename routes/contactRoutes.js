const express = require("express");
const router = express.Router();

const contactController = require("../Controllers/contactController");

router.get("/",contactController.getContactPage);

router.post("/send",contactController.sendMessage);

module.exports = router;