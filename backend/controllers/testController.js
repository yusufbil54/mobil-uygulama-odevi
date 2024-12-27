const TestResult = require('../models/TestResult');
const User = require('../models/User');

const addTestResult = async (req, res) => {
    try {
        // Debug için gelen veriyi kontrol et
        console.log('Gelen test verisi:', req.body);
        
        const { patientTc, testType, value, results } = req.body;

        // Veri validasyonu
        if (!patientTc || !testType || !value || !results) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanları doldurun'
            });
        }

        // TC'ye ait kayıtlı kullanıcı var mı kontrol et
        const user = await User.findOne({ tc: patientTc });
        console.log('Bulunan kullanıcı:', user);

        const testResult = await TestResult.create({
            patientTc,
            userId: user ? user._id : null,
            testType,
            value,
            results
        });

        console.log('Oluşturulan test:', testResult);

        res.status(201).json({
            success: true,
            data: testResult
        });

    } catch (error) {
        console.error('Test kayıt hatası:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Kullanıcının kendi test sonuçlarını getir
const getUserTests = async (req, res) => {
    try {
        const tests = await TestResult.find({ userId: req.user._id })
            .select('testType value results date')
            .sort('-date');

        res.json({
            success: true,
            data: tests
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addTestResult,
    getUserTests
}; 