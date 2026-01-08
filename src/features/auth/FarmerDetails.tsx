import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FarmerDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    village: '',
    district: '',
    state: '',
  });

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Farmer Details:', formData);

    // Update stored user
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const storedUser = JSON.parse(storedUserStr);
      const updatedUser = {
        ...storedUser,
        farmerDetails: formData,
      };
      localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    }

    // Validate and Store data then navigate to next step
    navigate('/register/farm-details');
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="personal-info.png"
          alt="Cattle in field"
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

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white mb-4">
              Farmer Details
            </h1>
            <p className="text-white/70 text-sm">
              Please fill in your personal information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors resize-none h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Village"
              value={formData.village}
              onChange={(e) =>
                setFormData({ ...formData, village: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <input
              type="text"
              placeholder="District"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
          >
            Next: Farm Details
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white/60 font-medium rounded-lg transition-all mt-3"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerDetails;
