import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Map } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black opacity-50 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mb-8">
        {/* Logo */}
        <img
          src="/CropNow_Logo_1-D3AGwrH0.png"
          alt="CropNow Logo"
          className="h-24 w-auto object-contain mb-8 hover:scale-105 transition-transform duration-500"
        />

        {/* 404 Glitch Text */}
        <h1 className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800 leading-none select-none tracking-tighter drop-shadow-[0_0_35px_rgba(34,197,94,0.5)]">
          404
        </h1>

        {/* Message */}
        <div className="space-y-4 mt-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Lost in the Field?
          </h2>
          <p className="text-white/60 text-lg">
            Looks like you've wandered off the path. This acre hasn't been
            planted yet.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30">
        <div className="flex gap-8 text-green-500/40">
          <Map size={32} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
