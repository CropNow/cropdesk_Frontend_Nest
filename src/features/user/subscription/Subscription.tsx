import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Leaf,
  Droplets,
  Cpu,
  Users,
  ShieldCheck,
  Zap,
  MessageCircle,
  Smartphone,
  LayoutDashboard,
  LineChart,
  BrainCircuit,
  Database,
} from 'lucide-react';
import { plans, Plan } from './constants';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Subscription = () => {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'sensors':
        return <Cpu size={16} />;
      case 'farms':
        return <Leaf size={16} />;
      case 'fields':
        return <LayoutDashboard size={16} />;
      case 'dataRetentionDays':
        return <Database size={16} />;
      case 'predictions':
      case 'yieldPrediction':
        return <LineChart size={16} />;
      case 'aiRecommendations':
      case 'aiCropSuggestions':
        return <BrainCircuit size={16} />;
      case 'teamMembers':
        return <Users size={16} />;
      case 'support':
        return <MessageCircle size={16} />;
      case 'whatsappAlerts':
        return <MessageCircle size={16} />;
      case 'smsAlerts':
        return <Smartphone size={16} />;
      case 'multiFieldDashboard':
        return <LayoutDashboard size={16} />;
      default:
        return <Check size={16} />;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 pt-20 md:pt-8 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
          >
            Choose Your <span className="text-green-500">Growth Plan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Scale your farming operations with precision monitoring and
            AI-driven insights
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 bg-card border border-border w-fit mx-auto p-2 rounded-2xl"
          >
            <Label
              className={cn(
                'text-sm font-medium',
                !isYearly ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Monthly
            </Label>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <div className="flex items-center gap-2">
              <Label
                className={cn(
                  'text-sm font-medium',
                  isYearly ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                Yearly
              </Label>
              <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Save 15%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan: Plan) => {
            const pricing = isYearly
              ? plan.pricing.yearly
              : plan.pricing.monthly;

            return (
              <motion.div
                key={plan.planId}
                variants={itemVariants}
                className={cn(
                  'relative bg-card border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-green-500/50 group',
                  plan.isPopular
                    ? 'border-green-500 shadow-xl scale-105 z-10'
                    : 'border-border shadow-sm'
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-green-500 transition-colors uppercase tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold uppercase tracking-tighter">
                      ₹{pricing.amount}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="text-green-500 text-xs font-medium mt-1">
                      Billed annually (Best value)
                    </p>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  <FeatureItem icon={getFeatureIcon('sensors')}>
                    {plan.features.sensors === 9999
                      ? 'Unlimited'
                      : plan.features.sensors}{' '}
                    Nest Devices
                  </FeatureItem>
                  <FeatureItem icon={getFeatureIcon('farms')}>
                    {plan.features.farms} Managed Farms
                  </FeatureItem>
                  <FeatureItem icon={getFeatureIcon('fields')}>
                    {plan.features.fields} Cultivable Fields
                  </FeatureItem>
                  <FeatureItem icon={getFeatureIcon('dataRetentionDays')}>
                    {plan.features.dataRetentionDays} Days Data History
                  </FeatureItem>

                  {plan.features.predictions && (
                    <FeatureItem icon={getFeatureIcon('predictions')}>
                      Yield Predictions
                    </FeatureItem>
                  )}
                  {plan.features.aiRecommendations && (
                    <FeatureItem icon={getFeatureIcon('aiRecommendations')}>
                      AI Crop Recommendations
                    </FeatureItem>
                  )}
                  {plan.features.multiFieldDashboard && (
                    <FeatureItem icon={getFeatureIcon('multiFieldDashboard')}>
                      Advanced Multi-field Dashboard
                    </FeatureItem>
                  )}
                  {plan.features.whatsappAlerts && (
                    <FeatureItem icon={getFeatureIcon('whatsappAlerts')}>
                      WhatsApp & SMS Alerts
                    </FeatureItem>
                  )}
                  <FeatureItem
                    icon={getFeatureIcon('support')}
                    className="capitalize"
                  >
                    {plan.features.support} Support
                  </FeatureItem>
                </div>

                <Button
                  className={cn(
                    'w-full py-6 text-sm font-bold uppercase tracking-widest rounded-2xl transition-all duration-300',
                    plan.isPopular
                      ? 'bg-green-500 hover:bg-green-600 text-black border-none'
                      : 'bg-muted hover:bg-green-500/10 hover:text-green-500 text-foreground border border-border group-hover:border-green-500/30'
                  )}
                >
                  Get Started
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparison Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center text-muted-foreground text-sm"
        >
          <p>
            Need a custom enterprise solution?{' '}
            <span className="text-green-500 cursor-pointer font-medium hover:underline">
              Contact our sales team
            </span>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

const FeatureItem = ({
  children,
  icon,
  className,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'flex items-center gap-3 text-sm text-foreground/80',
      className
    )}
  >
    <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
      {icon}
    </div>
    <span className="font-medium">{children}</span>
  </div>
);

export default Subscription;
