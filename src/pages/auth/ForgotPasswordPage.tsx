import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../../api/auth.api';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-cardBorder bg-bgCard px-4 py-3 text-sm text-textHeading placeholder-textMuted outline-none transition-all focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/30';

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-bgMain items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-cardBorder bg-bgCard p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-textHeading">Check Your Email</h2>
          <p className="mt-4 text-sm leading-relaxed text-textSecondary">
            We've sent a password reset link to <span className="font-semibold text-textHeading">{email}</span>. 
            Please check your inbox and follow the instructions.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 w-full rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-white/90"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bgMain items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-cardBorder bg-bgCard p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accentPrimary/10">
            <Mail className="h-8 w-8 text-accentPrimary" />
          </div>
          <h2 className="text-2xl font-bold text-textHeading">Forgot Password?</h2>
          <p className="mt-2 text-sm text-textSecondary">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-textLabel">Email Address</label>
            <input
              type="email"
              placeholder="eg. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-white/90 disabled:opacity-50"
          >
            {isLoading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-8 flex items-center justify-center gap-2 mx-auto text-sm font-medium text-textHint hover:text-textHeading transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}
