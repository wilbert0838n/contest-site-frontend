import React, { useState, useEffect } from 'react';
import { 
    Play, Check, X, Users, Eye, ArrowLeft, Terminal, FileCode2, Zap, 
    Settings, Maximize2, RotateCcw, ThumbsUp, ThumbsDown, Bookmark, 
    Share2, Search, Filter, Send, Lightbulb
} from 'lucide-react';
import { problemData, successfulSubmissions } from '../../../data/mockData';
import { API_BASE_URL } from '../../../config';

export default function ProblemWorkspace({ problem, onBack, onSelectSubmission, isLoggedIn, setIsLoggedIn, onShowAuth }) {
    const [activeTab, setActiveTab] = useState('problem');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('CPP');
    const [isRunning, setIsRunning] = useState(false);
    const [verdict, setVerdict] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [submissionList, setSubmissionsList] = useState([]);

    useEffect(() => {
        if (activeTab === 'submissions' && isLoggedIn) {
            fetch(`${API_BASE_URL}/api/submissions/problem/${problem.id}/successful`, {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => setSubmissionsList(data))
                .catch(err => console.error("Error fetching submissions:", err));
        }
    }, [activeTab, problem.id, isLoggedIn]);

    const getCurrentUserId = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr).id;
        } catch (e) {
            return null;
        }
    };

    const handleRun = async () => {
        if (!isLoggedIn) {
            onShowAuth();
            return;
        }

        setIsRunning(true);
        setVerdict('Compiling & Executing...');
        setTestResults([]);

        const payload = {
            userId: getCurrentUserId(),
            problemId: problem.id,
            language: language,
            code: code
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Server Error");

            const result = await response.text();
            setIsRunning(false);
            setVerdict(result);

            const isSuccess = result === "Accepted" || result === "All Testcase Passed";
            setTestResults([{ id: "System Test", passed: isSuccess, time: '0.1s', memory: '12 MB' }]);

        } catch (error) {
            setIsRunning(false);
            setVerdict("System Error");
            setTestResults([{ id: "Error", passed: false, time: '-', memory: '-' }]);
        }
    };

    const getAccuracyColor = (accuracy) => {
        if (accuracy >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (accuracy >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
            
          
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-wide">Arena Overview</span>
                </button>

                <div className="bg-white border border-slate-200 rounded-xl p-1 inline-flex shadow-sm w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('problem')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                            activeTab === 'problem'
                                ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <FileCode2 size={16} /> Workspace
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                            activeTab === 'submissions'
                                ? 'bg-slate-900 text-white shadow-md scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                    >
                        <Users size={16} /> Submissions <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-1">{submissionList.length}</span>
                    </button>
                </div>
            </div>

            
            {activeTab === 'problem' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                  
                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60 overflow-hidden flex flex-col h-[80vh]">
                        
                        <div className="p-6 border-b border-slate-100 shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    {problem.problemName || problemData.title}
                                </h2>
                                <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-amber-500 rounded-xl transition-colors">
                                    <Bookmark size={20} />
                                </button>
                            </div>
                            
                          
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold mb-4">
                                <span className={`px-3 py-1.5 rounded-lg border ${getAccuracyColor(problem?.accuracy || 0)}`}>
                                    🎯 Accuracy: {problem?.accuracy || 0}%
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                                    ⏱ {problemData.timeLimit}
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                                    💾 {problemData.memoryLimit}
                                </span>
                            </div>

                         
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-md">Data Structures</span>
                                <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-1 rounded-md">Algorithms</span>
                                <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-md">Logic</span>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-slate-50/30">
                            <section>
                                <p className="text-slate-700 leading-relaxed font-medium text-[15px]">{problem.description}</p>
                            </section>

                            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Input Format
                                    </h3>
                                    <p className="text-slate-700 text-sm whitespace-pre-line font-mono">{problem.inputFormat}</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Output Format
                                    </h3>
                                    <p className="text-slate-700 text-sm font-mono">{problem.outputFormat}</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Lightbulb className="text-amber-500" size={18} /> Examples
                                </h3>
                                {problem.examples.map((example, idx) => (
                                    <div key={idx} className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Example {idx + 1}</span>
                                            <button className="text-slate-400 hover:text-blue-600 text-xs font-semibold transition-colors">Copy</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                            <div className="p-5">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Input</span>
                                                <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{example.input}</pre>
                                            </div>
                                            <div className="p-5">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Output</span>
                                                <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{example.output}</pre>
                                            </div>
                                        </div>
                                        {example.explanation && (
                                            <div className="p-5 bg-blue-50/30 border-t border-slate-100">
                                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">Explanation</span>
                                                <p className="text-slate-600 text-sm">{example.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        </div>

           
                        <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <button className="flex items-center gap-1.5 p-2 hover:bg-slate-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors text-sm font-semibold">
                                    <ThumbsUp size={16} /> 124
                                </button>
                                <button className="flex items-center gap-1.5 p-2 hover:bg-slate-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors text-sm font-semibold">
                                    <ThumbsDown size={16} /> 12
                                </button>
                            </div>
                            <button className="flex items-center gap-2 p-2 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors text-sm font-semibold">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60 overflow-hidden flex flex-col h-[80vh]">
                        <div className="p-3 border-b border-slate-100 bg-slate-50/50 shrink-0 flex justify-between items-center">
                            <div className="flex items-center gap-3 pl-2">
                                <Terminal size={18} className="text-blue-600" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-white border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="CPP">C++</option>
                                    <option value="PYTHON">Python 3</option>
                                    <option value="JAVA">Java</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-1 pr-2">
                                <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all shadow-sm">
                                    <RotateCcw size={16} />
                                </button>
                                <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all shadow-sm">
                                    <Settings size={16} />
                                </button>
                                <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all shadow-sm">
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex bg-slate-50/30 overflow-hidden relative">
                            <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-end py-6 pr-3 text-xs font-mono text-slate-300 select-none hidden sm:flex">
                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                            </div>
                            
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Write your solution here..."
                                className="w-full h-full bg-transparent p-6 text-slate-800 font-mono text-sm resize-none focus:outline-none custom-scrollbar placeholder:text-slate-300 leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            <div className="flex gap-4">
                                <span>UTF-8</span>
                                <span>Spaces: 4</span>
                            </div>
                            <span>Ln 1, Col 1</span>
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex justify-between items-center">
                            <button className="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <Terminal size={16} /> Console
                            </button>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="group flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                                >
                                    {isRunning ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <Play size={16} />}
                                    Run
                                </button>
                                <button
                                    disabled={isRunning}
                                    className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                                >
                                    <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    Submit
                                </button>
                            </div>
                        </div>

                  
                        {testResults.length > 0 && (
                            <div className="border-t border-slate-200 bg-white max-h-[40%] overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-2 duration-300 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                                    {verdict === "Accepted" || verdict === "All Testcase Passed" ? (
                                        <div className="bg-emerald-100 p-1.5 rounded-full"><Check size={16} className="text-emerald-600" /></div>
                                    ) : (
                                        <div className="bg-rose-100 p-1.5 rounded-full"><X size={16} className="text-rose-600" /></div>
                                    )}
                                    <h4 className={`font-bold text-sm uppercase tracking-widest ${verdict === "Accepted" || verdict === "All Testcase Passed" ? "text-emerald-600" : "text-rose-600"}`}>
                                        {verdict}
                                    </h4>
                                </div>
                                <div className="p-4 space-y-3 bg-slate-50/50">
                                    {testResults.map((result) => (
                                        <div key={result.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                {result.passed ? (
                                                    <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">Pass</span>
                                                ) : (
                                                    <span className="text-rose-700 font-bold text-[10px] uppercase tracking-wider bg-rose-50 border border-rose-200 px-2 py-1 rounded">Fail</span>
                                                )}
                                                <span className="text-sm font-bold text-slate-700">{result.id}</span>
                                            </div>
                                            <div className="text-xs font-mono text-slate-500 flex gap-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <span>⏱ {result.time}</span>
                                                <span>💾 {result.memory}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'submissions' && (
                <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             
                    <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50/50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                                    <Zap className="text-amber-500" size={24} />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">The Hacker Board</h3>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                Review successful submissions. Inject failing test cases to earn bounty points.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search hackers..." 
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                            </div>
                            <button className="flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm shrink-0">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Hacker</th>
                                    <th className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Stack</th>
                                    <th className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Performance</th>
                                    <th className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-8 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissionList.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center">
                                                    <span className="text-blue-700 font-bold text-xs">{submission.username.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <span className="font-bold text-slate-800">{submission.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-slate-600 font-mono text-xs font-bold bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">{submission.language}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-emerald-600 font-mono text-sm font-bold flex items-center gap-1"><Play size={12} className="text-emerald-400"/> {submission.executionTime}</span>
                                                <span className="text-slate-500 font-mono text-xs">{submission.memoryUsed}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-slate-400 text-xs font-semibold bg-slate-50 px-2.5 py-1 rounded-md">{submission.submittedAt}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => onSelectSubmission(submission)}
                                                className="inline-flex items-center gap-2 text-amber-600 hover:text-white bg-white hover:bg-amber-500 border border-amber-200 hover:border-amber-500 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-500/20 group-hover:-translate-y-0.5"
                                            >
                                                <Eye size={14} />
                                                Hack Logic
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}