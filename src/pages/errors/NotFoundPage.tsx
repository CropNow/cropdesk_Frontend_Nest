import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bgMain px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-cardBorder bg-bgCard p-10 text-center shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-7xl font-bold text-accentPrimary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-textHeading">Page Not Found</h2>
        <p className="mt-2 text-sm text-textSecondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 w-full rounded-xl bg-accentPrimary/10 py-3 text-sm font-semibold text-accentPrimary transition hover:bg-accentPrimary/20"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
