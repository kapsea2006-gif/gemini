"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, User, GraduationCap, Building2, ShieldCheck, KeyRound } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "company" | "admin">("student");
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (authModalMode === "login") {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          role,
        });
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const fillQuickCredential = (roleType: "student" | "company" | "admin") => {
    if (roleType === "student") {
      setEmail("alex.rivera@university.edu");
      setPassword("StudentPass123!");
    } else if (roleType === "company") {
      setEmail("contact@novatech.ai");
      setPassword("CompanyPass123!");
    } else if (roleType === "admin") {
      setEmail("admin@academia-portal.edu");
      setPassword("AdminPass123!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            {authModalMode === "login" ? "Sign In to NexusCollab" : "Create Your Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === "login"
              ? "Access your dashboard, match recommendations, and postings"
              : "Join the academia-industry network to collaborate"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Organization Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera or Apex Robotics"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full glass-input pl-9 pr-3 py-2 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      role === "student"
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("company")}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      role === "company"
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Company</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      role === "admin"
                        ? "bg-purple-600/30 border-purple-500 text-purple-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 text-sm rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 text-sm rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 mt-2"
          >
            {loading ? "Processing..." : authModalMode === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        {/* Quick Demo Pre-fill for evaluator */}
        {authModalMode === "login" && (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>Quick Fill Test Credentials:</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fillQuickCredential("student")}
                className="flex-1 py-1 px-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredential("company")}
                className="flex-1 py-1 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium"
              >
                Company
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredential("admin")}
                className="flex-1 py-1 px-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 text-purple-300 text-[11px] font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {authModalMode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthModalMode("register")}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Create one now
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthModalMode("login")}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
