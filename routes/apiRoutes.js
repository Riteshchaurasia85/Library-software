const express = require('express');
const router = express.Router();
const apiController = require('../Controllers/apiController');
const whiteboardController = require('../Controllers/whiteboardController');

router.post('/calculator', apiController.calculator);

// Whiteboard API
router.post('/whiteboard/save', whiteboardController.saveWhiteboard);
router.get('/whiteboard/list', whiteboardController.listWhiteboards);
router.get('/whiteboard/:id', whiteboardController.getWhiteboard);
router.delete('/whiteboard/:id', whiteboardController.deleteWhiteboard);

// Students API
router.delete('/students/:id', apiController.deleteStudent);

// Seats / live data
router.get('/seats', apiController.seats);

module.exports = router;
