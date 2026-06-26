const express = require('express');
const router = express.Router();

const calculationController =
require('../controllers/calculationController');

// HOME
router.get('/', (req, res) => {
    res.redirect('/dashboard');
});
// SAVE
router.post('/save', calculationController.saveCalculation);

router.post('/calculator', calculationController.calculate);

// LATE FEE PAGE
router.get('/latefee', (req, res) => {
    res.render('pages/latefee');
});

// PRINT COST PAGE
router.get('/printcost', (req, res) => {
    res.render('pages/printcost');
});

// MEMBERSHIP PAGE
router.get('/membership', (req, res) => {
    res.render('pages/membership');
});

// PENALTY PAGE
router.get('/penalty', (req, res) => {
    res.render('pages/penalty');
});

module.exports = router;