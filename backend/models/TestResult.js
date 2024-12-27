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
        required: false // Kayıtlı olmayan hastalar için opsiyonel
    },
    testType: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    results: {
        who: String,
        europe: String,
        america: String,
        asia: String,
        turkey: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestResult', testResultSchema); 