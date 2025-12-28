/**
 * User Profile Routes
 * Handles user profile updates, password changes, and account management
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   PUT /api/profile/update
 * @desc    Update user profile (name, email)
 * @access  Private
 */
router.put('/update', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name && !email) {
            return res.status(400).json({ error: 'Please provide at least one field to update' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if email is already taken (if changing email)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = email;
        }

        // Update name if provided
        if (name && name.trim()) {
            user.name = name.trim();
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * @route   PUT /api/profile/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Please provide current and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get user with password field
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

/**
 * @route   PUT /api/profile/preferences
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/preferences', protect, async (req, res) => {
    try {
        const { email, quizReminders, studyStreakReminders, newFeatures } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update preferences
        if (typeof email === 'boolean') {
            user.preferences.notifications.email = email;
        }
        if (typeof quizReminders === 'boolean') {
            user.preferences.notifications.quizReminders = quizReminders;
        }
        if (typeof studyStreakReminders === 'boolean') {
            user.preferences.notifications.studyStreakReminders = studyStreakReminders;
        }
        if (typeof newFeatures === 'boolean') {
            user.preferences.notifications.newFeatures = newFeatures;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

/**
 * @route   DELETE /api/profile/delete
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/delete', protect, async (req, res) => {
    try {
        const { password, confirmation } = req.body;

        // Validate confirmation
        if (confirmation !== 'DELETE MY ACCOUNT') {
            return res.status(400).json({ error: 'Please type "DELETE MY ACCOUNT" to confirm' });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Password is incorrect' });
        }

        // Delete user's related data
        const Document = require('../models/Document');
        const Flashcard = require('../models/Flashcard');
        const Quiz = require('../models/Quiz');
        const QuizResult = require('../models/QuizResult');
        const Activity = require('../models/Activity');
        const Achievement = require('../models/Achievement');

        await Promise.all([
            Document.deleteMany({ userId: user._id }),
            Flashcard.deleteMany({ userId: user._id }),
            Quiz.deleteMany({ userId: user._id }),
            QuizResult.deleteMany({ userId: user._id }),
            Activity.deleteMany({ userId: user._id }),
            Achievement.deleteMany({ userId: user._id }),
        ]);

        // Delete user
        await user.deleteOne();

        console.log(`🗑️ User account deleted: ${user.email}`);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

module.exports = router;
