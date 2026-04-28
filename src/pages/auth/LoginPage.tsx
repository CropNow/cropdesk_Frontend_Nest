import { useState, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Already logged in -> go to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  const steps = [
    { n: 1, label: 'Sign in to', sub: 'your account', active: true },
    { n: 2, label: 'Access your', sub: 'workspace', active: false },
    { n: 3, label: 'Manage your', sub: 'farm', active: false },
  ];

  const inputCls =
    'w-full rounded-xl border border-cardBorder bg-bgCard px-4 py-3 text-sm text-textHeading placeholder-textMuted outline-none transition-all focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/30';

  return (
    <div className="flex min-h-screen bg-bgMain">
      {/* ─── LEFT: Video panel ─── */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Video background */}
        <video
          src="/no-text.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-bgMain/90 via-bgMain/60 to-accentPrimary/15" />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-end px-10 pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 text-4xl font-bold leading-tight text-textHeading xl:text-5xl"
          >
            Welcome Back
            <br />
            to CropNow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 max-w-xs text-sm leading-relaxed text-textSecondary"
          >
            Sign in to your account to manage your smart farm.
          </motion.p>

          {/* Step cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-3"
          >
            {steps.map((s) => (
              <div
                key={s.n}
                className={[
                  'flex w-[120px] flex-col items-center rounded-2xl px-3 py-4 text-center',
                  s.active
                    ? 'border border-cardBorder bg-cardBg backdrop-blur-md'
                    : 'border border-borderSubtle bg-cardBg',
                ].join(' ')}
              >
                <span
                  className={[
                    'mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                    s.active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-cardBg text-textHint',
                  ].join(' ')}
                >
                  {s.n}
                </span>
                <span className={['text-xs leading-snug', s.active ? 'text-textHeading' : 'text-textHint'].join(' ')}>
                  {s.label}
                  <br />
                  <span className="font-semibold">{s.sub}</span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT: Form panel ─── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-textHeading">Sign In</h2>
          <p className="mt-2 text-sm text-textSecondary">
            Enter your credentials to access your account.
          </p>

          {/* Social buttons (UI only) */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cardBorder bg-transparent px-4 py-2.5 text-sm font-medium text-textHeading transition hover:bg-cardBg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cardBorder bg-transparent px-4 py-2.5 text-sm font-medium text-textHeading transition hover:bg-cardBg"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.71c-2.04 2.05-4.61 3.29-7.39 3.29-2.11 0-4.17-.82-5.74-2.41-2.05-2.05-3.27-4.78-3.27-7.66 0-5.63 4.51-10.14 10.14-10.14 2.79 0 5.36 1.25 7.38 3.29 2.05 2.05 3.29 4.62 3.29 7.41 0 2.79-1.25 5.39-3.41 7.22zm-4.56-15.33c-2.37 0-4.29 1.92-4.29 4.29s1.92 4.29 4.29 4.29 4.29-1.92 4.29-4.29-1.92-4.29-4.29-4.29z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-cardBg" />
            <span className="text-xs text-textHint">Or</span>
            <div className="h-px flex-1 bg-cardBg" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textLabel">Email</label>
              <input
                type="email"
                placeholder="eg. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-textLabel">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls + ' pr-10'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textHint transition hover:text-textSecondary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-textLabel cursor-pointer">
                <input type="checkbox" className="rounded border-cardBorder bg-cardBg" />
                Remember me
              </label>
              <button
                type="button"
                className="text-textLabel hover:text-textHeading transition"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-white/90 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-textHint">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold text-textHeading cursor-pointer hover:underline"
            >
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
