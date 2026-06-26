import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  History as HistoryIcon,
  Archive,
  Lock,
  User,
  CheckCircle2,
  Clock,
  Zap,
  Download
} from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { Dashboard } from './components/Dashboard';
import { TaskCard } from './components/TaskCard';
import { PremiumButton } from './components/PremiumButton';
import { format, isToday, parseISO, startOfDay, isSameDay } from 'date-fns';
import { cn } from './lib/utils';
import Lenis from 'lenis';

export default function App() {
  const { 
    tasks, 
    stats, 
    loading,
    addTask, 
    deleteTask, 
    addSubTask, 
    toggleSubTask, 
    deleteSubTask,
    reorderSubTasks,
    updateTask
  } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'reserve'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'settings' | 'history' | 'active' | 'completed' | 'reserve'>('dashboard');
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('menn_auth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'pro679715@gmail.com' && password === 'momentumgonnapaycountless!') {
      setIsAuthenticated(true);
      localStorage.setItem('menn_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Elite access only.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('menn_auth');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filtering for dashboard vs history vs specific status pages
      const isForSelectedDate = isSameDay(parseISO(task.date), startOfDay(selectedDate));
      
      if (activeTab === 'dashboard') {
        if (!isForSelectedDate) return false;
        if (filter === 'all') return matchesSearch;
        return task.status === filter && matchesSearch;
      }
      
      if (activeTab === 'history') {
        if (filter === 'all') return matchesSearch;
        return task.status === filter && matchesSearch;
      }

      if (activeTab === 'active' || activeTab === 'completed' || activeTab === 'reserve') {
        return task.status === activeTab && matchesSearch;
      }

      return matchesSearch;
    });
  }, [tasks, searchQuery, filter, activeTab, selectedDate]);

  const selectedDateTasks = useMemo(() => {
    return tasks.filter(t => isSameDay(parseISO(t.date), startOfDay(selectedDate)));
  }, [tasks, selectedDate]);

  const dailyProgress = useMemo(() => {
    if (selectedDateTasks.length === 0) return 0;
    const completed = selectedDateTasks.filter(t => t.status === 'completed').length;
    return (completed / selectedDateTasks.length) * 100;
  }, [selectedDateTasks]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setFilter('all');
    setIsSidebarOpen(false);
  };

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), selectedDate);
      setNewTaskTitle('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-3xl w-full max-w-md studio-shadow border-white/10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black font-black text-3xl shadow-2xl mb-6">
              M
            </div>
            <h1 className="text-3xl font-syne font-extrabold tracking-tighter uppercase italic">MENN ACCESS</h1>
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mt-2">Elite Discipline Protocol</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground ml-2">Email Address</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="pro679715@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground ml-2">Access Key</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {authError && (
              <p className="text-red-500 text-[10px] uppercase tracking-widest font-mono text-center">{authError}</p>
            )}

            <PremiumButton type="submit" className="w-full py-5">
              Initialize Protocol
            </PremiumButton>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans app-container">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -280),
          width: 280
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:relative h-full glass border-r border-white/5 flex flex-col z-50 lg:translate-x-0"
      >
        <div className="p-8 flex items-center gap-4 justify-center lg:justify-start">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black font-black text-3xl shadow-2xl studio-shadow border-4 border-white/10 shrink-0">
            M
          </div>
          <span className="font-syne font-extrabold tracking-tighter text-3xl uppercase italic hidden lg:block">MENN</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
              activeTab === 'dashboard' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <div className="py-2">
            <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold mb-2">Objectives</p>
            <button 
              onClick={() => handleTabChange('active')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
                activeTab === 'active' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Zap size={18} />
              Active
            </button>
            <button 
              onClick={() => handleTabChange('completed')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
                activeTab === 'completed' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <CheckCircle2 size={18} />
              Completed
            </button>
            <button 
              onClick={() => handleTabChange('reserve')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
                activeTab === 'reserve' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Archive size={18} />
              Reserve
            </button>
          </div>

          <div className="py-2">
            <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold mb-2">Mission</p>
            <button 
              onClick={() => handleTabChange('calendar')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
                activeTab === 'calendar' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <CalendarIcon size={18} />
              Calendar
            </button>
            <button 
              onClick={() => handleTabChange('history')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
                activeTab === 'history' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <HistoryIcon size={18} />
              History
            </button>
          </div>

          <button 
            onClick={() => handleTabChange('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm uppercase tracking-widest font-bold",
              activeTab === 'settings' ? "premium-gradient text-black shadow-xl studio-shadow" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-black text-sm border border-white/10">
              M
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Elite User</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Verified Protocol</p>
            </div>
            <LogOut 
              onClick={handleLogout}
              size={16} 
              className="text-muted-foreground cursor-pointer hover:text-white transition-colors" 
            />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent)]">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-background/40 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-5xl mx-auto h-full px-6 md:px-10 grid grid-cols-3 items-center">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-syne font-bold uppercase tracking-tight hidden sm:block">{activeTab}</h1>
            </div>

            {/* Center */}
            <div className="flex justify-center">
              <div className="w-full max-w-md relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search objectives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex justify-end items-center gap-4">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group"
                >
                  <Download size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Install App</span>
                </button>
              )}
              <div className="flex items-center bg-muted p-1 rounded-full border border-white/5 studio-shadow">
                <button
                  onClick={() => setIsEditMode(true)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    isEditMode ? "premium-gradient text-black shadow-lg" : "text-muted-foreground hover:text-white"
                  )}
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    isEditMode ? "text-muted-foreground hover:text-white" : "premium-gradient text-black shadow-lg"
                  )}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {(activeTab === 'dashboard' || activeTab === 'history' || activeTab === 'active' || activeTab === 'completed' || activeTab === 'reserve') && (
                  <>
                    {activeTab === 'dashboard' && (
                      <>
                        {window.self !== window.top && (
                          <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/10 rounded-lg">
                                <Zap size={16} className="text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-tight">Full Protocol Available</p>
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Open in new tab to install as a desktop program</p>
                              </div>
                            </div>
                            <a 
                              href={window.location.href} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 premium-gradient text-black rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg"
                            >
                              Open Tab
                            </a>
                          </motion.div>
                        )}
                        
                        <Dashboard 
                          totalTasks={selectedDateTasks.length}
                          completedTasks={selectedDateTasks.filter(t => t.status === 'completed').length}
                          streak={stats.streak}
                          dailyProgress={dailyProgress}
                        />
                      </>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                      <h2 className="text-3xl font-syne font-extrabold tracking-tighter uppercase italic">
                        {activeTab === 'dashboard' ? "Main Goals" : 
                         activeTab === 'history' ? "Mission History" :
                         activeTab === 'active' ? "Active Objectives" :
                         activeTab === 'completed' ? "Mission Accomplished" :
                         "Reserve Protocol"}
                      </h2>
                      <div className="flex gap-2">
                        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                          {activeTab === 'dashboard' ? format(selectedDate, 'EEEE, MMMM do') : "All Records"}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditMode && activeTab === 'dashboard' && (
                        <motion.form 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          onSubmit={handleAddTask} 
                          className="mb-12"
                        >
                          <div className="relative group">
                            <input 
                              type="text" 
                              placeholder="Define your next objective..."
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddTask();
                                }
                              }}
                              className="w-full bg-card border border-white/5 rounded-2xl py-5 pl-8 pr-40 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white/5 transition-all premium-shadow studio-shadow placeholder:text-muted-foreground/30"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <PremiumButton type="submit">
                                <Plus size={16} strokeWidth={3} />
                                Add Goal
                              </PremiumButton>
                            </div>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="space-y-6">
                      <AnimatePresence mode="popLayout">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map((task) => (
                            <TaskCard 
                              key={task.id}
                              task={task}
                              isEditMode={isEditMode}
                              onToggleSubTask={toggleSubTask}
                              onAddSubTask={addSubTask}
                              onDeleteTask={deleteTask}
                              onDeleteSubTask={deleteSubTask}
                              onReorderSubTasks={reorderSubTasks}
                              onUpdateStatus={(status) => updateTask(task.id, { status })}
                            />
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                          >
                            <p className="text-muted-foreground font-mono uppercase tracking-widest text-xs">No active objectives detected.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {activeTab === 'calendar' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-10 rounded-3xl border-dashed"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <h2 className="text-3xl font-syne font-bold uppercase italic">Chronicle</h2>
                      <PremiumButton onClick={() => setSelectedDate(new Date())}>Today</PremiumButton>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 mb-10">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{d}</div>
                      ))}
                      {/* Simple calendar logic for current month */}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(i + 1);
                        const isSelected = isSameDay(date, selectedDate);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedDate(date);
                              setActiveTab('dashboard');
                            }}
                            className={cn(
                              "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all border",
                              isSelected 
                                ? "premium-gradient text-black border-white shadow-xl studio-shadow" 
                                : "bg-white/5 border-white/5 hover:border-white/20"
                            )}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest text-center">Select a date to plan or view objectives.</p>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-10 rounded-3xl space-y-10"
                  >
                    <h2 className="text-3xl font-syne font-bold uppercase italic">Core Config</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 studio-shadow">
                        <div>
                          <h3 className="font-bold uppercase tracking-tight">Cloud Sync</h3>
                          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">Status: Connected to Supabase</p>
                        </div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 studio-shadow">
                        <div>
                          <h3 className="font-bold uppercase tracking-tight">Elite Protocol</h3>
                          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">Account: pro679715@gmail.com</p>
                        </div>
                        <PremiumButton onClick={handleLogout} className="px-4 py-2">Logout</PremiumButton>
                      </div>

                      {deferredPrompt && (
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 studio-shadow">
                          <div>
                            <h3 className="font-bold uppercase tracking-tight">Desktop App</h3>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">Install MENN Tracker as a standalone program</p>
                          </div>
                          <PremiumButton onClick={handleInstallClick} className="px-4 py-2 gap-2">
                            <Download size={14} />
                            Install
                          </PremiumButton>
                        </div>
                      )}

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 studio-shadow">
                        <h3 className="font-bold uppercase tracking-tight mb-4">System Features</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            <CheckCircle2 size={14} className="text-white" />
                            Realtime Sync
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            <CheckCircle2 size={14} className="text-white" />
                            Lenis Scroll
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            <CheckCircle2 size={14} className="text-white" />
                            Studio Shadows
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                            <Clock size={14} className="text-white" />
                            Reserve System
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
