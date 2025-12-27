import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/helpers';
import CloudDivider from './CloudDivider';

/**
 * Login Page - Cloud-style purple SaaS design (UI-only redesign)
 * All functionality preserved - visual changes only
 */
const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

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
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setShowError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 md:p-8">
            {/* Main Content Card with Cloud Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm"
                style={{ boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)' }}
            >
                <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
                    {/* Left Section - Login Form */}
                    <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Greeting */}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                                    Hello!
                                </h1>
                                <p className="text-slate-500 text-base">
                                    Sign in to your account
                                </p>
                            </div>

                            {/* Error Message */}
                            {showError && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl"
                                >
                                    <p className="text-sm font-medium">{showError}</p>
                                </motion.div>
                            )}

                            {/* Sign In Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Input with Icon */}
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                                        <Mail className="w-5 h-5 text-violet-400 transition-colors group-focus-within:text-violet-600" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="E-mail"
                                        autoComplete="email"
                                        className={`w-full pl-14 pr-5 py-4 rounded-full border-2 outline-none transition-all duration-300 bg-violet-50/30 placeholder:text-slate-400 text-slate-700 font-medium ${errors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                                            : 'border-transparent focus:border-violet-400 focus:ring-4 focus:ring-violet-100 focus:bg-white'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 ml-5 text-sm text-red-600 font-medium">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Input with Icons */}
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                                        <Lock className="w-5 h-5 text-violet-400 transition-colors group-focus-within:text-violet-600" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        className={`w-full pl-14 pr-14 py-4 rounded-full border-2 outline-none transition-all duration-300 bg-violet-50/30 placeholder:text-slate-400 text-slate-700 font-medium ${errors.password
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30'
                                            : 'border-transparent focus:border-violet-400 focus:ring-4 focus:ring-violet-100 focus:bg-white'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors z-10"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="mt-2 ml-5 text-sm text-red-600 font-medium">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm px-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-2 border-violet-300 text-violet-600 focus:ring-2 focus:ring-violet-200 cursor-pointer transition-all"
                                        />
                                        <span className="ml-2.5 text-slate-600 group-hover:text-slate-800 transition-colors">
                                            Remember me
                                        </span>
                                    </label>
                                    <a
                                        href="#"
                                        className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Sign In Button */}
                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-full font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)' }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'SIGN IN'
                                    )}
                                </motion.button>
                            </form>

                            {/* Demo Credentials */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 p-5 bg-violet-50/50 rounded-2xl border border-violet-100"
                            >
                                <p className="text-xs font-bold text-violet-900 mb-2.5">
                                    Demo Credentials:
                                </p>
                                <p className="text-xs text-violet-700 mb-1">
                                    Email: demo@example.com
                                </p>
                                <p className="text-xs text-violet-700">
                                    Password: password123
                                </p>
                            </motion.div>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-bold text-violet-600 hover:text-violet-700 transition-colors"
                                >
                                    Create
                                </Link>
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Section - Purple Cloud Design */}
                    <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 overflow-hidden">
                        {/* Floating Animation Wrapper */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative z-10 text-center px-8"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-5xl font-bold text-white mb-6 drop-shadow-lg"
                            >
                                Welcome Back!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-lg text-white/90 leading-relaxed max-w-md drop-shadow-md"
                            >
                                Your intelligent study companion is ready to help you learn smarter, not harder. Let's continue your learning journey together!
                            </motion.p>
                        </motion.div>

                        {/* Decorative Background Circles */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

