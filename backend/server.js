const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Guideline = require('./models/Guideline');
const Test = require('./models/Test');
const guidelineData = require('./data/guidelines.json')

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS ayarlarını genişletelim
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Kılavuz verilerini veritabanına yükleyen fonksiyon
/* const initializeGuidelines = async () => {
    try {
        // Önce mevcut kılavuzları kontrol et
        const existingGuideline = await Guideline.findOne({ name: guidelineData.name });
        
        if (existingGuideline) {
            console.log('Kılavuz verileri zaten yüklenmiş.');
            return;
        }

        // Her test tipi için Test koleksiyonunda karşılık gelen belgeyi bul
        const processedTestTypes = await Promise.all(guidelineData.testTypes.map(async (testType) => {
            const test = await Test.findById(testType.type);
            
            if (!test) {
                console.log(`Test bulunamadı: ${testType.type}`);
                return null;
            }

            return {
                type: test._id,
                ageRanges: testType.ageRanges.map(range => ({
                    startValue: range.startValue,
                    startUnit: range.startUnit,
                    endValue: range.endValue,
                    endUnit: range.endUnit,
                    isEndInclusive: range.isEndInclusive,
                    geometricMean: range.geometricMean,
                    standardDeviation: range.standardDeviation,
                    minValue: range.minValue,
                    maxValue: range.maxValue,
                    confidenceMin: range.confidenceMin,
                    confidenceMax: range.confidenceMax
                }))
            };
        }));

        // Null olmayan test tiplerini filtrele
        const validTestTypes = processedTestTypes.filter(type => type !== null);

        // Yeni kılavuz oluştur
        const newGuideline = await Guideline.create({
            name: guidelineData.name,
            testTypes: validTestTypes
        });

        console.log('Kılavuz verileri başarıyla yüklendi.');
        console.log('Yüklenen test tipi sayısı:', validTestTypes.length);

    } catch (error) {
        console.error('Kılavuz verileri yüklenirken hata oluştu:', error);
    }
}; */


// Body parser ayarlarını güncelleyelim
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/guidelines', require('./routes/guidelineRoutes'));

// Basic route
app.get('/',async (req, res) => {
   // await initializeGuidelines();
    res.json({ message: 'Welcome to the API' });
});

const PORT = process.env.PORT || 5001;

// Tüm IP'lerden gelen istekleri dinle
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
