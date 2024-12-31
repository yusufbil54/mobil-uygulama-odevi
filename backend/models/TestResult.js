const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    patientTc: {
        type: String,
        required: true,
        match: [/^\d{11}$/, 'Geçerli bir TC kimlik numarası giriniz']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    testType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    patientAge: {
        years: Number,
        months: Number,
        days: Number,
        totalDays: Number
    },
    guidelineResults: [{
        guidelineSource: String,
        resultStatus: {
            type: String,
            enum: ['Düşük', 'Normal', 'Yüksek']
        },
        referenceRange: {
            min: Number,
            max: Number,
            mean: Number,
            sd: Number,
            confidenceMin: Number,
            confidenceMax: Number,
            ageRange: {
                startValue: Number,
                startUnit: String,
                endValue: Number,
                endUnit: String
            }
        }
    }],
    resultStatus: {
        type: String,
        enum: ['Düşük', 'Normal', 'Yüksek'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestResult', testResultSchema); 