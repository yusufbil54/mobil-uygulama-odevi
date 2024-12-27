const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addTestResult, getUserTests } = require('../controllers/testController');

router.post('/add', protect, addTestResult);
router.get('/user-tests', protect, getUserTests);

module.exports = router; 