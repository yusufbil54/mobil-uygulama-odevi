const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addTestResult, getUserTests, getAllTests, getTestTypes, getUserTestsByTc, calculateTestResult } = require('../controllers/testController');

router.post('/add', protect, addTestResult);
router.get('/user-tests/:id', protect, getUserTests);
router.get('/all-tests', protect, getAllTests);
router.get('/types', protect, getTestTypes);
router.get('/user-tests/tc/:tc', protect, getUserTestsByTc);
router.post('/calculate', protect, calculateTestResult);

module.exports = router; 