import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FarmerDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    let loadedData: any = null;

    const tempStr = localStorage.getItem('tempRegistrationData');
    if (tempStr) {
      try {
        const tempData = JSON.parse(tempStr);
        if (tempData.farmerDetails) {
          loadedData = tempData.farmerDetails;
        }
      } catch (error) {
        console.error('Error loading temp data:', error);
      }
    }

    // Attempt to load from User Session if no temp data found
    if (!loadedData) {
      const sessionStr = localStorage.getItem('user');
      if (sessionStr) {
        try {
          const sessionUser = JSON.parse(sessionStr);
          // Pre-fill from User Session (Register step)
          loadedData = {
            name: sessionUser.firstName
              ? `${sessionUser.firstName} ${sessionUser.lastName || ''}`.trim()
              : sessionUser.username || '',
            email: sessionUser.email || '',
            phone: sessionUser.phone || '',
            // Try to find address in existing farmerDetails if present (rare case here)
            address: sessionUser.farmerDetails?.address || {},
          };

          const collectionStr = localStorage.getItem('app_users');
          if (collectionStr && sessionUser.email) {
            const collection = JSON.parse(collectionStr);
            const user = collection[sessionUser.email.toLowerCase()];
            if (user && user.farmerDetails) {
              loadedData = { ...loadedData, ...user.farmerDetails };
            }
          }
        } catch (e) {
          console.error('Error loading stored user', e);
        }
      }
    }

    // Default structure / Migration
    return {
      name: loadedData?.name || '',
      phone: loadedData?.phone || loadedData?.phoneNumber || '',
      email: loadedData?.email || '',
      address: {
        village: loadedData?.address?.village || loadedData?.village || '',
        district: loadedData?.address?.district || loadedData?.district || '',
        state: loadedData?.address?.state || loadedData?.state || '',
      },
    };
  });

  useEffect(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    const tempData = tempStr ? JSON.parse(tempStr) : {};

    if (JSON.stringify(tempData.farmerDetails) !== JSON.stringify(formData)) {
      const updatedTemp = {
        ...tempData,
        farmerDetails: formData,
      };
      localStorage.setItem('tempRegistrationData', JSON.stringify(updatedTemp));
    }
  }, [formData]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to next step
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
            <Input
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
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <Input
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

          {/* Address generic field removed as per schema */}

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Village"
              value={formData.address.village}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, village: e.target.value },
                })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <Input
              type="text"
              placeholder="District"
              value={formData.address.district}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, district: e.target.value },
                })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="State"
              value={formData.address.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value },
                })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] text-lg"
          >
            Next: Farm Details
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white/60 font-medium rounded-lg transition-all mt-3"
          >
            Skip for now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FarmerDetails;
