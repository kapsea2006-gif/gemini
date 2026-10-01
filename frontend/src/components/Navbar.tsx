"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Compass,
  FileCheck2,
  Sparkles,
  BarChart3,
  Layers
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, role, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case "student":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            Student
          </span>
        );
      case "company":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            Company
          </span>
        );
      case "admin":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NexusCollab
              </span>
              <span className="hidden md:inline-block text-[10px] tracking-wider uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                AI Match Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Academia–Industry Collaboration & Placement Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs based on Role */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {role === "student" && (
              <>
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "recommendations"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Matches
                </button>
                <button
                  onClick={() => setActiveTab("explore")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "explore"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Browse Internships
                </button>
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "applications"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  My Applications
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "profile"
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  My Profile & Skills
                </button>
              </>
            )}

            {role === "company" && (
              <>
                <button
                  onClick={() => setActiveTab("postings")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "postings"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Postings & Applicants
                </button>
                <button
                  onClick={() => setActiveTab("new-posting")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "new-posting"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  + Post Internship
                </button>
                <button
                  onClick={() => setActiveTab("company-profile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "company-profile"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Company Profile
                </button>
              </>
            )}

            {role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "analytics"
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Portal Analytics
                </button>
                <button
                  onClick={() => setActiveTab("verification")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "verification"
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Company Verification
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "users"
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab("matching-engine")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "matching-engine"
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Matching Config
                </button>
              </>
            )}
          </nav>
        )}

        {/* User / Auth State */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-medium text-slate-200 flex items-center justify-end gap-1.5">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                {getRoleBadge()}
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode("login");
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode("register");
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
