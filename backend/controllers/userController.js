const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, surname, tc, email, password } = req.body;

        if (!name || !surname || !tc || !email || !password) {
            return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
        }

        // TC kontrolü
        const tcExists = await User.findOne({ tc });
        if (tcExists) {
            return res.status(400).json({ message: 'Bu TC kimlik numarası zaten kayıtlı' });
        }

        // Email kontrolü
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Bu email adresi zaten kayıtlı' });
        }

        // Kullanıcı oluştur
        const user = await User.create({
            name,
            surname,
            tc,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla oluşturuldu',
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user._id,
                name: user.name,
                surname: user.surname,
                tc: user.tc,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            tc: user.tc,
            email: user.email,
            role: user.role,
            birthDate: user.birthDate,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                surname: updatedUser.surname,
                email: updatedUser.email,
                birthDate: updatedUser.birthDate,
                role: updatedUser.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
};
