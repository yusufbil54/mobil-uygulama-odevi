const mongoose = require('mongoose');

const ageRangeSchema = new mongoose.Schema({
    ageGroupStart: {
        type: String,
        required: true
    },
    ageGroupEnd: {
        type: String,
        required: true
    },
    geometricMean: {
        type: Number,
        required: true
    },
    standardDeviation: {
        type: Number,
        required: true
    },
    minValue: {
        type: Number,
        required: true
    },
    maxValue: {
        type: Number,
        required: true
    },
    confidenceMin: {
        type: Number,
        required: true
    },
    confidenceMax: {
        type: Number,
        required: true
    }
});

const testTypeSchema = new mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    ageRanges: [ageRangeSchema]
});

const guidelineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kılavuz adı gereklidir'],
        unique: true
    },
    testTypes: [testTypeSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Guideline', guidelineSchema); 