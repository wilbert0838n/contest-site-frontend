import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Timer, CheckCircle2, AlertCircle } from 'lucide-react';
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

  // Helper to style the Top 3 ranks beautifully
  const getRankStyling = (rank) => {
    switch (rank) {
      case 1:
        return {
          rowClass: "bg-gradient-to-r from-amber-50/50 to-transparent border-l-4 border-amber-400",
          badgeClass: "bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-white",
          icon: <Trophy size={14} className="text-white" />
        };
      case 2:
        return {
          rowClass: "bg-gradient-to-r from-slate-50/80 to-transparent border-l-4 border-slate-300",
          badgeClass: "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md ring-2 ring-white",
          icon: <Medal size={14} className="text-white" />
        };
      case 3:
        return {
          rowClass: "bg-gradient-to-r from-orange-50/50 to-transparent border-l-4 border-orange-300",
          badgeClass: "bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-md ring-2 ring-white",
          icon: <Award size={14} className="text-white" />
        };
      default:
        return {
          rowClass: "hover:bg-slate-50/50 border-l-4 border-transparent",
          badgeClass: "bg-slate-100 text-slate-500 font-bold",
          icon: null
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Syncing Ranks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-rose-50/50 border border-rose-200 rounded-3xl flex items-center justify-center text-rose-500 gap-3 shadow-sm">
        <AlertCircle size={20} />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-24">Rank</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Hacker</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Rating / Score</th>
              <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 bg-white/40">
            {leaderboardData.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-medium">
                  No hackers have placed on the board yet.
                </td>
              </tr>
            ) : (
              leaderboardData.map((user) => {
                const style = getRankStyling(user.rank);
                return (
                  <tr key={user.rank} className={`transition-all duration-300 group ${style.rowClass}`}>
                    
                    {/* Rank Column */}
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mx-auto transition-transform duration-300 group-hover:scale-110 ${style.badgeClass}`}>
                        {style.icon || user.rank}
                      </div>
                    </td>

                    {/* Hacker Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100/50 flex items-center justify-center shadow-inner">
                          <span className="text-blue-700 font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* Score Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        <Flame size={14} className="text-blue-500" />
                        <span className="font-black text-blue-700 text-sm">{user.score}</span>
                      </div>
                    </td>

                    {/* Performance Stats (Solved / Penalty) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-1 text-slate-500 font-medium text-xs bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span>{user.problemsSolved} solved</span>
                        </div>
                        {/* Only show penalty time if it's a contest leaderboard (penalty > 0) */}
                        {user.penaltyTime !== undefined && contestId && (
                          <div className="flex items-center gap-1 text-slate-400 font-medium text-xs bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                            <Timer size={12} />
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