"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StudentDashboard } from "@/components/StudentDashboard";
import { CompanyDashboard } from "@/components/CompanyDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AuthModal } from "@/components/AuthModal";
import {
  Sparkles,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  Cpu,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function Home() {
  const { user, role, loading, quickDemoLogin, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("recommendations");

  // Sync activeTab default when role changes
  useEffect(() => {
    if (role === "student") {
      setActiveTab("recommendations");
    } else if (role === "company") {
      setActiveTab("postings");
    } else if (role === "admin") {
      setActiveTab("analytics");
    }
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Initializing NexusCollab Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          /* Role Dashboard views */
          <>
            {role === "student" && <StudentDashboard activeTab={activeTab} />}
            {role === "company" && <CompanyDashboard activeTab={activeTab} />}
            {role === "admin" && <AdminDashboard activeTab={activeTab} />}
          </>
        ) : (
          /* Hero Landing for Unauthenticated Visitors */
          <div className="space-y-16 py-6">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Academia–Industry Placement Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
                Where Academic Talent Meets{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
                  Industry Innovation
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Connect university students with cutting-edge internships using an explainable AI Skill Compatibility Score. Bridge curriculum gaps, streamline corporate recruiting, and drive placement success.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => quickDemoLogin("student")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
                >
                  <GraduationCap className="w-4 h-4" />
                  Try as Student (Alex)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => quickDemoLogin("company")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30"
                >
                  <Building2 className="w-4 h-4" />
                  Try as Company (NovaTech)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => quickDemoLogin("admin")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Try as Admin (Dean)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Three Roles Feature Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role 1: Students */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-indigo-500/40">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">For Students</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Build rich profiles with coursework, verified technical skills, certifications, and research interests. Discover internships with transparent AI compatibility scores and actionable skill gap recommendations.
                </p>
                <ul className="text-xs text-slate-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real-time AI skill compatibility scores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Matched vs missing skill breakdown</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>One-click application tracker</span>
                  </li>
                </ul>
                <button
                  onClick={() => quickDemoLogin("student")}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 transition-all"
                >
                  Log in as Student Demo →
                </button>
              </div>

              {/* Role 2: Companies */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-emerald-500/40">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">For Companies</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Post internships with mandatory and preferred skill requirements. Our AI matching module ranks incoming applicants by qualification fit, saving hundreds of screening hours.
                </p>
                <ul className="text-xs text-slate-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Rank candidates by qualification fit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Institutional partner verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Full pipeline status management</span>
                  </li>
                </ul>
                <button
                  onClick={() => quickDemoLogin("company")}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 transition-all"
                >
                  Log in as Company Demo →
                </button>
              </div>

              {/* Role 3: Academic Admins */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-purple-500/40">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">For Academic Admins</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Oversee industry partnerships, verify employer accounts, track placement metrics, and inspect the Skill Demand vs Supply Matrix to align curricula with industry trends.
                </p>
                <ul className="text-xs text-slate-300 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Industry vs student skill gap matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>One-click company verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pluggable AI matching settings</span>
                  </li>
                </ul>
                <button
                  onClick={() => quickDemoLogin("admin")}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 transition-all"
                >
                  Log in as Admin Demo →
                </button>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="max-w-2xl mb-6">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Cpu className="w-4 h-4" />
                  Engineering Highlights
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  Extensible AI Architecture & Full-Stack Foundation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-indigo-300 block">Pluggable Matching Strategy</span>
                  <p className="text-slate-400 leading-relaxed">
                    Designed around the Adapter pattern. Swap between Weighted Rule Engines, Semantic Vector Similarity, or LLM Embeddings.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-300 block">FastAPI & PostgreSQL Backend</span>
                  <p className="text-slate-400 leading-relaxed">
                    High-performance async Python backend with SQLAlchemy ORM, JWT authentication, and RBAC security.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-purple-300 block">Next.js & Tailwind CSS UI</span>
                  <p className="text-slate-400 leading-relaxed">
                    Modern dark-mode interface with glassmorphism design, real-time match breakdown modals, and responsive views.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">NexusCollab</span>
            <span>— Academia–Industry Collaboration Portal</span>
          </div>
          <div>React/Next.js • FastAPI • PostgreSQL • Extensible AI Match Engine</div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}
