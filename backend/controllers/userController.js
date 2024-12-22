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
        const { name, surname, email, password } = req.body;

        if (!name || !surname || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            surname,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User created successfully',
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
                _id: user._id,
                name: user.name,
                surname: user.surname,
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
            email: user.email,
            role: user.role,
            phone: user.phone,
            birthDate: user.birthDate,
            bloodType: user.bloodType,
            address: user.address,
            emergencyContact: user.emergencyContact,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const {
        name,
        surname,
        phone,
        birthDate,
        bloodType,
        address,
        emergencyContact
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.phone = phone || user.phone;
    user.birthDate = birthDate || user.birthDate;
    user.bloodType = bloodType || user.bloodType;
    user.address = address || user.address;
    user.emergencyContact = emergencyContact || user.emergencyContact;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            birthDate: updatedUser.birthDate,
            bloodType: updatedUser.bloodType,
            address: updatedUser.address,
            emergencyContact: updatedUser.emergencyContact,
            role: updatedUser.role
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProfile,
};
