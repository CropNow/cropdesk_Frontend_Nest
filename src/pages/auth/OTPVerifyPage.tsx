import React, { useState, FormEvent, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/auth.api';

export function OTPVerifyPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (!email && !isAuthenticated) {
      navigate('/login');
    }
  }, [email, isAuthenticated, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authAPI.verifyOTP({ email, otp: otpCode });
      navigate('/login', { state: { message: 'Account verified successfully! Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      await authAPI.resendOTP(email);
      setResendTimer(30);
      setError('');
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bgMain items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-cardBorder bg-bgCard p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accentPrimary/10">
            <ShieldCheck className="h-8 w-8 text-accentPrimary" />
          </div>
          <h2 className="text-2xl font-bold text-textHeading">Verify Your Account</h2>
          <p className="mt-2 text-sm text-textSecondary text-balance">
            We've sent a 6-digit verification code to <span className="font-semibold text-textHeading">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="h-12 w-12 rounded-xl border border-cardBorder bg-bgMain text-center text-xl font-bold text-textHeading outline-none transition-all focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/30"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-white/90 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-textSecondary">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || isLoading}
              className={[
                'font-semibold transition hover:underline',
                resendTimer > 0 ? 'text-textHint cursor-not-allowed' : 'text-accentPrimary cursor-pointer',
              ].join(' ')}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 mx-auto text-sm font-medium text-textHint hover:text-textHeading transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
