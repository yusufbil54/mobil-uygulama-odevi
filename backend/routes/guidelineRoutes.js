const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    addGuideline,
    getAllGuidelines,
    getGuidelineByTestType
} = require('../controllers/guidelineController');

router.post('/add', protect, addGuideline);
router.get('/all', protect, getAllGuidelines);
router.get('/:testType', protect, getGuidelineByTestType);

module.exports = router; 