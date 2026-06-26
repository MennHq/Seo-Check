import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Target, 
  Clock, 
  History as HistoryIcon, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Shield, 
  Sparkles, 
  Layout, 
  LineChart 
} from 'lucide-react';
import { PremiumButton } from './PremiumButton';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black overflow-x-hidden font-sans relative">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg border border-white/10">
              M
            </div>
            <span className="font-syne font-extrabold tracking-tighter text-2xl uppercase italic">MENN</span>
          </div>
          <PremiumButton onClick={onLaunch} className="px-6 py-2 h-10 text-[9px]">
            Launch Workspace <ArrowRight size={12} className="ml-1" />
          </PremiumButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-muted-foreground">
            <Sparkles size={12} className="text-white animate-pulse" />
            The Ultimate Daily Productivity Protocol
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-syne font-extrabold tracking-tighter uppercase italic leading-none max-w-5xl mx-auto">
            ELITE DISCIPLINE, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-white to-neutral-500">
              QUANTIFIED.
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-mono uppercase tracking-wide max-w-3xl mx-auto leading-relaxed">
            Unleash peak cognitive performance. Track daily habits, manage complex objectives, and maintain flawless streaks in an ultra-premium, dark-themed workspace.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PremiumButton onClick={onLaunch} className="px-10 py-5 text-xs">
              Initialize Protocol <Zap size={14} className="ml-2 fill-current" />
            </PremiumButton>
            <a 
              href="#features" 
              className="text-xs uppercase tracking-widest font-mono font-bold text-muted-foreground hover:text-white transition-colors border border-white/5 hover:border-white/20 px-8 py-3.5 rounded-full bg-white/5"
            >
              Explore Core Modules
            </a>
          </div>
        </motion.div>
      </section>

      {/* Simulated Live Preview Dashboard */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass rounded-3xl p-6 md:p-8 studio-shadow border-white/10 relative overflow-hidden group"
        >
          {/* Header of mockup */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest ml-2">Protocol Simulator</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Efficiency Index: 100%
              </span>
            </div>
          </div>

          {/* Core Stat grid mockup */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Goals", val: "3 / 3", desc: "No Backlog" },
              { label: "Accomplished", val: "148", desc: "All-time total" },
              { label: "Streak Multiplier", val: "32 Days", desc: "Elite Tier" },
              { label: "Execution Score", val: "94.6%", desc: "Highly Optimized" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono">{stat.label}</p>
                <p className="text-2xl font-syne font-extrabold mt-1 text-white">{stat.val}</p>
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground/50 font-mono mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Daily list mockup */}
          <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight text-white/90">Initialize 90-Minute Focus Protocol</p>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest mt-1">Core Habits • High Priority</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
                Accomplished
              </span>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-white">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight text-white/90">Deep Work Session: Build Landing Page SEO Modules</p>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest mt-1">Development Objectives</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
                Accomplished
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold tracking-tighter uppercase italic">
            HIGH-PERFORMANCE SYSTEM PROTOCOLS
          </h2>
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
            A modular suite optimized for absolute tracking clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Daily Goal Dashboard",
              desc: "Command your day with three core primary objectives. View real-time progression gauges, track habits, and maintain active task focus without extraneous cognitive bloat."
            },
            {
              icon: HistoryIcon,
              title: "Permanent Mission History",
              desc: "Every accomplished habit and goal is archived indefinitely. Analyze past metrics, view execution history, and keep track of long-term progress with full database caching."
            },
            {
              icon: Flame,
              title: "Streak Multipliers",
              desc: "Cultivate psychological momentum. The streak engine counts consecutive high-efficiency days, triggering status multipliers to incentivize daily accountability."
            },
            {
              icon: Clock,
              title: "Reserve Protocol (Later)",
              desc: "Shield today's priority lists from distraction. Push non-essential tasks safely into the Reserve protocol to address them during weekly buffer periods."
            },
            {
              icon: Shield,
              title: "Optimistic Task Syncing",
              desc: "Zero loading states. Every checkbox toggle, task insertion, and sub-task deletion renders instantly in the UI, executing cloud syncing silently in the background."
            },
            {
              icon: Sparkles,
              title: "Ultra-Premium UI",
              desc: "Immerse yourself in a luxurious dark-ambient aesthetic. Crafted with exquisite typography, Framer Motion transitions, custom shadow grids, and elite visual fidelity."
            }
          ].map((feat, idx) => (
            <div 
              key={idx} 
              className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 flex flex-col gap-4 studio-shadow group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <feat.icon size={22} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white/95">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO copy text for indexing */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 bg-white/[0.01] rounded-3xl my-10 border border-white/5">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-syne font-extrabold uppercase italic tracking-tight">WHY MENN TRACKER IS THE ULTIMATE HABIT PROTOCOL</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">A scientific approach to unshakeable self-discipline.</p>
          </div>

          <div className="text-xs md:text-sm text-muted-foreground/80 space-y-6 leading-relaxed font-mono uppercase tracking-wider">
            <p>
              Traditional to-do apps fail because of choice fatigue. When you are overwhelmed by dozens of miscellaneous tasks, your brain defaults to procrastination. 
              The <strong className="text-white font-bold">MENN Tracker</strong> resolves this cognitive gridlock by implementing a highly focused structure. You concentrate solely on your primary daily objectives.
            </p>
            <p>
              By dividing tasks into <strong className="text-white font-bold">Active Objectives</strong>, <strong className="text-white font-bold">Completed Missions</strong>, and the specialized <strong className="text-white font-bold">Reserve Protocol</strong>, you segregate your active focus from your long-term backlog. 
              This ensures your central workspace remains pristine, lightweight, and completely aligned with your current daily calendar.
            </p>
            <p>
              With fully integrated search functionality, responsive local-storage caching, instant optimistic updates, and optional real-time Supabase cloud sync, you are equipped with the fastest and most secure task management environment available.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-lg">
              M
            </div>
            <span className="font-syne font-extrabold tracking-tighter text-lg uppercase italic">MENN PROTOCOL</span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} MENN. ALL RIGHTS SECURED. DESIGNED FOR COGNITIVE HIGH-PERFORMANCE.
          </p>
        </div>
      </footer>
    </div>
  );
};
