const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addTestResult, getUserTests, getAllTests } = require('../controllers/testController');

router.post('/add', protect, addTestResult);
router.get('/user-tests/:id', protect, getUserTests);
router.get('/all-tests', protect, getAllTests);

module.exports = router; 