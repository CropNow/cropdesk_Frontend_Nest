import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Wifi,
  WifiOff,
  Clock,
  Send,
} from "lucide-react";
import { DashboardLayout } from "@app/layouts/DashboardLayout";
import { useOnlineStatus } from "@app/providers/OnlineStatusContext";
import { Heading, Text, Label } from "@shared/components/ui/typography";
import { useToast } from "@app/providers/ToastContext";
import { supportAPI } from "@services/api/support.api";

const FAQ_DATA = [
  {
    question: "How do I recalibrate my NEST sensor?",
    answer:
      "You can recalibrate your NEST sensor by navigating to Device Settings > Calibration. Ensure the sensor is clean and exposed to open air for at least 15 minutes before starting the process.",
  },
  {
    question: "What does the orange blinking light mean on the SEED gateway?",
    answer:
      "An orange blinking light indicates a weak cellular connection. Try repositioning the gateway to a higher elevation or away from metal obstructions.",
  },
  {
    question: "How often is telemetry data updated?",
    answer:
      "By default, NEST sensors transmit data every 30 minutes. SEED sensors transmit every 15 minutes. You can adjust these intervals in the System Settings, though it will impact battery life.",
  },
  {
    question: "Can I export my farm data for external analysis?",
    answer:
      "Yes, you can export data in CSV or JSON format from the Analytics tab. Support for PDF reporting is also available for premium users.",
  },
];

const TROUBLESHOOTING_GUIDES = [
  {
    title: "Connectivity Issues",
    description: "Steps to resolve gateway offline or signal drop issues.",
    icon: <Wifi className="h-5 w-5 text-cyan-400" />,
    steps: [
      "Check internet connection.",
      "Restart the gateway device.",
      "Attempt to reconnect the device from settings.",
    ],
  },
  {
    title: "Sensor Accuracy",
    description: "Common reasons for fluctuating or incorrect readings.",
    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    steps: [
      "Perform sensor recalibration via Device Settings.",
      "Verify the sensor is placed correctly, avoiding direct interference.",
      "Clean the sensor surface gently with a dry cloth.",
    ],
  },
  {
    title: "Battery & Power",
    description: "Optimizing solar charging and battery performance.",
    icon: <Clock className="h-5 w-5 text-[#00FF9C]" />,
    steps: [
      "Check the current battery level in the dashboard.",
      "Ensure the solar panel is free of dust and debris.",
      "Verify the panel receives adequate direct sunlight during the day.",
    ],
  },
];

