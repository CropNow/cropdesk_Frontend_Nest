import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Bot, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your CropNow AI assistant. How can I help you with your farm analytics today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "I'm currently processing that request. I can help you analyze soil moisture trends, pest risks, or irrigation schedules. Which would you like to dive into?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-140px)] flex-col gap-6 sm:h-[calc(100vh-180px)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-textHeading sm:text-4xl flex items-center gap-3">
              AI Assistant <Sparkles className="h-6 w-6 text-accentPrimary" />
            </h1>
            <p className="mt-1 text-sm text-textSecondary sm:text-base">
              Instant answers and insights from your farm data.
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-cardBorder bg-cardBg/40 backdrop-blur-xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.sender === 'user' ? 'bg-primary/20 text-primary' : 'bg-accentPrimary/20 text-accentPrimary'
                  }`}>
                    {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm sm:text-base shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary/10 text-textPrimary border border-primary/20 rounded-tr-none' 
                      : 'bg-cardBg border border-cardBorder text-textPrimary rounded-tl-none'
                  }`}>
                    {msg.text}
                    <div className={`mt-1 text-[10px] opacity-40 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-cardBorder bg-cardBg/30 p-4 sm:p-6">
            <form onSubmit={handleSend} className="relative flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about your farm..."
                className="flex-1 rounded-xl border border-cardBorder bg-bgSidebar/50 px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-accentPrimary/50 focus:ring-1 focus:ring-accentPrimary/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-accentPrimary text-black transition hover:bg-accentPrimary/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ChatbotPage;
