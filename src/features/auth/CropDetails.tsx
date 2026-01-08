import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const CropDetails = () => {
  const navigate = useNavigate();
  const [cropData, setCropData] = useState({
    cropName: '',
    plantingDate: '',
    harvestingDate: '',
    area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crop Details:', cropData);

    // Finalize Onboarding
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      const updatedUser = {
        ...storedUser,
        cropDetails: cropData,
        isOnboardingComplete: true, // Mark complete here
      };
      localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    }

    // Navigate to Dashboard
    navigate('/');
  };

  const handleSkip = () => {
    // Finalize Onboarding even if skipped
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      const updatedUser = {
        ...storedUser,
        isOnboardingComplete: true,
      };
      localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="crop-details.png" // Placeholder
          alt="Crops"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Skip Button */}

        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Crop Details</h1>
          <p className="text-white/70 text-sm">
            What are you growing this season?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop Name */}
          <div>
            <label className="text-xs text-white/60 mb-1 block ml-1">
              Crop Name
            </label>
            <input
              type="text"
              placeholder="e.g. Wheat, Rice, Tomato"
              value={cropData.cropName}
              onChange={(e) =>
                setCropData({ ...cropData, cropName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1 block ml-1">
                Planting Date
              </label>
              <input
                type="date"
                value={cropData.plantingDate}
                onChange={(e) =>
                  setCropData({ ...cropData, plantingDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors max-h-[50px]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block ml-1">
                Exp. Harvest
              </label>
              <input
                type="date"
                value={cropData.harvestingDate}
                onChange={(e) =>
                  setCropData({ ...cropData, harvestingDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors max-h-[50px]"
                required
              />
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="text-xs text-white/60 mb-1 block ml-1">
              Cultivation Area (Acres)
            </label>
            <input
              type="number"
              placeholder="Area for this crop"
              value={cropData.area}
              onChange={(e) =>
                setCropData({ ...cropData, area: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-4"
          >
            Finish Setup
          </button>

          <p className="text-center text-xs text-white/40 mt-4">
            You can always add more crops later from the dashboard.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CropDetails;
