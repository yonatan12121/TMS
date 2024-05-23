const User = require('../models/user');
const generateToken = require('../utils/jwt');
const { sendRegistrationEmail,sendPasswordResetEmail  } = require('../utils/email');
const {generateVerificationToken }= require('../utils/generateVerificationToken')
// Register new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { token: verificationToken, expiration: verificationExpiration } = generateVerificationToken();
        user = new User({ name, email, password, verificationToken, verificationTokenExpires: verificationExpiration });

        await user.save();

        const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
        await sendRegistrationEmail(email, verificationLink);

        res.status(201).json({
            message: 'Registration successful, please check your email for verification link.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Find the user by ID from the JWT token payload
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.verify = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(400).json({ message: 'Please verify your email address. Check your inbox for the verification email.' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { token: resetToken, expiration: resetTokenExpires } = generateVerificationToken();
        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save();

        const resetLink = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(email, resetLink);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update the user's password
        user.password = newPassword;

        // Clear reset token and expiration
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

