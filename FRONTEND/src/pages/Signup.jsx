import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { isValidEmail, getPasswordStrength } from '../utils/helpers';
import { fadeIn, slideUp } from '../utils/animations';
import clsx from 'clsx';

/**
 * Signup Page
 */
const Signup = () => {
    const navigate = useNavigate();
    const { signup, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setShowError('');
            await signup(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setShowError(err.message || 'Signup failed. Please try again.');
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const strengthColors = {
        0: 'bg-slate-200',
        1: 'bg-red-500',
        2: 'bg-orange-500',
        3: 'bg-yellow-500',
        4: 'bg-green-500',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
            <motion.div
                {...fadeIn}
                className="w-full max-w-md"
            >
                {/* Logo & Branding */}
                <motion.div {...slideUp} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        AI Learning Assistant
                    </h1>
                    <p className="text-primary-100">
                        Start your learning journey today
                    </p>
                </motion.div>

                {/* Signup Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                >
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
                        Create Account
                    </h2>

                    {/* Error Message */}
                    {showError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-4"
                        >
                            <p className="text-sm font-medium">{showError}</p>
                        </motion.div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            error={errors.name}
                            autoComplete="name"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            error={errors.email}
                            autoComplete="email"
                            required
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                error={errors.password}
                                autoComplete="new-password"
                                required
                            />

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={clsx(
                                                    'h-1 flex-1 rounded-full transition-all duration-300',
                                                    i <= passwordStrength.strength
                                                        ? strengthColors[passwordStrength.strength]
                                                        : 'bg-slate-200'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Strength: <span className="font-semibold">{passwordStrength.label}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                            required
                        />

                        {/* Terms Checkbox */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="mt-1 w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700">
                                    I accept the{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                                        Terms and Conditions
                                    </a>
                                </span>
                            </label>
                            {errors.acceptTerms && (
                                <p className="mt-1 text-sm text-red-600 font-medium">{errors.acceptTerms}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-6"
                            loading={loading}
                        >
                            Create Account
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;
