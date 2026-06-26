const express = require("express");
const router = express.Router();

const whiteboardController = require("../Controllers/whiteboardController");

router.post(
    "/whiteboard/save",
    whiteboardController.saveWhiteboard
);

router.get(
    "/whiteboard/list",
    whiteboardController.listWhiteboards
);

router.get(
    "/whiteboard/:id",
    whiteboardController.getWhiteboard
);

router.delete(
    "/whiteboard/:id",
    whiteboardController.deleteWhiteboard
);

module.exports = router;