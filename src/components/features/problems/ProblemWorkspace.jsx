import React, { useState, useEffect } from 'react';
import { 
    Play, Check, X, Users, Eye, ArrowLeft, Terminal, FileCode2, Zap, 
    Settings, Maximize2, RotateCcw, ThumbsUp, ThumbsDown, Bookmark, 
    Share2, Search, Filter, Send, Lightbulb, Target, Clock, Cpu, Trophy
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

    const getAccuracyBadge = (accuracy) => {
        if (accuracy >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (accuracy >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
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
                    <span className="font-semibold text-sm">Back to Arena</span>
                </button>

                <div className="bg-slate-200/50 p-1 rounded-lg inline-flex w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('problem')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'problem'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <FileCode2 size={16} /> Workspace
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                            activeTab === 'submissions'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Users size={16} /> Submissions 
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs ml-1 border border-slate-200">
                            {submissionList.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            {activeTab === 'problem' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    
                    {/* Left Panel: Problem Description */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[85vh]">
                        <div className="p-5 border-b border-slate-100 shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {problem.problemName || problemData.title}
                                </h2>
                                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                    <Bookmark size={20} />
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium mb-4">
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${getAccuracyBadge(problem?.accuracy || 0)}`}>
                                    <Target size={14} /> Accuracy: {problem?.accuracy || 0}%
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                    <Clock size={14} /> {problemData.timeLimit}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                    <Cpu size={14} /> {problemData.memoryLimit}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">Data Structures</span>
                                <span className="bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">Algorithms</span>
                            </div>
                        </div>

                        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            <section>
                                <p className="text-slate-700 leading-relaxed text-sm">{problem.description}</p>
                            </section>

                            <section className="grid grid-cols-1 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input Format</h3>
                                    <p className="text-slate-800 text-sm whitespace-pre-line font-mono">{problem.inputFormat}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Output Format</h3>
                                    <p className="text-slate-800 text-sm font-mono">{problem.outputFormat}</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Lightbulb className="text-amber-500" size={16} /> Examples
                                </h3>
                                {problem.examples.map((example, idx) => (
                                    <div key={idx} className="mb-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-600">Example {idx + 1}</span>
                                            <button className="text-slate-400 hover:text-slate-700 text-xs font-medium transition-colors">Copy</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                                            <div className="p-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Input</span>
                                                <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{example.input}</pre>
                                            </div>
                                            <div className="p-4 bg-slate-50/50">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Output</span>
                                                <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{example.output}</pre>
                                            </div>
                                        </div>
                                        {example.explanation && (
                                            <div className="p-4 border-t border-slate-200 bg-white">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Explanation</span>
                                                <p className="text-slate-600 text-sm">{example.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        </div>

                        <div className="p-3 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded transition-colors text-sm font-medium">
                                    <ThumbsUp size={16} /> 124
                                </button>
                                <button className="flex items-center gap-1.5 p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded transition-colors text-sm font-medium">
                                    <ThumbsDown size={16} /> 12
                                </button>
                            </div>
                            <button className="flex items-center gap-2 p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded transition-colors text-sm font-medium">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Code Editor (Dark Mode) */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[85vh]">
                        
                        {/* Editor Header */}
                        <div className="p-2 border-b border-slate-800 bg-slate-900 shrink-0 flex justify-between items-center">
                            <div className="flex items-center gap-2 pl-2">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-slate-800 border-none text-slate-200 text-sm font-medium rounded px-3 py-1.5 focus:ring-1 focus:ring-slate-600 outline-none transition-all cursor-pointer"
                                >
                                    <option value="CPP">C++</option>
                                    <option value="PYTHON">Python 3</option>
                                    <option value="JAVA">Java</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-1 pr-2">
                                <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                    <RotateCcw size={16} />
                                </button>
                                <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                    <Settings size={16} />
                                </button>
                                <button className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Textarea Editor Area */}
                        <div className="flex-1 flex bg-[#0d1117] overflow-hidden relative">
                            {/* Dark mode line numbers */}
                            <div className="w-12 bg-[#0d1117] border-r border-slate-800 flex flex-col items-end py-4 pr-3 text-xs font-mono text-slate-600 select-none hidden sm:flex">
                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                            </div>
                            
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Write your solution here..."
                                className="w-full h-full bg-transparent p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none custom-scrollbar placeholder:text-slate-600 leading-relaxed"
                                spellCheck="false"
                            />
                        </div>

                        {/* Editor Footer Status */}
                        <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800 shrink-0 flex justify-between items-center text-[11px] font-mono text-slate-500">
                            <div className="flex gap-4">
                                <span>UTF-8</span>
                                <span>Spaces: 4</span>
                            </div>
                            <span>Ln 1, Col 1</span>
                        </div>

                        {/* Action Bar */}
                        <div className="p-3 border-t border-slate-800 bg-[#0d1117] shrink-0 flex justify-between items-center">
                            <button className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors">
                                <Terminal size={16} /> Console
                            </button>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50 px-4 py-2 rounded text-sm font-semibold transition-colors"
                                >
                                    {isRunning ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <Play size={16} />}
                                    Run
                                </button>
                                <button
                                    disabled={isRunning}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 px-5 py-2 rounded text-sm font-semibold transition-colors shadow-sm"
                                >
                                    <Send size={16} />
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* Console / Test Results */}
                        {testResults.length > 0 && (
                            <div className="border-t border-slate-800 bg-[#0d1117] max-h-[30%] overflow-y-auto custom-scrollbar">
                                <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-900">
                                    {verdict === "Accepted" || verdict === "All Testcase Passed" ? (
                                        <Check size={16} className="text-emerald-500" />
                                    ) : (
                                        <X size={16} className="text-rose-500" />
                                    )}
                                    <h4 className={`font-semibold text-sm ${verdict === "Accepted" || verdict === "All Testcase Passed" ? "text-emerald-500" : "text-rose-500"}`}>
                                        {verdict}
                                    </h4>
                                </div>
                                <div className="p-3 space-y-2">
                                    {testResults.map((result) => (
                                        <div key={result.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                {result.passed ? (
                                                    <span className="text-emerald-400 font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded">Pass</span>
                                                ) : (
                                                    <span className="text-rose-400 font-medium text-xs bg-rose-500/10 px-2 py-0.5 rounded">Fail</span>
                                                )}
                                                <span className="text-sm font-medium text-slate-200">{result.id}</span>
                                            </div>
                                            <div className="text-xs font-mono text-slate-400 flex gap-4">
                                                <span className="flex items-center gap-1"><Clock size={12}/> {result.time}</span>
                                                <span className="flex items-center gap-1"><Cpu size={12}/> {result.memory}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Submissions Hacker Board */}
            {activeTab === 'submissions' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="text-amber-500" size={20} />
                                <h3 className="text-lg font-bold text-slate-900">Hacker Board</h3>
                            </div>
                            <p className="text-sm text-slate-500">
                                Review successful submissions and challenge them with edge cases.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search Thinkers..." 
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 transition-colors"
                                />
                            </div>
                            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thinkers</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissionList.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                                                    {submission.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-900 text-sm">{submission.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{submission.language}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-emerald-600 font-mono text-sm flex items-center gap-1">
                                                    <Clock size={12}/> {submission.executionTime}
                                                </span>
                                                <span className="text-slate-500 font-mono text-xs flex items-center gap-1">
                                                    <Cpu size={12}/> {submission.memoryUsed}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {submission.submittedAt}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onSelectSubmission(submission)}
                                                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md font-medium text-xs transition-colors"
                                            >
                                                <Eye size={14} /> View Code
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