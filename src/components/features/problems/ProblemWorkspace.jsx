import React, {
    useState, useEffect, useCallback, useRef, memo, useMemo
} from 'react';
import {
    Play, Check, X, Users, Eye, ArrowLeft, Terminal, FileCode2,
    Settings, Maximize2, RotateCcw, ThumbsUp, ThumbsDown, Bookmark,
    Share2, Search, Filter, Send, Lightbulb, Target, Clock, Cpu, Trophy,
    ChevronUp, ChevronDown, Loader2
} from 'lucide-react';
import { problemData } from '../../../data/mockData';
import { API_BASE_URL } from '../../../config';
import Editor from '@monaco-editor/react';

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS  (module-level → never recreated)
───────────────────────────────────────────────────────────────── */
const LANG_CONFIG = {
    CPP:    { label: 'C++',      monaco: 'cpp'    },
    PYTHON: { label: 'Python 3', monaco: 'python' },
    JAVA:   { label: 'Java',     monaco: 'java'   },
};

const DEFAULT_CODE = {
    CPP:    '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}\n',
    PYTHON: '# your code goes here\n',
    JAVA:   'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // your code goes here\n    }\n}\n',
};

// Frozen so Monaco never sees a new object reference → no re-mount
const EDITOR_OPTIONS = Object.freeze({
    fontSize: 13.5,
    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
    fontLigatures: false,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 14, bottom: 14 },
    tabSize: 4,
    automaticLayout: true,
    bracketPairColorization: { enabled: true },
    cursorBlinking: 'solid',
    cursorSmoothCaretAnimation: 'off',
    scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
    lineNumbers: 'on',
    glyphMargin: false,
    folding: false,
    renderLineHighlight: 'none',
    renderWhitespace: 'none',
    occurrencesHighlight: 'off',
    selectionHighlight: false,
    codeLens: false,
    links: false,
    quickSuggestions: false,   // disables inline AI-style popup on every keystroke
    parameterHints: { enabled: false },
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: 'off',
    wordBasedSuggestions: 'off',
});

const isSuccess = (v) => v === 'Accepted' || v === 'All Testcase Passed';

