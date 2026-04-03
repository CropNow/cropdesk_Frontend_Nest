import React, { useState } from 'react';
import { useAccess } from '@/hooks/useAccess';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Lock, X } from 'lucide-react';

const ProductSwitcher = () => {
  const { purchases, activeProduct, setActiveProduct } = useAccess();
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState<'nest' | 'seed' | null>(null);

  const handleSwitch = (product: 'nest' | 'seed') => {
    if (!purchases.includes(product)) {
      setShowUpgrade(product);
      return;
    }

    if (activeProduct !== product) {
      setActiveProduct(product);
      if (product === 'seed') {
        navigate('/seed/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
      <div className="flex bg-muted/50 p-1 rounded-full border border-border">
        <button
          onClick={() => handleSwitch('nest')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            activeProduct === 'nest'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          NEST
          {!purchases.includes('nest') && (
            <Lock className="w-3 h-3 opacity-50" />
          )}
        </button>
        <button
          onClick={() => handleSwitch('seed')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
            activeProduct === 'seed'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          SEED
          {!purchases.includes('seed') && (
            <Lock className="w-3 h-3 opacity-50" />
          )}
        </button>
      </div>

      {showUpgrade &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-background border border-border rounded-xl shadow-lg max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setShowUpgrade(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground capitalize">
                  Upgrade to {showUpgrade}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Unlock advanced capabilities with the{' '}
                  {showUpgrade === 'nest' ? 'Nest' : 'Seed'} product. Gain full
                  access to premium features designed to elevate your farm
                  operations.
                </p>
                <button
                  onClick={() => {
                    setShowUpgrade(null);
                    navigate('/subscription');
                  }}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Plans
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProductSwitcher;
