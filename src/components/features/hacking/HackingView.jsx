import React, { useState, useEffect } from 'react';
import { Zap, AlertCircle, ArrowLeft, Terminal, ShieldAlert, Cpu, Clock, FileCode2, Target } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

export default function HackingView({ submission, onBack }) {
  const [hackTest, setHackTest] = useState('');

  const [fullSubmission, setFullSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!submission?.id) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/api/submissions/user/${submission.id}`, {
      credentials: 'include' 
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch code");
        return res.json();
      })
      .then(data => {
        setFullSubmission(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load submission code.");
        setLoading(false);
      });
  }, [submission]);

  const handleHack = () => {
    alert(`Hacking attempt submitted for Submission #${submission.id}`);
    onBack();
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <button
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 bg-white/60 backdrop-blur-md hover:bg-white border border-slate-200/60 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-wide">Return to Hacker Board</span>
        </button>

        <div className="bg-amber-100/50 border border-amber-200/50 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm backdrop-blur-sm">
          <ShieldAlert size={18} className="text-amber-600 animate-pulse" />
          <span className="text-amber-700 font-bold text-sm tracking-widest uppercase">Target Acquired</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

    
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[80vh]">
       
          <div className="p-6 border-b border-slate-100 bg-white/50 shrink-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Target className="text-rose-500" size={24} />
                  Submission #{submission.id}
                </h2>
                <p className="text-slate-500 font-medium mt-1 text-sm">Target logic mapped and ready for analysis.</p>
              </div>
            </div>

          
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[10px]">{submission.username.charAt(0).toUpperCase()}</div>
                {submission.username}
              </span>
              <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <FileCode2 size={14} /> {submission.language}
              </span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <Clock size={14} /> {fullSubmission?.executionTime || submission.time || '0.0s'}
              </span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-100 flex items-center gap-1.5">
                <Cpu size={14} /> {fullSubmission?.memoryUsed || submission.memoryUsed || '0 MB'}
              </span>
            </div>
          </div>

          
          <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
            
            <div className="h-10 bg-slate-900 border-b border-white/10 flex items-center px-4 shrink-0 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs font-mono text-slate-500">target_source.{submission.language.toLowerCase() === 'python' ? 'py' : submission.language.toLowerCase() === 'java' ? 'java' : 'cpp'}</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500 gap-4">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="font-mono text-sm tracking-widest animate-pulse">DECRYPTING SOURCE...</span>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-rose-950/30">
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-6 py-4 rounded-xl flex items-center gap-3 font-mono text-sm">
                    <AlertCircle size={20} /> {error}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-full">
                  
                  <div className="w-12 bg-slate-900/50 border-r border-white/5 flex flex-col items-end py-4 pr-3 text-xs font-mono text-slate-600 select-none">
                    {fullSubmission?.code?.split('\n').map((_, i) => (
                      <span key={i} className="leading-relaxed">{i + 1}</span>
                    ))}
                  </div>
                  
                  <pre className="p-4 text-slate-300 text-[13px] font-mono leading-relaxed whitespace-pre overflow-x-auto">
                    {fullSubmission?.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60 overflow-hidden flex flex-col h-[80vh]">
          
          <div className="p-8 bg-gradient-to-br from-amber-50 to-rose-50 border-b border-amber-100 shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-amber-200">
                <Zap className="text-amber-500" size={24} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Injection Console</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              You have analyzed the logic. Now, craft a test case that proves it fails.
            </p>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-6 bg-slate-50/30 overflow-y-auto">
            
            
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                Malicious Payload (Input)
              </label>
              <textarea
                value={hackTest}
                onChange={(e) => setHackTest(e.target.value)}
                placeholder="Enter the exact input that will break their code..."
                className="flex-1 w-full p-5 bg-white border border-slate-200 rounded-2xl font-mono text-sm resize-none focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all shadow-inner placeholder:text-slate-300"
              />
            </div>

            
            <button
              onClick={handleHack}
              disabled={!hackTest.trim()}
              className="group relative w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-rose-500/25 disabled:shadow-none hover:shadow-rose-500/40 hover:-translate-y-0.5"
            >
              <Zap size={20} className={!hackTest.trim() ? "" : "group-hover:scale-110 transition-transform"} />
              EXECUTE HACK
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 pointer-events-none"></div>
            </button>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                <ShieldAlert size={16} className="text-slate-400" /> Protocol Rules:
              </h4>
              <ul className="text-sm text-slate-600 space-y-2.5 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> 
                  Your test case must strictly follow the problem's defined input format.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">+</span> 
                  If the target solution fails on your test, you earn <strong className="text-emerald-600 ml-1">+100 points</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-0.5">-</span> 
                  If the target solution successfully passes, you lose <strong className="text-rose-600 ml-1">-50 points</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span> 
                  Each submission can only be successfully hacked once per user.
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}