export function SupportPage() {
  const { isOnline } = useOnlineStatus();
  const { addToast } = useToast();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    subject: "",
    category: "Technical",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      addToast({
        message: "You are offline. Please check your connection.",
        type: "error",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await supportAPI.raiseTicket(formState);
      addToast({ message: "Ticket submitted successfully!", type: "success" });
      setSubmitted(true);
      setFormState({ subject: "", category: "Technical", message: "" });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to submit support ticket. Please try again.";
      addToast({ message: errorMsg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
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
              <Heading level={1} className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                Support <span className="text-[#00FF9C] dark:text-accentPrimary">Center</span>
              </Heading>
              <Text variant="body" color="secondary" className="max-w-2xl text-lg">
                Find answers, troubleshoot your devices, or get in touch with our expert team.
              </Text>
            </motion.div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              {/* Quick Help Section */}
              <section className="space-y-4">
                <Heading level={2} className="flex items-center gap-2 text-xl font-bold">
                  <BookOpen className="h-5 w-5 text-accentPrimary" /> Quick Help Guides
                </Heading>
                <div className="grid gap-4 sm:grid-cols-3">
                  {TROUBLESHOOTING_GUIDES.map((guide, idx) => (
                    <motion.div
                      key={guide.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setActiveGuide(activeGuide === idx ? null : idx)}
                      className="group cursor-pointer rounded-2xl border border-borderColor bg-bgCard overflow-hidden transition-all hover:border-accentPrimary/50 hover:bg-bgCardHover"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="rounded-xl bg-borderColor/50 p-3 w-fit group-hover:scale-110 transition-transform">
                            {guide.icon}
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-textMuted transition-transform ${activeGuide === idx ? "rotate-180" : ""}`}
                          />
                        </div>
                        <Heading level={3} className="mb-1 font-bold">{guide.title}</Heading>
                        <Text variant="description" color="secondary">{guide.description}</Text>
                      </div>
                      <AnimatePresence>
                        {activeGuide === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-borderColor bg-bgCard/30 px-6 pb-6 pt-4"
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
                <Heading level={2} className="flex items-center gap-2 text-xl font-bold">
                  <MessageSquare className="h-5 w-5 text-cyan-500" /> Frequently Asked Questions
                </Heading>
                <div className="space-y-3">
                  {FAQ_DATA.map((faq, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-2xl border border-borderColor bg-bgCard"
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-bgCardHover"
                      >
                        <Text as="span" className="font-semibold">{faq.question}</Text>
                        <ChevronDown
                          className={`h-5 w-5 text-textMuted transition-transform ${activeFaq === idx ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-borderColor bg-bgCard/30 p-5 text-sm leading-relaxed text-textSecondary"
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
                className="rounded-3xl border border-borderColor bg-bgCard p-8 backdrop-blur-xl"
              >
                <div className="mb-6">
                  <Heading level={2} className="text-2xl font-bold">Report an Issue</Heading>
                  <Text variant="description" color="secondary">
                    Submit a ticket and we'll get back to you.
                  </Text>
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
                    <Heading level={3} className="text-xl font-bold">Ticket Submitted!</Heading>
                    <Text variant="description" color="secondary" className="mt-2">
                      Your reference ID is #CN-
                      {Math.floor(Math.random() * 9000) + 1000}
                    </Text>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-bold text-accentPrimary hover:underline"
                    >
                      Submit another issue
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isOnline && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs font-semibold text-red-400">
                        <WifiOff className="h-4 w-4" />
                        <span>You are currently offline. Ticket submission is unavailable.</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label color="muted" className="text-xs font-bold uppercase tracking-widest">
                        Category
                      </Label>
                      <select
                        disabled={!isOnline}
                        className="w-full rounded-xl border border-borderColor bg-bgInput p-3 text-sm text-textPrimary focus:border-accentPrimary/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formState.category}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            category: e.target.value,
                          })
                        }
                      >
                        <option className="bg-bgCard text-textPrimary">Technical</option>
                        <option className="bg-bgCard text-textPrimary">Account</option>
                        <option className="bg-bgCard text-textPrimary">Billing</option>
                        <option className="bg-bgCard text-textPrimary">Hardware</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label color="muted" className="text-xs font-bold uppercase tracking-widest">
                        Subject
                      </Label>
                      <input
                        type="text"
                        required
                        disabled={!isOnline}
                        placeholder={
                          isOnline ? "E.g. NEST Sensor offline" : "Offline - please reconnect"
                        }
                        className="w-full rounded-xl border border-borderColor bg-bgInput p-3 text-sm text-textPrimary placeholder:text-textHint focus:border-accentPrimary/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formState.subject}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label color="muted" className="text-xs font-bold uppercase tracking-widest">
                        Message
                      </Label>
                      <textarea
                        required
                        rows={4}
                        disabled={!isOnline}
                        placeholder={
                          isOnline
                            ? "Describe the issue in detail..."
                            : "Offline - please reconnect"
                        }
                        className="w-full rounded-xl border border-borderColor bg-bgInput p-3 text-sm text-textPrimary placeholder:text-textHint focus:border-accentPrimary/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            message: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isOnline}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accentPrimary py-4 font-bold text-black dark:text-black transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
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
                <div className="rounded-2xl border border-borderColor bg-bgCard p-6">
                  <Mail className="mb-3 h-5 w-5 text-cyan-500" />
                  <Heading level={4} className="text-sm font-bold">Email Us</Heading>
                  <Text variant="caption" color="secondary">support@cropnow.in</Text>
                </div>
                <div className="rounded-2xl border border-borderColor bg-bgCard p-6">
                  <Phone className="mb-3 h-5 w-5 text-accentPrimary" />
                  <Heading level={4} className="text-sm font-bold">Call Us</Heading>
                  <Text variant="caption" color="secondary">+1 (800) 123-4567</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
