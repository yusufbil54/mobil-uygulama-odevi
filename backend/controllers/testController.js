const TestResult = require('../models/TestResult');
const User = require('../models/User');
const Test = require('../models/Test');

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
        console.log('Requested userId:', req.params.id); // Debug için

        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const tests = await TestResult.find({ userId: req.params.id })
            .populate('testType', 'name')
            .sort({ date: -1 });

        console.log('Found tests:', tests); // Debug için

        res.json({
            success: true,
            data: tests
        });

    } catch (error) {
        console.error('Error in getUserTests:', error); // Debug için
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Tüm test tiplerini getir
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().select('name');
        
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

// Test tiplerini getir
const getTestTypes = async (req, res) => {
    try {
        const tests = await Test.find()
        
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

// TC'ye göre test sonuçlarını getir
const getUserTestsByTc = async (req, res) => {
    try {
        const { tc } = req.params;

        if (!tc) {
            return res.status(400).json({
                success: false,
                message: 'TC kimlik numarası gereklidir'
            });
        }

        // Önce TC'ye ait kullanıcıyı bul
        const user = await User.findOne({ tc });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // Kullanıcının test sonuçlarını getir
        const tests = await TestResult.find({ userId: user._id })
            .populate('testType')
            .sort({ date: -1 });

        res.json({
            success: true,
            data: tests
        });

    } catch (error) {
        console.error('Error in getUserTestsByTc:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addTestResult,
    getUserTests,
    getAllTests,
    getTestTypes,
    getUserTestsByTc
}; 