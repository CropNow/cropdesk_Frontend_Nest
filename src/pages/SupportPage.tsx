import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, 
  Search, 
  ChevronDown, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Wifi,
  Clock,
  Send
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const FAQ_DATA = [
  {
    question: "How do I recalibrate my NEST sensor?",
    answer: "You can recalibrate your NEST sensor by navigating to Device Settings > Calibration. Ensure the sensor is clean and exposed to open air for at least 15 minutes before starting the process."
  },
  {
    question: "What does the orange blinking light mean on the SEED gateway?",
    answer: "An orange blinking light indicates a weak cellular connection. Try repositioning the gateway to a higher elevation or away from metal obstructions."
  },
  {
    question: "How often is telemetry data updated?",
    answer: "By default, NEST sensors transmit data every 30 minutes. SEED sensors transmit every 15 minutes. You can adjust these intervals in the System Settings, though it will impact battery life."
  },
  {
    question: "Can I export my farm data for external analysis?",
    answer: "Yes, you can export data in CSV or JSON format from the Analytics tab. Support for PDF reporting is also available for premium users."
  }
];


const TROUBLESHOOTING_GUIDES = [
  {
    title: 'Connectivity Issues',
    description: 'Steps to resolve gateway offline or signal drop issues.',
    icon: <Wifi className="h-5 w-5 text-cyan-400" />,
    steps: [
      'Check internet connection.',
      'Restart the gateway device.',
      'Attempt to reconnect the device from settings.'
    ]
  },
  {
    title: 'Sensor Accuracy',
    description: 'Common reasons for fluctuating or incorrect readings.',
    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    steps: [
      'Perform sensor recalibration via Device Settings.',
      'Verify the sensor is placed correctly, avoiding direct interference.',
      'Clean the sensor surface gently with a dry cloth.'
    ]
  },
  {
    title: 'Battery & Power',
    description: 'Optimizing solar charging and battery performance.',
    icon: <Clock className="h-5 w-5 text-[#00FF9C]" />,
    steps: [
      'Check the current battery level in the dashboard.',
      'Ensure the solar panel is free of dust and debris.',
      'Verify the panel receives adequate direct sunlight during the day.'
    ]
  }
];

export function SupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    subject: '',
    category: 'Technical',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ subject: '', category: 'Technical', message: '' });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen pb-20 pt-4">
        {/* Background Decorative Blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#00FF9C]/10 blur-[100px]" />
          <div className="absolute right-0 top-60 h-80 w-80 rounded-full bg-cyan-500/5 blur-[80px]" />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Header Section */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Support <span className="text-[#00FF9C]">Center</span>
              </h1>
              <p className="max-w-2xl text-lg text-textSecondary">
                Find answers, troubleshoot your devices, or get in touch with our expert team.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              {/* Quick Help Section */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <BookOpen className="h-5 w-5 text-[#00FF9C]" /> Quick Help Guides
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {TROUBLESHOOTING_GUIDES.map((guide, idx) => (
                    <motion.div
                      key={guide.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setActiveGuide(activeGuide === idx ? null : idx)}
                      className="group cursor-pointer rounded-2xl border border-white/5 bg-white/5 overflow-hidden transition-all hover:border-[#00FF9C]/30 hover:bg-white/[0.08]"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="rounded-xl bg-white/5 p-3 w-fit group-hover:scale-110 transition-transform">
                            {guide.icon}
                          </div>
                          <ChevronDown className={`h-5 w-5 text-textMuted transition-transform ${activeGuide === idx ? 'rotate-180' : ''}`} />
                        </div>
                        <h3 className="mb-1 font-bold text-white">{guide.title}</h3>
                        <p className="text-sm text-textSecondary">{guide.description}</p>
                      </div>
                      <AnimatePresence>
                        {activeGuide === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-white/[0.01] px-6 pb-6 pt-4"
                          >
                            <ul className="list-disc pl-5 space-y-2 text-sm text-textSecondary">
                              {guide.steps.map((step, stepIdx) => (
                                <li key={stepIdx}>{step}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <MessageSquare className="h-5 w-5 text-cyan-400" /> Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {FAQ_DATA.map((faq, idx) => (
                    <div 
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-white/5 bg-white/5"
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                      >
                        <span className="font-semibold text-white">{faq.question}</span>
                        <ChevronDown className={`h-5 w-5 text-textMuted transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-white/[0.01] p-5 text-sm leading-relaxed text-textSecondary"
                          >
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* Report Issue Form */}
              <motion.section 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Report an Issue</h2>
                  <p className="text-sm text-textSecondary">Submit a ticket and we'll get back to you.</p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="mb-4 rounded-full bg-[#00FF9C]/20 p-4">
                      <CheckCircle2 className="h-10 w-10 text-[#00FF9C]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Ticket Submitted!</h3>
                    <p className="mt-2 text-sm text-textSecondary">Your reference ID is #CN-{Math.floor(Math.random() * 9000) + 1000}</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-bold text-[#00FF9C] hover:underline"
                    >
                      Submit another issue
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Category</label>
                      <select 
                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-[#00FF9C]/50 focus:outline-none"
                        value={formState.category}
                        onChange={(e) => setFormState({...formState, category: e.target.value})}
                      >
                        <option>Technical</option>
                        <option>Account</option>
                        <option>Billing</option>
                        <option>Hardware</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Subject</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g. NEST Sensor offline"
                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-textHint focus:border-[#00FF9C]/50 focus:outline-none"
                        value={formState.subject}
                        onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-textMuted">Message</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Describe the issue in detail..."
                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-textHint focus:border-[#00FF9C]/50 focus:outline-none"
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF9C] py-4 font-bold text-black transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          <Send className="h-4 w-4" /> Send Ticket
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.section>

              {/* Contact Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                  <Mail className="mb-3 h-5 w-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Email Us</h4>
                  <p className="text-xs text-textSecondary">support@cropnow.com</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                  <Phone className="mb-3 h-5 w-5 text-[#00FF9C]" />
                  <h4 className="text-sm font-bold text-white">Call Us</h4>
                  <p className="text-xs text-textSecondary">+1 (800) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
