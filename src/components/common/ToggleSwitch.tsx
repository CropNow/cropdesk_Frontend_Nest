import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onToggle: () => void;
}

export function ToggleSwitch({ checked, onToggle }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={[
        'relative h-6 w-11 rounded-full border transition',
        checked
          ? 'border-accentPrimary/50 bg-accentPrimary/20'
          : 'border-cardBorder bg-cardBg',
      ].join(' ')}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="absolute top-[2px] h-4.5 w-4.5 rounded-full bg-white"
      />
    </button>
  );
}
