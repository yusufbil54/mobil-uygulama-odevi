const mongoose = require('mongoose');

const ageRangeSchema = new mongoose.Schema({
    startValue: {
        type: Number,
        required: true
    },
    startUnit: {
        type: String,
        enum: ['day', 'month', 'year'],
        required: true
    },
    endValue: {
        type: Number,
        required: true
    },
    endUnit: {
        type: String,
        enum: ['day', 'month', 'year'],
        required: true
    },
    isEndInclusive: {
        type: Boolean,
        default: false
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