import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RegistrationPlaceholderProps {
  title: string;
  description: string;
  route: string;
  className?: string; // Allow custom styling
  color?: 'green' | 'blue';
  variant?: 'card' | 'button'; // 'card' for dashboard, 'button' for smart info
}

export const RegistrationPlaceholder: React.FC<
  RegistrationPlaceholderProps
> = ({
  title,
  description,
  route,
  className,
  color = 'green',
  variant = 'card',
}) => {
  const navigate = useNavigate();

  const colorStyles = {
    green: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      ring: 'ring-green-500/30',
    },
    blue: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-500',
      ring: 'ring-indigo-500/30',
    },
  }[color];

  if (variant === 'button') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center p-8 gap-6 ${className}`}
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {description}
          </p>
        </div>
        <Button
          onClick={() => navigate(route)}
          className={`${colorStyles.bg} hover:opacity-90 text-white rounded-full px-8 py-6 font-bold flex items-center gap-2 text-base shadow-lg hover:shadow-xl transition-all`}
        >
          <Plus className="w-5 h-5" />
          Complete Profile
        </Button>
      </div>
    );
  }

  // Dashboard Style (Card)
  return (
    <div
      className={`relative overflow-hidden group hover:border-border transition-all cursor-pointer border border-border/50 bg-card/60 rounded-2xl flex flex-col items-center justify-center p-8 gap-6 h-full shadow-sm hover:shadow-md ${className}`}
      onClick={() => navigate(route)}
    >
      <div
        className={`w-16 h-16 rounded-full ${colorStyles.bg} ring-4 ${colorStyles.ring} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <Plus className="w-8 h-8 text-white" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
};
