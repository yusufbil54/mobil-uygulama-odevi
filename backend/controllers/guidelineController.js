const Guideline = require('../models/Guideline');

// Yeni klavuz ekle
const addGuideline = async (req, res) => {
    try {
        console.log('Gelen veri:', req.body);
        
        const { name, ageRanges } = req.body;

        if (!name || !ageRanges || ageRanges.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Kılavuz adı ve en az bir yaş aralığı gereklidir'
            });
        }

        // Yaş aralıklarını test tiplerine göre grupla
        const groupedByTestType = ageRanges.reduce((acc, range) => {
            if (!acc[range.testType]) {
                acc[range.testType] = [];
            }
            // testType'ı hariç tut ve diğer alanları ekle
            const { testType, ...rangeData } = range;
            acc[range.testType].push({
                ...rangeData,
                geometricMean: Number(rangeData.geometricMean),
                standardDeviation: Number(rangeData.standardDeviation),
                minValue: Number(rangeData.minValue),
                maxValue: Number(rangeData.maxValue),
                confidenceMin: Number(rangeData.confidenceMin),
                confidenceMax: Number(rangeData.confidenceMax)
            });
            return acc;
        }, {});

        // testTypes array'ini oluştur
        const testTypes = Object.entries(groupedByTestType).map(([type, ranges]) => ({
            type,
            ageRanges: ranges
        }));

        const guideline = await Guideline.create({
            name,
            testTypes
        });

        console.log('Oluşturulan klavuz:', guideline);

        res.status(201).json({
            success: true,
            data: guideline
        });

    } catch (error) {
        console.error('Klavuz kayıt hatası detayı:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Klavuz kaydedilirken bir hata oluştu'
        });
    }
};

// Tüm klavuzları getir
const getAllGuidelines = async (req, res) => {
    try {
        const guidelines = await Guideline.find().sort('-createdAt');
        
        res.json({
            success: true,
            data: guidelines
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Test tipine göre klavuz getir
const getGuidelineByTestType = async (req, res) => {
    try {
        const guideline = await Guideline.findOne({ 
            testType: req.params.testType 
        });

        if (!guideline) {
            return res.status(404).json({
                success: false,
                message: 'Klavuz bulunamadı'
            });
        }

        res.json({
            success: true,
            data: guideline
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addGuideline,
    getAllGuidelines,
    getGuidelineByTestType
}; 