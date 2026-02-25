import React, { useState, useEffect } from 'react';
import { 
    Zap, AlertCircle, ArrowLeft, Terminal, ShieldAlert, 
    Cpu, Clock, FileCode2, Target, CheckCircle2, XCircle, Info 
} from 'lucide-react';
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

    const getFileExtension = (lang) => {
        if (!lang) return 'txt';
        const l = lang.toLowerCase();
        if (l === 'python') return 'py';
        if (l === 'java') return 'java';
        return 'cpp';
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500 bg-slate-50 min-h-screen p-4 md:p-6">
            
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Return to Hacker Board</span>
                </button>

                <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                    <Target size={16} className="text-rose-600 animate-pulse" />
                    <span className="text-rose-700 font-bold text-xs tracking-widest uppercase">Target Acquired</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* Left Panel: Target Code Viewer (Dark Mode) */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[85vh]">
               
                    {/* Header Details */}
                    <div className="p-5 border-b border-slate-800 shrink-0 bg-slate-900">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                    <Terminal className="text-blue-400" size={20} />
                                    Submission #{submission.id}
                                </h2>
                                <p className="text-slate-400 font-medium mt-1 text-sm">Reviewing source logic for vulnerabilities.</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                            <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20 flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                                    {submission?.username?.charAt(0).toUpperCase()}
                                </div>
                                {submission.username}
                            </span>
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5">
                                <FileCode2 size={14} /> {submission.language}
                            </span>
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5">
                                <Clock size={14} /> {fullSubmission?.executionTime || submission.time || '0.0s'}
                            </span>
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5">
                                <Cpu size={14} /> {fullSubmission?.memoryUsed || submission.memoryUsed || '0 MB'}
                            </span>
                        </div>
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 flex flex-col bg-[#0d1117] relative overflow-hidden">
                        
                        {/* Fake IDE Tab */}
                        <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center px-4 shrink-0 justify-between">
                            <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                                <FileCode2 size={14} className="text-slate-500"/> 
                                target_source.{getFileExtension(submission.language)}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500 gap-4">
                                    <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span className="font-mono text-xs tracking-widest text-blue-400">DECRYPTING SOURCE...</span>
                                </div>
                            ) : error ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-2 font-mono text-sm">
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-full">
                                    <div className="w-12 bg-[#0d1117] border-r border-slate-800 flex flex-col items-end py-4 pr-3 text-xs font-mono text-slate-600 select-none">
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

                {/* Right Panel: Injection Console (Light Mode) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[85vh]">
                    
                    <div className="p-6 border-b border-slate-100 shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="text-amber-500" size={20} />
                            <h3 className="text-lg font-bold text-slate-900">Injection Console</h3>
                        </div>
                        <p className="text-sm text-slate-500">
                            Provide a test case that causes the target solution to fail, timeout, or crash.
                        </p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-6 bg-slate-50/50 overflow-y-auto">
                        
                        {/* Input Area */}
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                Malicious Payload (Input)
                            </label>
                            <textarea
                                value={hackTest}
                                onChange={(e) => setHackTest(e.target.value)}
                                placeholder="Enter the exact standard input..."
                                className="flex-1 w-full p-4 bg-white border border-slate-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm placeholder:text-slate-400"
                                spellCheck="false"
                            />
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleHack}
                            disabled={!hackTest.trim()}
                            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                        >
                            <ShieldAlert size={18} />
                            Execute Hack
                        </button>

                        {/* Protocol Rules - Clean Information Alert */}
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                                <Info size={16} className="text-blue-600" /> Protocol Rules
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" /> 
                                    <span>Your test case must strictly follow the problem's defined input constraints.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> 
                                    <span>If the target solution fails on your test, you earn <strong className="font-bold">+100 points</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" /> 
                                    <span>If the target solution passes, you lose <strong className="font-bold">-50 points</strong>.</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}