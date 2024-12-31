const Guideline = require('../models/Guideline');

// Yeni klavuz ekle
const addGuideline = async (req, res) => {
    try {
    
        const { name, ageRanges } = req.body;

        if (!name || !ageRanges || ageRanges.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Kılavuz adı ve en az bir yaş aralığı gereklidir'
            });
        }

        // Boş değerleri filtrele
        const validAgeRanges = ageRanges.filter(range => 
            range.geometricMean && 
            range.standardDeviation && 
            range.minValue && 
            range.maxValue && 
            range.confidenceMin && 
            range.confidenceMax
        );

        if (validAgeRanges.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'En az bir geçerli yaş aralığı gereklidir'
            });
        }

        // Yaş aralıklarını test tiplerine göre grupla ve formatı dönüştür
        const groupedByTestType = validAgeRanges.reduce((acc, range) => {
            if (!acc[range.testType]) {
                acc[range.testType] = [];
            }

            // Yaş aralığını yeni formata dönüştür
            const formattedRange = {
                startValue: Number(range.ageGroupStart),
                startUnit: 'month',
                endValue: Number(range.ageGroupEnd),
                endUnit: 'month',
                isEndInclusive: false,
                geometricMean: Number(range.geometricMean),
                standardDeviation: Number(range.standardDeviation),
                minValue: Number(range.minValue),
                maxValue: Number(range.maxValue),
                confidenceMin: Number(range.confidenceMin),
                confidenceMax: Number(range.confidenceMax)
            };

            acc[range.testType].push(formattedRange);
            return acc;
        }, {});

        // Mevcut kılavuzu kontrol et
        let guideline = await Guideline.findOne({ name });
        
        if (guideline) {
            // Kılavuz varsa, her test tipi için yaş aralıklarını güncelle
            const updatedTestTypes = Object.entries(groupedByTestType).map(([type, ranges]) => {
                const existingTestTypeIndex = guideline.testTypes.findIndex(t => t.type === type);
                
                if (existingTestTypeIndex !== -1) {
                    // Test tipi varsa, yeni yaş aralıklarını ekle
                    guideline.testTypes[existingTestTypeIndex].ageRanges.push(...ranges);
                } else {
                    // Test tipi yoksa, yeni test tipi olarak ekle
                    guideline.testTypes.push({
                        type,
                        ageRanges: ranges
                    });
                }
            });

            // Kılavuzu güncelle
            guideline = await Guideline.findOneAndUpdate(
                { name },
                { testTypes: guideline.testTypes },
                { new: true }
            );
        } else {
            // Yeni kılavuz oluştur
            const testTypes = Object.entries(groupedByTestType).map(([type, ranges]) => ({
                type,
                ageRanges: ranges
            }));

            guideline = await Guideline.create({
                name,
                testTypes
            });

            console.log('Yeni kılavuz oluşturuldu:', guideline);
        }

        res.status(201).json({
            success: true,
            data: guideline,
            message: guideline ? 'Kılavuz güncellendi' : 'Yeni kılavuz oluşturuldu'
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