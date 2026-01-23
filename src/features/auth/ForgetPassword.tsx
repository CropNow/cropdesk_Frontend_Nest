import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      // In a real app, you would call an API endpoint here like:
      // await requestPasswordReset(email);
    } catch (error) {
      console.error('Error sending reset link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/src/features/auth/asset/welcome_back.png"
          alt="Background"
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
          <img
            src="/CropNow_Logo_1-D3AGwrH0.png"
            alt="CropNow Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="flex items-center text-white/70 hover:text-white transition-colors mb-8 group w-fit pl-0 hover:bg-transparent"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </Button>

        {/* Header Text */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Forgot Password?
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            {submitted
              ? "We've sent a password reset link to your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {/* Form or Success Message */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-white/80"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full py-6 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                Check your email box for instructions to reset your password.
              </p>
            </div>

            {/* Demo Purposes Only: Link to Reset Password since we can't click email links */}
            <div className="text-center">
              <p className="text-white/40 text-xs mb-2">
                (Dev: Simulate Email Click)
              </p>
              <Button
                variant="link"
                onClick={() => navigate('/reset-password')}
                className="text-green-400 hover:text-green-300 underline text-sm"
              >
                Go to Reset Password Page
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full py-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border-none"
            >
              Try another email
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
