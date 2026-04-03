import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAccess } from '@/hooks/useAccess';

const LockedScreen = ({ product }: { product: 'nest' | 'seed' }) => {
  const navigate = useNavigate();
  const { setActiveProduct } = useAccess();

  const handleReturn = () => {
    // Revert to the other product if they have access to it, or just go to root
    if (product === 'seed') {
      setActiveProduct('nest');
      navigate('/');
    } else {
      setActiveProduct('seed');
      navigate('/seed/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6 text-foreground">
      <div className="max-w-md w-full bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Access Restricted</h2>
        <p className="text-muted-foreground mb-8">
          You haven't purchased the {product === 'nest' ? 'Nest' : 'Seed'}{' '}
          product yet. Upgrade your account to unlock this feature.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Button
            className="w-full h-12 rounded-xl text-base"
            onClick={() => alert('Mock purchase flow...')}
          >
            Upgrade Now
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-border"
            onClick={handleReturn}
          >
            Return
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LockedScreen;
