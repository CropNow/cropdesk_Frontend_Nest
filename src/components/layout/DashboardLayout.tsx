import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="relative min-h-screen bg-bgMain px-4 pb-10 pt-8 text-textHeading sm:px-6 lg:pl-28 lg:pr-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 mx-auto max-w-[1500px] space-y-6"
      >
        {children}
      </motion.div>
    </main>
  );
}
