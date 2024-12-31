const TestResult = require('../models/TestResult');
const User = require('../models/User');
const Test = require('../models/Test');
const guidelineData = require('../data/guidelines.json');
const Guideline = require('../models/Guideline');

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

        const testResult = await TestResult.create({
            patientTc,
            userId: user ? user._id : null,
            testType,
            value,
            results
        });


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
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const tests = await TestResult.find({ patientTc: user.tc })
            .populate('testType')
            .sort({ date: -1 });

        res.json({
            success: true,
            data: tests
        });

    } catch (error) {
        console.error('Error in getUserTests:', error);
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
        const tests = await Test.find().select('_id name type');

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
        // Kullanıcının test sonuçlarını getir
        const tests = await TestResult.find({ patientTc: tc })
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

const calculateTestResult = async (req, res) => {
    try {
        const { patientName, patientTc, birthDate, testType, value } = req.body;

        // Validate input
        if (!patientTc || !birthDate || !value || !testType) {
            return res.status(400).json({
                success: false,
                message: 'Tüm gerekli alanları doldurun'
            });
        }

        // Get age calculation
        const today = new Date();
        const birth = new Date(birthDate);
        
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Hastanın toplam gün yaşını hesapla
        const totalDays = (years * 365) + (months * 30) + days;
        console.log("Hasta yaşı (gün):", totalDays);

        // Tüm kılavuzları al
        const guidelines = await Guideline.find();
        
        if (!guidelines || guidelines.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hiç kılavuz bulunamadı'
            });
        }

        // Her kılavuz için sonuçları hesapla
        const allGuidelineResults = [];

        for (const guideline of guidelines) {
            // Eşleşen test tipini bul
            const matchingTestType = guideline.testTypes.find(type => 
                type.type.toString() === testType
            );

            if (!matchingTestType) continue; // Bu kılavuzda bu test tipi yoksa atla

            // Yaşa uygun aralığı bul
            const matchingAgeRange = matchingTestType.ageRanges.find(range => {
                const startDays = range.startUnit === 'year' ? 
                    range.startValue * 365 : 
                    range.startUnit === 'month' ? 
                    range.startValue * 30 : 
                    range.startValue;

                const endDays = range.endUnit === 'year' ? 
                    range.endValue * 365 : 
                    range.endUnit === 'month' ? 
                    range.endValue * 30 : 
                    range.endValue;

                return totalDays >= startDays && totalDays < endDays;
            });

            if (!matchingAgeRange) continue; // Bu kılavuzda bu yaş için değer yoksa atla

            // Sonuç durumunu hesapla
            let resultStatus;
            if (value < matchingAgeRange.minValue) {
                resultStatus = 'Düşük';
            } else if (value > matchingAgeRange.maxValue) {
                resultStatus = 'Yüksek';
            } else {
                resultStatus = 'Normal';
            }

            allGuidelineResults.push({
                guidelineSource: guideline.name,
                resultStatus,
                referenceRange: {
                    min: matchingAgeRange.minValue,
                    max: matchingAgeRange.maxValue,
                    mean: matchingAgeRange.geometricMean,
                    sd: matchingAgeRange.standardDeviation,
                    confidenceMin: matchingAgeRange.confidenceMin,
                    confidenceMax: matchingAgeRange.confidenceMax,
                    ageRange: {
                        startValue: matchingAgeRange.startValue,
                        startUnit: matchingAgeRange.startUnit,
                        endValue: matchingAgeRange.endValue,
                        endUnit: matchingAgeRange.endUnit
                    }
                }
            });
        }

        if (allGuidelineResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hiçbir kılavuzda bu test ve yaş için uygun referans değer bulunamadı'
            });
        }

        // Test sonucunu veritabanına kaydet
        // Ana sonuç olarak ilk kılavuzun sonucunu kullan
        const testResult = await TestResult.create({
            patientTc,
            testType,
            value,
            patientAge: {
                years,
                months,
                days,
                totalDays
            },
            guidelineResults: allGuidelineResults,
            resultStatus: allGuidelineResults[0].resultStatus // Ana sonuç olarak ilk kılavuzun sonucunu kullan
        });

        res.status(200).json({
            success: true,
            data: testResult
        });

    } catch (error) {
        console.error('Calculation error:', error);
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
    getUserTestsByTc,
    calculateTestResult
}; 