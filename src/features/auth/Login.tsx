import { useState, lazy, Suspense, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

import { useAuth } from './useAuth';
import { login } from './auth.api';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Alert = lazy(() =>
  import('@/components/ui/alert').then((m) => ({ default: m.Alert }))
);
const AlertTitle = lazy(() =>
  import('@/components/ui/alert').then((m) => ({ default: m.AlertTitle }))
);
const AlertDescription = lazy(() =>
  import('@/components/ui/alert').then((m) => ({ default: m.AlertDescription }))
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import to "lazy load" the asset reference
    import('@/features/auth/asset/login.png').then((module) => {
      setBgImage(module.default);
    });
  }, []);

  const logoutMessage =
    location.state?.logoutMessage ||
    (searchParams.get('logout') === 'success'
      ? 'Logged out successfully'
      : null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      // Check for user in 'user' prop OR 'data' prop (common API variance)
      // Check for user in 'user' prop OR 'data' prop (common API variance)
      let userFromResponse = response.user;
      if (!userFromResponse && (response as any).data) {
        // Handle case where user is nested inside data (e.g., { data: { user: ... } })
        userFromResponse =
          (response as any).data.user || (response as any).data;
      }

      if (userFromResponse) {
        import('@/utils/storage').then(
          ({ getStoredUser, saveStoredUser, setCurrentSession }) => {
            let finalUser = userFromResponse;

            // CHECK FOR EXISTING LOCAL DATA IN COLLECTION
            // We assume userFromResponse.email is present (it should be for login)
            if (finalUser.email) {
              const existingLocal = getStoredUser(finalUser.email);

              if (existingLocal) {
                finalUser = {
                  ...userFromResponse, // Backend is source of truth for auth info
                  ...existingLocal, // Local collection is source of truth for profile/onboarding details
                  id: userFromResponse.id || (userFromResponse as any)._id,
                  email: userFromResponse.email,
                  username: userFromResponse.username || existingLocal.username,
                };
                console.log(
                  'Merged existing local profile data from collection'
                );
              }
            }

            // Save back to collection and set as current session
            saveStoredUser(finalUser);
            setCurrentSession(finalUser);

            if (finalUser.role) {
              localStorage.setItem('role', finalUser.role);
            }
            setUser(finalUser);

            // Request Location Access
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log('Location access granted:', position);
                },
                (error) => {
                  console.error('Location access denied or error:', error);
                }
              );
            }

            // INTELLIGENT REDIRECT:
            // If user has no farmers/farms (new user), go to Onboarding.
            // Otherwise, go to Dashboard.

            // Check deep structure (farmers array) or flat structure (farmerDetails)
            const hasFarmers =
              (finalUser.farmers && finalUser.farmers.length > 0) ||
              (finalUser.farmerDetails &&
                Object.keys(finalUser.farmerDetails).length > 0);

            if (!hasFarmers) {
              console.log('New user detected, redirecting to Onboarding...');
              navigate('/register/farmer-details');
            } else {
              console.log('Existing user, redirecting to Dashboard...');
              navigate('/');
            }
          }
        );
      } else {
        // Fallback if no user object in response (rare)
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      console.error('Login Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Login failed! Please check your email and password.';

      if (
        errorMessage.includes('User not found') ||
        errorMessage.includes('User not registered') ||
        err.response?.status === 404
      ) {
        setError('User not registered. Please register and login.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        {bgImage && (
          <img
            src={bgImage}
            alt="Farmer in field"
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex items-center justify-between">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            src="/CropNow_Logo_1-D3AGwrH0.png"
            alt="CropNow Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {(logoutMessage || error) && (
          <Suspense fallback={null}>
            {logoutMessage && (
              <Alert
                variant="default"
                className="mb-6 bg-green-500/10 border-green-500/50 text-green-500"
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{logoutMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-500/10 border-red-500/50 text-red-500"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Suspense>
        )}
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome back!</h1>
          <p className="text-white/70 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              autoComplete="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                autoComplete="current-password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500 pr-12"
                required
              />

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          <div className="text-right">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/forgot-password')}
              className="text-white/70 text-sm hover:text-white transition-colors p-0 h-auto font-normal"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className="text-center pt-2">
            <span className="text-white/60 text-sm">
              Don't have an account?{' '}
            </span>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/register')}
              className="text-white font-semibold hover:text-green-400 transition-colors p-0 h-auto"
            >
              Register Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
