import React, { useState, useEffect } from 'react';

import { 
  Trophy, Code, ChevronRight, Filter, Home, Globe, CalendarDays, LayoutDashboard, 
  Terminal as TerminalIcon, Zap 
} from 'lucide-react';

import { AuroraText } from "./components/ui/aurora-text"; // Adjust the path if yours is in "@/registry/magicui/aurora-text"

import Navbar from './components/common/Navbar';
import AuthModal from './components/common/AuthModal';
import Leaderboard from './components/features/leaderboard/Leaderboard';
import ProblemWorkspace from './components/features/problems/ProblemWorkspace';
import HackingView from './components/features/hacking/HackingView';
import { API_BASE_URL } from './config';

// --- Magic UI Imports ---
import { Particles } from "./components/ui/particles";
import { AnimatedSpan, Terminal, TypingAnimation } from "./components/ui/terminal";
import { BentoCard, BentoGrid } from "./components/ui/bento-grid";


// --- Mock Data ---
const initialWeeks = [
  { id: 1, title: "Week 1 - Arrays & Strings", problems: [] },
  { id: 2, title: "Week 2 - Hashmaps & Two Pointers", problems: [] }
];

// --- Bento Grid Data ---
const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
];

const features = [
  {
    Icon: TerminalIcon,
    name: "The ComputeX",
    description: "Write, test, and execute your logic in our high-performance IDE with instant console feedback.",
    href: "#",
    cta: "Enter Arena",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px]" />
        
        {/* Ultra-Premium Glassmorphic IDE */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 w-64 lg:w-[340px] bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(59,130,246,0.4)] border border-slate-700/50 flex flex-col overflow-hidden transform group-hover:-translate-y-3 group-hover:-translate-x-4 group-hover:rotate-[-2deg] transition-all duration-700 ease-out">
           <div className="h-9 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between px-4">
             <div className="flex gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             </div>
             <span className="text-[10px] text-slate-400 font-mono font-medium tracking-wider">solution.cpp</span>
           </div>
           <div className="p-5 text-[11px] lg:text-xs font-mono text-slate-300 flex flex-col gap-2.5">
             <div className="flex gap-2"><span className="text-blue-400 font-bold">auto</span><span className="text-amber-300">solve</span><span>() -{'>'}</span><span className="text-emerald-400 font-bold">void</span><span> {'{'}</span></div>
             <div className="pl-4 flex gap-2 text-slate-500 italic">// optimized for O(n) runtime</div>
             <div className="pl-4 flex gap-2"><span className="text-blue-400 font-bold">for</span><span>(</span><span className="text-emerald-400">int</span><span> i = 0; i &lt; n; ++i) {'{'}</span></div>
             <div className="pl-8 flex gap-2 items-center"><span className="text-purple-400">dp</span><span>[i] = </span><span className="text-amber-300">max</span><span>(dp[i], val);</span><span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)] ml-0.5"></span></div>
             <div className="pl-4">{'}'}</div>
             <div>{'}'}</div>
           </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Trophy,
    name: "Live Leaderboards",
    description: "Watch the rankings shift in real-time as submissions roll in.",
    href: "#",
    cta: "View Rankings",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-end pr-8 lg:pr-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        {/* Dynamic Leaderboard Stack */}
        <div className="w-48 lg:w-56 flex flex-col gap-3 transform group-hover:-translate-y-4 group-hover:scale-105 transition-all duration-700 ease-out z-10">
          {/* 1st Place */}
          <div className="h-14 rounded-2xl bg-white/90 backdrop-blur-sm shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] border border-emerald-200 flex items-center px-4 gap-3 relative overflow-hidden group/item">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center text-[11px] font-extrabold text-white shadow-sm ring-2 ring-white">1</div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-center"><div className="h-2 w-16 bg-slate-800 rounded-full"></div><div className="text-[10px] font-extrabold text-emerald-600">2840</div></div>
              <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden"><div className="h-full w-[95%] bg-emerald-500 rounded-full"></div></div>
            </div>
          </div>
          {/* 2nd Place */}
          <div className="h-12 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-slate-100 flex items-center px-4 gap-3 ml-2 opacity-90">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 ring-2 ring-white">2</div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-center"><div className="h-2 w-12 bg-slate-400 rounded-full"></div><div className="text-[9px] font-bold text-slate-500">2710</div></div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[80%] bg-slate-400 rounded-full"></div></div>
            </div>
          </div>
          {/* 3rd Place */}
          <div className="h-10 rounded-xl bg-white/60 backdrop-blur-sm shadow-md border border-slate-100 flex items-center px-4 gap-3 ml-4 opacity-70">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-400 ring-2 ring-white">3</div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex justify-between items-center"><div className="h-1.5 w-10 bg-slate-300 rounded-full"></div></div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[60%] bg-slate-300 rounded-full"></div></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Zap,
    name: "The Hacker Board",
    description: "Review successful code, inject failing test cases, and earn bounty points for breaking logic.",
    href: "#",
    cta: "Start Hacking",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]" />
        
        {/* Vulnerability Scanner Grid - Scaled down and pinned strictly to the bottom right */}
        <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 w-36 h-36 lg:w-40 lg:h-40 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-2 grid grid-cols-2 gap-2 transform group-hover:rotate-6 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-700 ease-out z-10">
           <div className="bg-slate-100/80 rounded-xl border border-white"></div>
           <div className="bg-slate-100/80 rounded-xl border border-white"></div>
           
           {/* Targeted Block */}
           <div className="bg-rose-50 border-2 border-rose-400 rounded-xl relative overflow-hidden shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-rose-400/40 animate-[bounce_2s_infinite]"></div>
              <Zap size={20} className="text-rose-500 drop-shadow-md z-10 animate-pulse" />
           </div>
           
           <div className="bg-slate-100/80 rounded-xl border border-white"></div>
        </div>
      </div>
    ),
  },
  {
    Icon: Globe,
    name: "Global Rating System",
    description: "Compete against engineers worldwide and climb the global Elo tiers.",
    className: "col-span-3 lg:col-span-2",
    href: "#",
    cta: "See Top Coders",
    background: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px]" />
        
        {/* Thick Neon Chart */}
        <div className="absolute right-0 bottom-0 w-[90%] h-[85%] flex items-end transform group-hover:scale-[1.03] transition-transform duration-700 origin-bottom">
           <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]" preserveAspectRatio="none">
             <path d="M0 200 L 0 150 C 50 140, 100 160, 150 110 C 200 60, 250 80, 300 40 C 350 0, 380 20, 400 10 L 400 200 Z" fill="url(#indigo-grad)" opacity="0.15" />
             <path d="M0 150 C 50 140, 100 160, 150 110 C 200 60, 250 80, 300 40 C 350 0, 380 20, 400 10" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
             <defs>
               <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#6366f1" />
                 <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
               </linearGradient>
             </defs>
           </svg>
           
           {/* Floating Rank Nodes */}
           <div className="absolute right-[5%] top-[10%] w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,1)] animate-pulse ring-4 ring-white"></div>
           <div className="absolute right-[5%] top-[10%] w-12 h-12 bg-indigo-500/20 rounded-full animate-ping"></div>
           
           <div className="absolute right-[8%] top-[0%] bg-white/90 backdrop-blur-md border border-indigo-100 px-4 py-2 rounded-xl shadow-xl shadow-indigo-500/20 text-xs font-extrabold text-indigo-700 transform group-hover:-translate-y-3 transition-transform duration-700">
             Grandmaster <span className="text-emerald-500 ml-1">+24</span>
           </div>
        </div>
      </div>
    ),
  },
];

