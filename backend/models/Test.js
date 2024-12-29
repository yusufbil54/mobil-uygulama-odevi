const mongoose = require('mongoose');

const ageRangeSchema = new mongoose.Schema({
    ageGroup: String,  // "0-30 days", "1-5 months" etc.
    geometricMean: Number,
    standardDeviation: Number,
    minValue: Number,
    maxValue: Number,
    confidenceMin: Number,
    confidenceMax: Number
});

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'],
        required: true
    },
    ageRanges: [ageRangeSchema]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);