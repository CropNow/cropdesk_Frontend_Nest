import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { useAuth } from './useAuth';
import { login } from './auth.api';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({
        email: (formData.email || '').trim(), // ✅ trim email
        password: formData.password || '',
      });

      console.log('FULL LOGIN RESPONSE:', response);
      // ✅ STORE REAL TOKENS
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // ✅ STORE USER (if backend sends it later)
      // FIX: If backend fails to send user object (but sends token), synthesize a fallback user
      // so that our auth fallback mechanism works.

      // Handle response structure variations: user might be at root, or inside 'data'
      // Based on logs: { status: 'success', data: { ...user... } }
      let fetchedUser = response.user || (response as any).data;

      let finalUser = fetchedUser;

      if (!finalUser && response.accessToken) {
        console.warn(
          'Login response missing user object. Synthesizing fallback user.'
        );
        finalUser = {
          id: 'temp-user-' + Date.now(),
          email: (formData.email || '').trim(),
          username: (formData.email || '').split('@')[0],
          role: 'farmer', // Default fallback
        };
      }

      if (finalUser) {
        // CHECK FOR EXISTING LOCAL DATA TO PRESERVE
        const existingLocalStr = localStorage.getItem('registeredUser');
        if (existingLocalStr) {
          try {
            const existingLocal = JSON.parse(existingLocalStr);
            // If the logged-in user matches the stored local profile (by email), preserve the rich details
            // Normalize emails for comparison
            // FIX: Use finalUser to compare, as fetchedUser might be undefined/incomplete.
            // Also ensure existingLocal has email.
            if (
              existingLocal.email &&
              finalUser.email &&
              existingLocal.email.toLowerCase() ===
                finalUser.email.toLowerCase()
            ) {
              finalUser = {
                ...fetchedUser, // Backend is source of truth for auth info (might be undefined, which is fine, spreads nothing)
                ...existingLocal, // Local is source of truth for profile/onboarding details (until backend fully supports them)
                ...finalUser, // Ensure synthesized basics (like email) are present if fetchedUser was null
                id: finalUser.id || existingLocal.id, // Keep backend ID if available, else local
                email: finalUser.email,
                username: finalUser.username || existingLocal.username,
              };
              console.log(
                'Merged existing local profile data with login response'
              );
            }
          } catch (e) {
            console.error('Error parsing existing user data', e);
          }
        }

        const userStr = JSON.stringify(finalUser);
        localStorage.setItem('user', userStr);

        // CRITICAL FIX: Only overwrite 'registeredUser' if the new user object looks "richer" or at least as good.
        // Don't overwrite a rich local profile with a synthesized skeleton just because backend returned 404/empty.
        // Simple heuristic: if finalUser has 'farmerDetails' or 'farmDetails', update registeredUser.
        // OR if we merged successfully (which means finalUser should have them).
        if (
          finalUser.farmerDetails ||
          finalUser.farmDetails ||
          finalUser.isOnboardingComplete
        ) {
          localStorage.setItem('registeredUser', userStr);
        } else {
          console.warn(
            'Skipping update of registeredUser to preserve potential local data (login did not return detailed profile)'
          );
          // If we synthesized, we definitely don't want to kill the existing local DB.
        }

        if (finalUser.role) {
          localStorage.setItem('role', finalUser.role);
        }
        setUser(finalUser);
      }

      navigate('/');
    } catch (error: any) {
      console.error(error);
      console.error('Login Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Login failed! Please check your email and password.';

      if (
        errorMessage.includes('User not found') ||
        errorMessage.includes('User not registered') ||
        error.response?.status === 404
      ) {
        alert('User not registered. Please register and login.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/src/features/auth/asset/login.png"
          alt="Farmer in field"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex items-center justify-between">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate('/')}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CropDesk
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome back!</h1>
          <p className="text-white/70 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors pr-12"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center">
            <span className="text-white/60 text-sm">
              Don't have an account?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-white font-semibold hover:text-green-400 transition-colors"
            >
              Register Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
