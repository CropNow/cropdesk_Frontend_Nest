import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import type { Toast } from '../../contexts/ToastContext';

const iconMap: Record<Toast['type'], typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const accentMap: Record<Toast['type'], string> = {
  success: '#00FF9C',
  error: '#EF4444',
  info: '#22D3EE',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const accent = accentMap[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3 rounded-xl border border-borderSubtle bg-bgCard px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-xl"
              style={{ borderLeft: `3px solid ${accent}` }}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ color: accent }} />
              <span className="text-sm font-medium text-[var(--text-primary)]">{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-2 shrink-0 rounded-md p-0.5 text-textHint transition hover:text-textBody"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