const accuracyClass = (acc) => {
    if (acc >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (acc >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
};

const getCurrentUserId = () => {
    try { return JSON.parse(localStorage.getItem('user'))?.id ?? null; }
    catch { return null; }
};

/* ─────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   Each is memo-wrapped and only re-renders when its own props change.
───────────────────────────────────────────────────────────────── */

/* ── Problem description panel ── */
const ProblemPanel = memo(({ problem, onUseAsInput }) => (
    <section className="flex flex-col bg-white border-b lg:border-b-0 lg:border lg:border-slate-200 lg:rounded-xl lg:shadow-sm overflow-hidden">

        {/* header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-slate-900 leading-snug pr-4">
                    {problem.problemName || problemData.title}
                </h2>
                <button className="text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                    <Bookmark size={18} />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-semibold ${accuracyClass(problem?.accuracy ?? 0)}`}>
                    <Target size={12} /> {problem?.accuracy ?? 0}% Accuracy
                </span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                    <Clock size={12} /> {problemData.timeLimit}
                </span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                    <Cpu size={12} /> {problemData.memoryLimit}
                </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {['Data Structures', 'Algorithms'].map(tag => (
                    <span key={tag} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 min-h-0">
            <p className="text-slate-700 leading-relaxed text-sm">{problem.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[['Input Format', problem.inputFormat], ['Output Format', problem.outputFormat]].map(([lbl, val]) => (
                    <div key={lbl} className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{lbl}</h3>
                        <p className="text-slate-800 text-sm font-mono whitespace-pre-line leading-relaxed">{val}</p>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="text-amber-400" size={15} /> Examples
                </h3>
                <div className="space-y-4">
                    {problem.examples.map((ex, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Example {i + 1}</span>
                                <button
                                    onClick={() => onUseAsInput(ex.input)}
                                    className="text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors"
                                >
                                    Use as Input ↗
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                                {[['Input', ex.input], ['Output', ex.output]].map(([l, v]) => (
                                    <div key={l} className="p-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{l}</span>
                                        <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap">{v}</pre>
                                    </div>
                                ))}
                            </div>
                            {ex.explanation && (
                                <div className="px-4 pb-4 pt-3 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Explanation</span>
                                    <p className="text-slate-600 text-sm leading-relaxed">{ex.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* footer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded transition-colors text-sm font-medium">
                    <ThumbsUp size={15} /> 124
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded transition-colors text-sm font-medium">
                    <ThumbsDown size={15} /> 12
                </button>
            </div>
            <button className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded transition-colors text-sm font-medium">
                <Share2 size={15} /> Share
            </button>
        </div>
    </section>
));

/* ── Editor toolbar ── */
const EditorToolbar = memo(({ language, onLanguageChange, onReset }) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900 shrink-0 gap-3">
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/70 shrink-0" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70 shrink-0" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70 shrink-0" />
            <div className="ml-2 flex items-center bg-slate-800 rounded-md p-0.5 gap-0.5">
                {Object.entries(LANG_CONFIG).map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => onLanguageChange(key)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-150 ${
                            language === key
                                ? 'bg-slate-600 text-slate-100 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-0.5">
            <button title="Reset" onClick={onReset} className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all">
                <RotateCcw size={14} />
            </button>
            <button title="Settings" className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all">
                <Settings size={14} />
            </button>
            <button title="Fullscreen" className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all">
                <Maximize2 size={14} />
            </button>
        </div>
    </div>
));

/* ── Console panel — has its own local state for input text ── */
const ConsolePanel = memo(({
    consoleOpen, setConsoleOpen,
    consoleTab, setConsoleTab,
    customInput, setCustomInput,
    runOutput, submitResult,
    isRunning, isSubmitting,
    onRun, onSubmit,
}) => {
    const isBusy = isRunning || isSubmitting;

    return (
        <div className="shrink-0 border-t border-slate-800 bg-[#0d1117] flex flex-col">

            {/* bar — always visible */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-0.5">
                    {[
                        { key: 'input',  label: 'Custom Input' },
                        { key: 'output', label: 'Output'       },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => { setConsoleTab(key); setConsoleOpen(true); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                consoleTab === key && consoleOpen
                                    ? 'bg-slate-700 text-slate-100'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {key === 'input' && <Terminal size={11} />}
                            {label}
                            {key === 'output' && submitResult && (
                                <span className={`w-1.5 h-1.5 rounded-full ${isSuccess(submitResult.verdict) ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onRun}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 disabled:opacity-40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                        {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                        Run
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-emerald-900/40"
                    >
                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        Submit
                    </button>
                    <button
                        onClick={() => setConsoleOpen(o => !o)}
                        className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                        {consoleOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                </div>
            </div>

            {/* body */}
            {consoleOpen && (
                <div className="h-40">
                    {consoleTab === 'input' && (
                        <textarea
                            value={customInput}
                            onChange={e => setCustomInput(e.target.value)}
                            spellCheck={false}
                            placeholder="Enter custom input here…"
                            className="w-full h-full resize-none bg-transparent text-slate-300 font-mono text-xs p-3 outline-none placeholder:text-slate-600 leading-relaxed"
                        />
                    )}
                    {consoleTab === 'output' && (
                        <div className="h-full overflow-y-auto p-3 font-mono text-xs space-y-3">
                            {submitResult && (
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                                    isSuccess(submitResult.verdict)
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                }`}>
                                    {isSuccess(submitResult.verdict) ? <Check size={13} /> : <X size={13} />}
                                    <span className="font-bold">{submitResult.verdict}</span>
                                    {submitResult.executionTime && submitResult.executionTime !== '-' && (
                                        <span className="ml-auto flex items-center gap-3 text-[10px] text-slate-500">
                                            <span className="flex items-center gap-1"><Clock size={10} /> {submitResult.executionTime}</span>
                                            <span className="flex items-center gap-1"><Cpu   size={10} /> {submitResult.memoryUsed}</span>
                                        </span>
                                    )}
                                </div>
                            )}
                            {(isRunning || isSubmitting) && (
                                <p className="text-slate-500 flex items-center gap-2">
                                    <Loader2 size={12} className="animate-spin" />
                                    {isSubmitting ? 'Judging against all test cases…' : 'Running…'}
                                </p>
                            )}
                            {!isRunning && !isSubmitting && runOutput && (
                                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{runOutput}</pre>
                            )}
                            {!isRunning && !isSubmitting && !runOutput && !submitResult && (
                                <p className="text-slate-600">
                                    Press <span className="text-slate-400 font-bold">Run</span> to test with custom input,
                                    or <span className="text-slate-400 font-bold">Submit</span> to judge against all test cases.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

/* ── Submissions table ── */
const SubmissionsPanel = memo(({ submissionList, onSelectSubmission }) => (
    <main className="flex-1 p-4 md:p-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Trophy className="text-amber-400" size={18} />
                        <h3 className="text-base font-bold text-slate-900">Hacker Board</h3>
                    </div>
                    <p className="text-xs text-slate-500">Review successful submissions and challenge them with edge cases.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search thinkers…"
                            className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 transition-colors"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {['Thinker', 'Language', 'Performance', 'Submitted', ''].map(h => (
                                <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {submissionList.map(sub => (
                            <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {sub.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-slate-800">{sub.username}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="font-mono text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded">{sub.language}</span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-emerald-600 font-mono text-xs flex items-center gap-1"><Clock size={11} /> {sub.executionTime}</span>
                                        <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1"><Cpu size={11} /> {sub.memoryUsed}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{sub.submittedAt}</td>
                                <td className="px-5 py-3.5 text-right">
                                    <button
                                        onClick={() => onSelectSubmission(sub)}
                                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                                    >
                                        <Eye size={13} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {submissionList.length === 0 && (
                    <div className="py-16 text-center text-slate-400 text-sm">No successful submissions yet.</div>
                )}
            </div>
        </div>
    </main>
));

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   Owns only the state that actually needs to be shared.
   Editor state (code) is kept here but onChange is stable via useCallback.
───────────────────────────────────────────────────────────────── */
export default function ProblemWorkspace({
    problem, onBack, onSelectSubmission, isLoggedIn, onShowAuth
}) {
    /* ── navigation ── */
    const [activeTab, setActiveTab] = useState('problem');

    /* ── editor ── */
    const [language, setLanguage]   = useState('CPP');
    const codeRef                   = useRef(DEFAULT_CODE.CPP); // avoid re-renders on every keystroke
    const [code, setCode]           = useState(DEFAULT_CODE.CPP);

    /* ── run / submit ── */
    const [isRunning, setIsRunning]       = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [runOutput, setRunOutput]       = useState('');
    const [submitResult, setSubmitResult] = useState(null);

    /* ── console ── */
    const [consoleOpen, setConsoleOpen] = useState(true);
    const [consoleTab, setConsoleTab]   = useState('input');
    const [customInput, setCustomInput] = useState('');

    /* ── submissions list ── */
    const [submissionList, setSubmissionsList] = useState([]);

    /* pre-fill custom input */
    useEffect(() => {
        if (problem?.examples?.length > 0) {
            setCustomInput(problem.examples[0].input ?? '');
        }
    }, [problem]);

    /* fetch submissions */
    useEffect(() => {
        if (activeTab !== 'submissions' || !isLoggedIn) return;
        fetch(`${API_BASE_URL}/api/submissions/problem/${problem.id}/successful`, { credentials: 'include' })
            .then(r => r.json())
            .then(setSubmissionsList)
            .catch(err => console.error('Error fetching submissions:', err));
    }, [activeTab, problem.id, isLoggedIn]);

    /* ── stable callbacks ── */
    const handleCodeChange = useCallback((val) => {
        codeRef.current = val ?? '';
        setCode(val ?? '');          // needed so submit/run picks up latest value
    }, []);

    const handleLanguageChange = useCallback((lang) => {
        setLanguage(lang);
        const fresh = DEFAULT_CODE[lang];
        codeRef.current = fresh;
        setCode(fresh);
        setRunOutput('');
        setSubmitResult(null);
    }, []);

    const handleReset = useCallback(() => {
        const fresh = DEFAULT_CODE[language];
        codeRef.current = fresh;
        setCode(fresh);
    }, [language]);

    const handleUseAsInput = useCallback((input) => {
        setCustomInput(input);
        setConsoleOpen(true);
        setConsoleTab('input');
    }, []);

    const handleRun = useCallback(async () => {
        if (!isLoggedIn) { onShowAuth(); return; }
        setIsRunning(true);
        setRunOutput('');
        setSubmitResult(null);
        setConsoleTab('output');
        setConsoleOpen(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: getCurrentUserId(),
                    problemId: problem.id,
                    language,
                    code: codeRef.current,
                    customInput,
                }),
            });
            if (!res.ok) throw new Error();
            setRunOutput(await res.text());
        } catch {
            setRunOutput('⚠  System Error — could not reach the server.');
        } finally {
            setIsRunning(false);
        }
    }, [isLoggedIn, onShowAuth, problem.id, language, customInput]);

    const handleSubmit = useCallback(async () => {
        if (!isLoggedIn) { onShowAuth(); return; }
        setIsSubmitting(true);
        setSubmitResult(null);
        setRunOutput('');
        setConsoleTab('output');
        setConsoleOpen(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    userId: getCurrentUserId(),
                    problemId: problem.id,
                    language,
                    code: codeRef.current,
                }),
            });
            if (!res.ok) throw new Error();
            const verdict = await res.text();
            setSubmitResult({ verdict });
        } catch {
            setSubmitResult({ verdict: 'System Error' });
        } finally {
            setIsSubmitting(false);
        }
    }, [isLoggedIn, onShowAuth, problem.id, language]);

    /* ── render ── */
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* sticky header */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm px-4 py-2 flex flex-wrap items-center justify-between gap-3">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Arena
                </button>

                <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                    {[
                        { key: 'problem',     Icon: FileCode2, label: 'Workspace'   },
                        { key: 'submissions', Icon: Users,     label: 'Submissions' },
                    ].map(({ key, Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-150 ${
                                activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Icon size={15} />
                            {label}
                            {key === 'submissions' && (
                                <span className="ml-1 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {submissionList.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* workspace */}
            {activeTab === 'problem' && (
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-0 lg:p-4">

                    <ProblemPanel
                        problem={problem}
                        onUseAsInput={handleUseAsInput}
                    />

                    {/* right: editor + console */}
                    <section className="flex flex-col bg-slate-900 lg:rounded-xl lg:border lg:border-slate-800 lg:shadow-xl overflow-hidden min-h-[60vh] lg:min-h-0">

                        <EditorToolbar
                            language={language}
                            onLanguageChange={handleLanguageChange}
                            onReset={handleReset}
                        />

                        <div className="flex-1 min-h-0 overflow-hidden bg-[#1e1e1e]">
                            <Editor
                                height="100%"
                                language={LANG_CONFIG[language].monaco}
                                value={code}
                                onChange={handleCodeChange}
                                theme="vs-dark"
                                options={EDITOR_OPTIONS}
                            />
                        </div>

                        <div className="px-4 py-1 bg-slate-950 border-t border-slate-800 shrink-0 flex justify-between font-mono text-[10px] text-slate-600">
                            <div className="flex gap-4"><span>UTF-8</span><span>Spaces: 4</span></div>
                            <span>{LANG_CONFIG[language].label}</span>
                        </div>

                        <ConsolePanel
                            consoleOpen={consoleOpen}
                            setConsoleOpen={setConsoleOpen}
                            consoleTab={consoleTab}
                            setConsoleTab={setConsoleTab}
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                            runOutput={runOutput}
                            submitResult={submitResult}
                            isRunning={isRunning}
                            isSubmitting={isSubmitting}
                            onRun={handleRun}
                            onSubmit={handleSubmit}
                        />
                    </section>
                </main>
            )}

            {activeTab === 'submissions' && (
                <SubmissionsPanel
                    submissionList={submissionList}
                    onSelectSubmission={onSelectSubmission}
                />
            )}
        </div>
    );
}