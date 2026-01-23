import { useState, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import to "lazy load" the asset reference
    import('@/features/auth/asset/creat_account.png').then((module) => {
      setBgImage(module.default);
    });
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    rePassword: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Basic Validation
    if (formData.password !== formData.rePassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    console.log('Registering User:', formData);

    try {
      const payload = {
        firstName: (formData.firstName || '').trim(),
        lastName: (formData.lastName || '').trim(),
        email: (formData.email || '').trim(),
        phone: (formData.phone || '').trim(),
        password: formData.password || '',
        rePassword: formData.rePassword || '',
      };

      console.log('Sending Register Payload:', payload);

      await import('./auth.api').then((m) => m.register(payload));

      // Auto-Login
      const { login } = await import('./auth.api');
      const loginResponse = await login({
        email: payload.email,
        password: payload.password,
      });

      if (loginResponse.accessToken && loginResponse.refreshToken) {
        localStorage.setItem('accessToken', loginResponse.accessToken);
        localStorage.setItem('refreshToken', loginResponse.refreshToken);

        // Update user context (handled by AuthProvider usually, but we can do manual trigger or reload)
        // ideally useAuth() hook's login/setUser if available, but for now we set storage and reload/navigate
        // We will assume AuthContext reads from storage on mount/update.

        // Force a context update if possible, or just navigate.
        // We can't easily access setUser here effectively without passing it or using global state correctly.
        // Assuming wrapping Register in useAuth() is done but we might need to call a function.
        // For now, simple storage set and navigation to onboarding.

        setSuccess('Account created! Redirecting to setup...');
        setTimeout(() => {
          // Redirect to first step of profile creation
          navigate('/farmer-details');
        }, 1000);
      } else {
        setSuccess('Account created successfully! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Registration/Login Error:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed! Please try again.';

      if (
        message.includes('User already registered') ||
        message.includes('Email already exists') ||
        err.response?.status === 409
      ) {
        setError('You are already registered');
      } else {
        setError(`Registration Failed: ${message}`);
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
            alt="Hands holding seedling"
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
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
      <div className="relative z-30 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {(error || success) && (
          <Suspense fallback={null}>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-500/10 border-red-500/50 text-red-500"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-500/10 border-green-500/50 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </Suspense>
        )}

        {/* Back Button */}
        {/* <button
          onClick={() => navigate('/login')}
          className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button> */}

        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Create account</h1>
          <p className="text-white/70 text-sm">Quickly create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                autoComplete="given-name"
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                autoComplete="family-name"
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>

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
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              autoComplete="tel"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
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
                autoComplete="new-password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500 pr-12"
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

          <div className="space-y-2">
            <Label htmlFor="rePassword" className="text-white">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="rePassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.rePassword}
                autoComplete="new-password"
                onChange={(e) =>
                  setFormData({ ...formData, rePassword: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              'Sign up'
            )}
          </Button>

          <div className="text-center pt-2">
            <span className="text-white/60 text-sm">
              Already have an account?{' '}
            </span>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate('/login')}
              className="text-white font-semibold hover:text-green-400 transition-colors p-0 h-auto"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
