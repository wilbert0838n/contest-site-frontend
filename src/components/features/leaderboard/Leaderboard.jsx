import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Timer, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import { API_BASE_URL } from '../../../config';

export default function Leaderboard({ contestId }) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Dynamically build the URL based on whether we are viewing a specific contest or the global board
        const url = contestId 
            ? `${API_BASE_URL}/api/leaderboard?contestId=${contestId}` 
            : `${API_BASE_URL}/api/leaderboard`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                return res.json();
            })
            .then(data => {
                setLeaderboardData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load leaderboard data.");
                setLoading(false);
            });
    }, [contestId]);

    // Helper to style the Top 3 ranks beautifully but professionally
    const getRankStyling = (rank) => {
        switch (rank) {
            case 1:
                return {
                    rowClass: "bg-amber-50/50 hover:bg-amber-50 transition-colors",
                    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
                    icon: <Trophy size={14} className="text-amber-600" />
                };
            case 2:
                return {
                    rowClass: "bg-slate-50/80 hover:bg-slate-100/80 transition-colors",
                    badgeClass: "bg-slate-200 text-slate-700 border border-slate-300",
                    icon: <Medal size={14} className="text-slate-600" />
                };
            case 3:
                return {
                    rowClass: "bg-orange-50/30 hover:bg-orange-50/60 transition-colors",
                    badgeClass: "bg-orange-100 text-orange-700 border border-orange-200",
                    icon: <Award size={14} className="text-orange-600" />
                };
            default:
                return {
                    rowClass: "hover:bg-slate-50 transition-colors",
                    badgeClass: "bg-slate-100 text-slate-500 border border-slate-200",
                    icon: null
                };
        }
    };

    if (loading) {
        return (
            <div className="w-full h-64 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-slate-500 animate-pulse">Syncing Standings...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center text-rose-600 gap-2 shadow-sm">
                <AlertCircle size={18} />
                <span className="font-medium text-sm">{error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Section */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-blue-500" size={20} />
                    <h3 className="text-lg font-bold text-slate-900">
                        {contestId ? 'Contest Standings' : 'Global Leaderboard'}
                    </h3>
                </div>
                
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24 text-center">Rank</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thinkers</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Score/Rating</th>
                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {leaderboardData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                    No developers have placed on the board yet.
                                </td>
                            </tr>
                        ) : (
                            leaderboardData.map((user) => {
                                const style = getRankStyling(user.rank);
                                return (
                                    <tr key={user.rank} className={style.rowClass}>
                                        
                                        {/* Rank Column */}
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mx-auto ${style.badgeClass}`}>
                                                {style.icon || user.rank}
                                            </div>
                                        </td>

                                        {/* Hacker Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    <span className="text-slate-600 font-bold text-xs">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-slate-900 text-sm">
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Score Column */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                                <Flame size={14} className="text-slate-400" />
                                                <span className="font-bold text-slate-700 text-sm">{user.score}</span>
                                            </div>
                                        </td>

                                        {/* Performance Stats (Solved / Penalty) */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    <span>{user.problemsSolved} <span className="hidden sm:inline">solved</span></span>
                                                </div>
                                                
                                                {/* Only show penalty time if it's a contest leaderboard (penalty > 0) */}
                                                {user.penaltyTime !== undefined && contestId && (
                                                    <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                                        <Timer size={14} className="text-slate-400" />
                                                        <span>{user.penaltyTime}m</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}