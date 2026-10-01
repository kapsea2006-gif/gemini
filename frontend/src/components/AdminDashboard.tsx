"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  ShieldCheck,
  Users,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  FileCheck2,
  TrendingUp,
  Cpu,
  Check,
  X,
  ExternalLink,
  Sliders,
  AlertTriangle,
  Info
} from "lucide-react";

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();

  // Stats state
  const [stats, setStats] = useState<any | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Companies state
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState<string>("");

  // Matching Engine Config state
  const [matchingConfig, setMatchingConfig] = useState<any | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const data = await api.listCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.listUsers(userRoleFilter || undefined);
      setUsersList(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMatchingConfig = async () => {
    try {
      const data = await api.getMatchingConfig();
      setMatchingConfig(data);
    } catch (err) {
      console.error("Error fetching matching config:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchStats();
    } else if (activeTab === "verification") {
      fetchCompanies();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "matching-engine") {
      fetchMatchingConfig();
    }
  }, [activeTab, userRoleFilter]);

  const handleToggleVerification = async (companyId: number, currentStatus: boolean) => {
    try {
      await api.verifyCompany(companyId, !currentStatus);
      fetchCompanies();
      fetchStats();
    } catch (err: any) {
      alert(err.message || "Failed to update verification");
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await api.toggleUserStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to toggle user status");
    }
  };

  return (
    <div className="space-y-6">
      {/* TAB 1: PORTAL ANALYTICS & SKILL GAP MATRIX */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Institutional Analytics & Placement Metrics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live collaboration indicators across students, partner industry sponsors, and placement compatibility.
            </p>
          </div>

          {loadingStats || !stats ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading analytics and compute matrix...
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
                    <GraduationCap className="w-4 h-4" />
                    Students
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    {stats.total_students}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Active profiles</div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <Building2 className="w-4 h-4" />
                    Companies
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    {stats.total_companies}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    {stats.verified_companies} Verified
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
                    <Briefcase className="w-4 h-4" />
                    Internships
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    {stats.total_internships}
                  </div>
                  <div className="text-[10px] text-purple-400 mt-0.5">
                    {stats.active_internships} Open
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <FileCheck2 className="w-4 h-4" />
                    Applications
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    {stats.total_applications}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">In pipeline</div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    Avg Match Score
                  </div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                    {stats.average_match_score}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Across applications</div>
                </div>
              </div>

              {/* Skill Demand vs Supply Matrix */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      Industry Demand vs Academic Supply Skill Matrix
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Visual comparison between requirements posted by employers and skills present in student candidate profiles.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Industry Demand
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Student Supply
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {(stats.skill_gap_matrix || []).map((item: any, idx: number) => {
                    const maxVal = Math.max(item.industry_demand, item.student_supply, 1);
                    const demandPct = Math.min(100, (item.industry_demand / 6) * 100);
                    const supplyPct = Math.min(100, (item.student_supply / 6) * 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{item.skill}</span>
                          <span className="text-[11px] text-slate-400">
                            Demand:{" "}
                            <span className="text-indigo-400 font-semibold">
                              {item.industry_demand} roles
                            </span>{" "}
                            | Supply:{" "}
                            <span className="text-emerald-400 font-semibold">
                              {item.student_supply} students
                            </span>
                          </span>
                        </div>
                        {/* Dual bar graph */}
                        <div className="grid grid-cols-2 gap-2 h-2.5 bg-slate-900/60 rounded-full p-0.5 border border-slate-800">
                          {/* Demand bar */}
                          <div className="flex justify-end h-full">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${demandPct}%` }}
                            />
                          </div>
                          {/* Supply bar */}
                          <div className="flex justify-start h-full">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${supplyPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: COMPANY VERIFICATION CENTER */}
      {activeTab === "verification" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Company Verification & Institutional Trust
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Approve vetted corporate and research partners to display the Verified Industry Partner seal.
            </p>
          </div>

          {loadingCompanies ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading registered companies...
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Industry</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {companies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-100">{c.company_name}</div>
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              {c.website} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </td>
                        <td className="p-4">{c.industry || "General Industry"}</td>
                        <td className="p-4">{c.location || "Remote"}</td>
                        <td className="p-4">
                          {c.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              Verified Partner
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              Pending Approval
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleVerification(c.id, c.is_verified)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              c.is_verified
                                ? "bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30"
                            }`}
                          >
                            {c.is_verified ? "Revoke Verification" : "Verify & Approve"}
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
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                User Account Directory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit registered student and company accounts across the platform.
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs rounded-xl"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="company">Companies</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="text-center py-16 text-slate-400 text-sm">Loading users...</div>
          ) : (
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-100">{u.full_name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : u.role === "company"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {u.is_active ? (
                            <span className="text-emerald-400 font-semibold">Active</span>
                          ) : (
                            <span className="text-rose-400 font-semibold">Suspended</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                u.is_active
                                  ? "bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
                              }`}
                            >
                              {u.is_active ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI MATCHING ENGINE SETTINGS */}
      {activeTab === "matching-engine" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              AI Matching Engine Architecture & Parameters
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              NexusCollab's modular matching framework allows swapping rule engines, semantic embeddings, and LLM rankers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Engine Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Active Production Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">
                  WeightedRulesMatchingEngine (v1.0)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Canonical synonym-aware skill tokenization, multi-factor weighting, and explainable skill gap recommendation generator.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">Mandatory Skills Weight</span>
                  <span className="font-bold text-indigo-400">55%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">Preferred Skills Weight</span>
                  <span className="font-bold text-indigo-400">15%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">Academic & Major Alignment</span>
                  <span className="font-bold text-indigo-400">15%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">Domain Interests Alignment</span>
                  <span className="font-bold text-indigo-400">15%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-300">Industry Certification Bonus</span>
                  <span className="font-bold text-emerald-400">Up to +10.0%</span>
                </div>
              </div>
            </div>

            {/* Pluggable Architecture Guide */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  Pluggable Engine Adapter Pattern
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Extensible
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Swapping or Improving the AI Engine
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  The backend adheres to the Adapter and Factory design patterns via{" "}
                  <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">
                    BaseMatchingEngine
                  </code>
                  .
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <p className="text-slate-400">// To add a SentenceTransformer or LLM engine:</p>
                <p className="text-purple-300">class DeepEmbeddingEngine(BaseMatchingEngine):</p>
                <p className="pl-4 text-slate-300">def calculate_match(student, internship):</p>
                <p className="pl-8 text-emerald-300"># Compute vector cosine similarity</p>
                <p className="pl-8 text-indigo-300">return MatchScoreResult(...)</p>
                <p className="text-slate-400">// Register in factory:</p>
                <p className="text-amber-300">register_matching_engine("deep_llm", DeepEmbeddingEngine)</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Configured via <code className="text-slate-200">MATCHING_ENGINE</code> in{" "}
                  <code className="text-slate-200">.env</code>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
