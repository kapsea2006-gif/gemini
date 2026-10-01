"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, GraduationCap, Building2, ShieldAlert } from "lucide-react";

export const RoleDemoBanner: React.FC = () => {
  const { user, quickDemoLogin, loading } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-purple-950/90 border-b border-indigo-500/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Evaluator Switcher:</span>
          <span className="hidden sm:inline text-slate-400">
            Switch instant roles with live AI skill matching:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => quickDemoLogin("student")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              user?.role === "student"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/50 ring-1 ring-indigo-400"
                : "bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
            <span>Student (Alex)</span>
          </button>

          <button
            onClick={() => quickDemoLogin("company")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              user?.role === "company"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/50 ring-1 ring-emerald-400"
                : "bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Company (NovaTech)</span>
          </button>

          <button
            onClick={() => quickDemoLogin("admin")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
              user?.role === "admin"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-500/50 ring-1 ring-purple-400"
                : "bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin (Dean)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
