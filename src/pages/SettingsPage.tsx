import { motion } from 'framer-motion';
import { SettingsLayout } from '../components/settings/SettingsLayout';

export function SettingsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bgMain px-4 pb-10 pt-8 text-textPrimary sm:px-6 lg:pl-28 lg:pr-10">
      <div className="absolute inset-0 bg-grid-pattern" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#00FF9C]/8 blur-[120px]" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/6 blur-[100px]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <SettingsLayout />
      </div>
    </main>
  );
}