// --- Sub-Components ---
export function TerminalDemo2() {
  return (
    <Terminal>
      <TypingAnimation delay={0}>$ g++ -O3 solution.cpp -o solution</TypingAnimation>
      <AnimatedSpan delay={1200} className="text-slate-400">
        [1/1] Compiling target... done.
      </AnimatedSpan>
      <TypingAnimation delay={2200}>$ ./solution --run-tests</TypingAnimation>
      <AnimatedSpan delay={3200} className="text-emerald-500">
        ✓ Test Case 1: Passed (12ms)
      </AnimatedSpan>
      <AnimatedSpan delay={3600} className="text-emerald-500">
        ✓ Test Case 2: Passed (08ms)
      </AnimatedSpan>
      <AnimatedSpan delay={4000} className="text-emerald-500">
        ✓ hidden_tests: Passed (All)
      </AnimatedSpan>
      <AnimatedSpan delay={4800} className="text-blue-500 font-bold mt-2">
        Status: ACCEPTED. Global Rating: +24 📈
      </AnimatedSpan>
    </Terminal>
  )
}

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [mainTab, setMainTab] = useState('home'); 
  const [activeWeekId, setActiveWeekId] = useState(initialWeeks[0].id);
  const [weekView, setWeekView] = useState('problems'); 
  const [problemCategory, setProblemCategory] = useState('All');
  const categories = ['All', 'Easy', 'Medium', 'Hard'];

  const [weeksData, setWeeksData] = useState(initialWeeks);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50/80 border border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50/80 border border-amber-200';
      case 'Hard': return 'text-rose-600 bg-rose-50/80 border border-rose-200';
      default: return 'text-slate-600 bg-slate-50/80 border border-slate-200';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 70) return 'text-emerald-500';
    if (accuracy >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/me`, { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then(data => {
        setIsLoggedIn(true);
        setUsername(data.username || data.name);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('user');
      });
  }, []);

  const handleWeekSelect = async (weekId) => {
    setActiveWeekId(weekId);
    setWeekView('problems'); 

    const weekIndex = weeksData.findIndex(w => w.id === weekId);
    if (weeksData[weekIndex].problems.length > 0) return;

    setLoadingProblems(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems?contestId=${weekId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch");

      const problemsFromBackend = await response.json();
      setWeeksData(prevWeeks => prevWeeks.map(week => {
        if (week.id === weekId) return { ...week, problems: problemsFromBackend };
        return week;
      }));
    } catch (error) {
      console.error("Error loading problems:", error);
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'contests') handleWeekSelect(activeWeekId);
  }, [mainTab]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggedIn(false);
      setUsername('');
      alert('Logged out successfully!');
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const activeWeekData = weeksData.find(w => w.id === activeWeekId);
  const filteredProblems = activeWeekData?.problems.filter(
    p => problemCategory === 'All' || p.difficulty === problemCategory
  ) || [];

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      <Particles className="absolute inset-0 z-0" quantity={120} ease={80} color="#0f172a" refresh />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onGoogleLogin={() => handleOAuthLogin('google')}
            onGithubLogin={() => handleOAuthLogin('github')}
          />
        )}

        {selectedSubmission ? (
          <HackingView submission={selectedSubmission} onBack={() => setSelectedSubmission(null)} />
        ) : selectedProblem ? (
          <ProblemWorkspace
            problem={selectedProblem}
            onBack={() => setSelectedProblem(null)}
            onSelectSubmission={(sub) => setSelectedSubmission(sub)}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            onShowAuth={() => setShowAuthModal(true)}
          />
        ) : (
          <>
            <Navbar
              isLoggedIn={isLoggedIn}
              username={username}
              onLogout={handleLogout}
              onAuthClick={() => setShowAuthModal(true)}
            />

            <div className="max-w-7xl mx-auto p-6 w-full flex-1 flex flex-col">
              
              {/* --- TOP LEVEL NAVIGATION --- */}
              <div className="flex justify-center mb-10">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm p-1.5 inline-flex w-full sm:w-auto">
                  <button
                    onClick={() => setMainTab('home')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      mainTab === 'home'
                        ? 'bg-white shadow-md text-blue-600 scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <Home size={18} /> Home
                  </button>
                  <button
                    onClick={() => setMainTab('contests')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      mainTab === 'contests'
                        ? 'bg-white shadow-md text-blue-600 scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <Code size={18} /> Contests
                  </button>
                  <button
                    onClick={() => setMainTab('global-leaderboard')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      mainTab === 'global-leaderboard'
                        ? 'bg-white shadow-md text-blue-600 scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    <Globe size={18} /> Global Leaderboard
                  </button>
                </div>
              </div>

              {/* --- ROUTE 1: HOME PAGE --- */}
              {mainTab === 'home' && (
                <div className="flex-1 flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-20">
                  
                  {/* Hero Section */}
                  <div className="w-full flex flex-col lg:flex-row items-center gap-12 mt-4 lg:mt-10">
                    <div className="flex-1 text-center lg:text-left z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-blue-700 text-sm font-bold mb-6 shadow-sm">
                        <LayoutDashboard size={16} /> Welcome to the Arena
                      </div>
                      
                      {/* UPDATED H1 WITH AURORA TEXT */}
                      <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                        Master Algorithms.<br/>
                        <AuroraText>Climb the Ranks.</AuroraText>
                      </h1>
                      
                      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
                        Jump into weekly contests, solve algorithmic challenges, and prove your engineering skills on the global leaderboard.
                      </p>
                      <button 
                        onClick={() => setMainTab('contests')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(37,99,235,0.6)] hover:-translate-y-1"
                      >
                        Enter the Contests
                      </button>
                    </div>

                    {/* Terminal Display */}
                    <div className="flex-1 w-full max-w-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                      <TerminalDemo2 />
                    </div>
                  </div>

                  {/* Bento Grid Section */}
                  <div className="w-full">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Everything you need to succeed</h2>
                      <p className="text-slate-600 text-lg font-medium">A fully-featured platform designed specifically for competitive programmers.</p>
                    </div>
                    <BentoDemo />
                  </div>
                </div>
              )}

              {/* --- ROUTE 2: GLOBAL LEADERBOARD --- */}
              {mainTab === 'global-leaderboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6 flex items-center gap-3">
                    <Globe className="text-blue-600" size={28} />
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Global Rankings</h2>
                  </div>
                  <Leaderboard /> 
                </div>
              )}

              {/* --- ROUTE 3: CONTESTS WORKSPACE --- */}
              {mainTab === 'contests' && (
                <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* LEFT SIDEBAR: Week Selector */}
                  <div className="w-full lg:w-64 shrink-0">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Available Contests</h3>
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                      {weeksData.map((week) => (
                        <button
                          key={week.id}
                          onClick={() => handleWeekSelect(week.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-left ${
                            activeWeekId === week.id
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                              : 'bg-white/60 backdrop-blur-md border border-white/40 text-slate-600 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          <CalendarDays size={18} className={activeWeekId === week.id ? 'text-blue-200' : 'text-slate-400'} />
                          <span className="truncate">{week.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT AREA: Selected Week Content */}
                  <div className="flex-1 min-w-0">
                    {activeWeekData && (
                      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden">
                        
                        {/* Selected Week Header & Internal Tabs */}
                        <div className="border-b border-slate-200/50 bg-white/40 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            {activeWeekData.title}
                          </h2>
                          
                          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full sm:w-auto">
                            <button
                              onClick={() => setWeekView('problems')}
                              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                weekView === 'problems' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Problems
                            </button>
                            <button
                              onClick={() => setWeekView('weekly-leaderboard')}
                              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                weekView === 'weekly-leaderboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Weekly Leaderboard
                            </button>
                          </div>
                        </div>

                        {/* WEEK VIEW: PROBLEMS */}
                        {weekView === 'problems' && (
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                              <div className="px-2 text-slate-400"><Filter size={16} /></div>
                              {categories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => setProblemCategory(category)}
                                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                                    problemCategory === category
                                      ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                                      : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white hover:text-slate-900'
                                  }`}
                                >
                                  {category}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-3">
                              {loadingProblems ? (
                                <div className="p-10 text-center text-slate-500 font-medium animate-pulse">
                                  Loading arena...
                                </div>
                              ) : filteredProblems.length === 0 ? (
                                <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 text-slate-500 font-medium">
                                  No {problemCategory} problems found in this contest.
                                </div>
                              ) : (
                                filteredProblems.map((problem) => (
                                  <div
                                    key={problem.id}
                                    onClick={() => setSelectedProblem(problem)}
                                    className="bg-white/60 border border-white/60 p-4 rounded-2xl hover:bg-white cursor-pointer transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md"
                                  >
                                    <div className="flex items-center gap-5 flex-1">
                                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        <span className="text-blue-700 font-bold text-lg">{problem.id}</span>
                                      </div>

                                      <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                                          {problem.problemName}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                          </span>
                                          <div className="flex items-center gap-1.5 bg-slate-100/50 px-2.5 py-0.5 rounded-full border border-slate-200/50 text-xs font-medium">
                                            <span className="text-emerald-500">✓</span> {problem.solved || 0} solved
                                          </div>
                                          <div className={`flex items-center gap-1.5 bg-slate-100/50 px-2.5 py-0.5 rounded-full border border-slate-200/50 text-xs font-semibold ${getAccuracyColor(problem.accuracy)}`}>
                                            {problem.accuracy || 0}% accuracy
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* WEEK VIEW: WEEKLY LEADERBOARD */}
                        {weekView === 'weekly-leaderboard' && (
                          <div className="p-6">
                            <div className="mb-4 flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 inline-flex">
                              <Trophy size={16} />
                              <span className="font-semibold text-sm">Showing rankings for {activeWeekData.title}</span>
                            </div>
                            <Leaderboard contestId={activeWeekId} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}