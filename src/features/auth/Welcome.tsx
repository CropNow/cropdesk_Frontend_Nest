import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import welcomeBackBg from '@/features/auth/asset/welcome_back.png';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={welcomeBackBg}
          alt="Farmer on tractor"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
            nonumy
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <UserPlus size={20} />
            Create an account
          </button>

          <div className="text-center">
            <span className="text-white/60 text-sm">
              Already have an account?{' '}
            </span>
            <button
              onClick={() => navigate('/login')}
              className="text-white font-semibold hover:text-green-400 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
