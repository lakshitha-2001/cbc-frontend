import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft, Mail, Lock, Shield, CheckCircle } from 'lucide-react';

export default function ForgetPasswordPage() {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendOTP = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Please enter your email address', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            if (response.data && response.data.message === 'OTP sent successfully') {
                setStep(2);
                toast.success('OTP sent to your email. Please check your inbox!', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            } else {
                const errorMessage = response.data?.message || 'Failed to send OTP. Please try again.';
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'An error occurred while sending OTP. Please try again.';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            if (response.data && response.data.message === 'OTP sent successfully') {
                toast.success('New OTP sent to your email!', {
                    position: 'top-right',
                    autoClose: 5000,
                });
            } else {
                const errorMessage = response.data?.message || 'Failed to resend OTP. Please try again.';
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error('Failed to resend OTP. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        
        if (!otp) {
            toast.error('Please enter the OTP', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
                { email, otp },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            if (response.data && response.data.message === 'OTP verified successfully') {
                setStep(3);
                toast.success('OTP verified! Please set your new password', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                const errorMessage = response.data?.message || 'Invalid OTP. Please try again.';
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            const errorMessage = error.response?.data?.message || 
                              'An error occurred while verifying OTP.';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        
        if (!newPassword || !confirmPassword) {
            toast.error('Please fill all fields', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`,
                { email, otp, newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            if (response.data && response.data.message === 'Password reset successfully') {
                toast.success('Password reset successfully! Redirecting to login...', {
                    position: 'top-right',
                    autoClose: 2000,
                });
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2500);
            } else {
                const errorMessage = response.data?.message || 'Failed to reset password. Please try again.';
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            const errorMessage = error.response?.data?.message || 
                              'An error occurred while resetting password.';
            toast.error(errorMessage, {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <ToastContainer />
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {step === 1 ? 'Reset Password' : 
                         step === 2 ? 'Verify Code' : 
                         'Create New Password'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {step === 1 ? 'Enter your email to receive a verification code' :
                         step === 2 ? 'Enter the 6-digit code sent to your email' :
                         'Create a strong, new password for your account'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center mb-8">
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                step >= stepNumber 
                                    ? 'bg-purple-600 border-purple-600 text-white' 
                                    : 'border-gray-300 text-gray-400'
                            }`}>
                                {step > stepNumber ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <span className="font-semibold">{stepNumber}</span>
                                )}
                            </div>
                            {stepNumber < 3 && (
                                <div className={`w-16 h-0.5 mt-2 ${
                                    step > stepNumber ? 'bg-purple-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Forms */}
                {step === 1 && (
                    <form onSubmit={sendOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your registered email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Sending Code...
                                </>
                            ) : (
                                'Send Verification Code'
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={verifyOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter 6-digit code"
                                    required
                                    maxLength={6}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={resendOTP}
                                    disabled={isLoading}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Resend code
                                </button>
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={resetPassword} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-200 flex items-center justify-center"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <a 
                        href="/login" 
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}