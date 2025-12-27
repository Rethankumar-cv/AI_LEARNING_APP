import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable Input component with validation states
 */
const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    disabled = false,
    required = false,
    autoComplete,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={clsx('w-full', className)}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setFocused(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={clsx(
                        'w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-300',
                        'placeholder:text-slate-400',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : focused
                                ? 'border-primary-500 ring-4 ring-primary-100'
                                : 'border-slate-200 hover:border-slate-300',
                        disabled && 'bg-slate-100 cursor-not-allowed',
                        isPassword && 'pr-12'
                    )}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
};

export default Input;
