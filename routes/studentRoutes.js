const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');

router.post('/reg-student', studentController.registerStudent);
router.get('/student/:id', studentController.getStudentDetails);
router.post('/student/:id/delete', studentController.deleteStudentForm);
router.post('/student/:id/payment', studentController.togglePayment);
router.delete('/students/:id', studentController.deleteStudentApi);
router.get('/seats', studentController.getSeats);

module.exports = router;
