"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MatchScoreBadge } from "./MatchScoreBadge";
import {
  Sparkles,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  FileCheck,
  SlidersHorizontal
} from "lucide-react";

interface StudentDashboardProps {
  activeTab: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab }) => {
  const { user, profile, refreshUser } = useAuth();

  // Recommendations state
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [searchRecQuery, setSearchRecQuery] = useState<string>("");

  // All Internships state
  const [allInternships, setAllInternships] = useState<any[]>([]);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [exploreSearch, setExploreSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Applications state
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Apply Modal state
  const [applyingTo, setApplyingTo] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSuccessMessage, setAppSuccessMessage] = useState<string | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    headline: "",
    major: "",
    university: "",
    graduation_year: 2026,
    gpa: 3.8,
    bio: "",
    skills: [] as string[],
    certifications: [] as any[],
    interests: [] as string[],
    location_preference: "Remote",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState<number>(2025);
  const [newInterestInput, setNewInterestInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setProfileForm({
        headline: profile.headline || "",
        major: profile.major || "",
        university: profile.university || "",
        graduation_year: profile.graduation_year || 2026,
        gpa: profile.gpa || 3.8,
        bio: profile.bio || "",
        skills: profile.skills || [],
        certifications: profile.certifications || [],
        interests: profile.interests || [],
        location_preference: profile.location_preference || "Remote",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        portfolio_url: profile.portfolio_url || "",
      });
    }
  }, [profile]);

  // Fetch recommendations
  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const data = await api.getRecommendedInternships({
        min_score: minScoreFilter,
        location_type: locationFilter || undefined,
        search: searchRecQuery || undefined,
      });
      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  // Fetch all internships
  const fetchAllInternships = async () => {
    setLoadingExplore(true);
    try {
      const data = await api.listInternships({
        search: exploreSearch || undefined,
        skill: selectedSkill || undefined,
      });
      setAllInternships(data);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoadingExplore(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recommendations") {
      fetchRecommendations();
    } else if (activeTab === "explore") {
      fetchAllInternships();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab, minScoreFilter, locationFilter]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingTo) return;
    setIsSubmittingApp(true);
    try {
      await api.applyToInternship(applyingTo.id, coverLetter);
      setAppSuccessMessage(`Successfully applied to ${applyingTo.title}!`);
      setTimeout(() => {
        setApplyingTo(null);
        setCoverLetter("");
        setAppSuccessMessage(null);
      }, 1500);
      fetchApplications();
      fetchRecommendations();
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.updateStudentProfile(profileForm);
      await refreshUser();
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
      // Refresh recommendations with new skills!
      fetchRecommendations();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    const clean = newSkillInput.trim();
    if (!profileForm.skills.includes(clean)) {
      setProfileForm({ ...profileForm, skills: [...profileForm.skills, clean] });
    }
    setNewSkillInput("");
  };

  const removeSkill = (sk: string) => {
    setProfileForm({
      ...profileForm,
      skills: profileForm.skills.filter((s) => s !== sk),
    });
  };

  const addCertification = () => {
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    const newCert = {
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      year: Number(newCertYear) || 2025,
    };
    setProfileForm({
      ...profileForm,
      certifications: [...profileForm.certifications, newCert],
    });
    setNewCertTitle("");
    setNewCertIssuer("");
  };

  const removeCert = (idx: number) => {
    setProfileForm({
      ...profileForm,
      certifications: profileForm.certifications.filter((_, i) => i !== idx),
    });
  };

  const addInterest = () => {
    if (!newInterestInput.trim()) return;
    const clean = newInterestInput.trim();
    if (!profileForm.interests.includes(clean)) {
      setProfileForm({
        ...profileForm,
        interests: [...profileForm.interests, clean],
      });
    }
    setNewInterestInput("");
  };

  const removeInterest = (interest: string) => {
    setProfileForm({
      ...profileForm,
      interests: profileForm.interests.filter((i) => i !== interest),
    });
  };

  return (
    <div className="space-y-6">
      {/* TAB 1: AI RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/20 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                Adaptive AI Skill Matching
              </div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                Recommended Internships for You
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ranked dynamically by comparing your coursework, verified certifications, domain interests, and required skill overlaps.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by keyword / role..."
                  value={searchRecQuery}
                  onChange={(e) => setSearchRecQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchRecommendations()}
                  className="w-full glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl"
                />
              </div>

              <div>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full glass-input px-3 py-1.5 text-xs rounded-xl"
                >
                  <option value="">All Location Types</option>
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  Min Match: {minScoreFilter}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          {loadingRecs ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin mx-auto mb-2" />
              Calculating compatibility scores with AI matching engine...
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">
                No internships found matching your current filter criteria.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try lowering the minimum match score slider or updating your profile skills.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((item) => {
                const { internship, match } = item;
                return (
                  <div
                    key={internship.id}
                    className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                  >
                    <div>
                      {/* Top Row: Company & Match Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                            {internship.company?.company_name || "Partner Company"}
                          </span>
                          <h3 className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors">
                            {internship.title}
                          </h3>
                        </div>
                        <MatchScoreBadge
                          score={match.overall_score}
                          breakdown={match}
                          internshipTitle={internship.title}
                        />
                      </div>

                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 my-2.5">
                        <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {internship.location} ({internship.location_type})
                        </span>
                        <span className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {internship.duration_weeks} Weeks
                        </span>
                        {internship.stipend_monthly > 0 && (
                          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                            <DollarSign className="w-3 h-3" />
                            ${internship.stipend_monthly.toLocaleString()}/mo
                          </span>
                        )}
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                        {internship.description}
                      </p>

                      {/* Skills alignment */}
                      <div className="space-y-1.5 mb-3">
                        <div className="text-[11px] font-semibold text-slate-400">
                          Required Skills Match:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(internship.required_skills || []).map((sk: string, i: number) => {
                            const isMatched = (match.matched_required_skills || []).includes(sk);
                            return (
                              <span
                                key={i}
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                                  isMatched
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                    : "bg-slate-800/80 text-slate-400 border-slate-700/60"
                                }`}
                              >
                                {isMatched && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                                {sk}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Summary Highlight */}
                      {match.match_summary && (
                        <div className="p-2 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-300 mb-4 line-clamp-2">
                          <span className="font-semibold">Why you match: </span>
                          {match.match_summary}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setApplyingTo(internship);
                          setCoverLetter(
                            `Hello ${internship.company?.company_name || "Hiring Team"},\n\nI am thrilled to apply for the ${internship.title} position. My academic background in ${profile?.major || "Computer Science"} and hands-on experience in ${(profile?.skills || []).slice(0, 3).join(", ")} align strongly with your project goals.`
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Quick Apply
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPLORE ALL INTERNSHIPS */}
      {activeTab === "explore" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search postings by title, skill, or tech..."
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAllInternships()}
                className="w-full glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={fetchAllInternships}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all"
              >
                Search
              </button>
            </div>
          </div>

          {loadingExplore ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading internship opportunities...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allInternships.map((internship) => (
                <div
                  key={internship.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                          {internship.company?.company_name || "Partner Company"}
                        </span>
                        <h3 className="text-base font-bold text-slate-100">
                          {internship.title}
                        </h3>
                        <p className="text-xs text-slate-400">{internship.department}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {internship.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed my-2">
                      {internship.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 my-3">
                      {(internship.required_skills || []).map((sk: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {internship.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {internship.duration_weeks} Weeks
                      </span>
                      {internship.stipend_monthly > 0 && (
                        <span className="font-semibold text-emerald-400">
                          ${internship.stipend_monthly.toLocaleString()}/mo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Deadline: {internship.deadline || "Open until filled"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setApplyingTo(internship);
                        setCoverLetter(
                          `Hello ${internship.company?.company_name || "Hiring Team"},\n\nI am eager to apply for the ${internship.title} role. My experience in ${(profile?.skills || []).slice(0, 3).join(", ")} aligns directly with your posting.`
                        );
                      }}
                      className="py-1.5 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Application Tracker
            </h2>
            <span className="text-xs text-slate-400">
              Total submitted: {applications.length}
            </span>
          </div>

          {loadingApps ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading your applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
              <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">
                You haven't submitted any applications yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Explore recommended internships and apply to get matched!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const getStatusColor = (st: string) => {
                  switch (st) {
                    case "accepted":
                      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
                    case "shortlisted":
                      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
                    case "interviewing":
                      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
                    case "under_review":
                      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
                    case "rejected":
                      return "bg-rose-500/20 text-rose-400 border-rose-500/40";
                    default:
                      return "bg-slate-800 text-slate-300 border-slate-700";
                  }
                };

                return (
                  <div
                    key={app.id}
                    className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-indigo-400">
                          {app.internship?.company?.company_name || "Company"}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">
                        {app.internship?.title || "Internship Role"}
                      </h3>
                      {app.cover_letter && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1 italic">
                          "{app.cover_letter}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {app.match_score_at_application > 0 && (
                        <MatchScoreBadge
                          score={app.match_score_at_application}
                          breakdown={app.match_breakdown}
                          internshipTitle={app.internship?.title}
                        />
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE & SKILLS MANAGER */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Student Academic & Skills Profile
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep your profile updated. The AI matching algorithm uses this live data to calculate placement compatibility.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
            >
              {isSavingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {profileSaveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile updated successfully! AI compatibility scores have been refreshed.</span>
            </div>
          )}

          {/* Academic Information */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Academic Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI & Machine Learning Researcher | CS Honors"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  University / Institute
                </label>
                <input
                  type="text"
                  placeholder="e.g. State University of Technology"
                  value={profileForm.university}
                  onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Degree & Major
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Artificial Intelligence"
                  value={profileForm.major}
                  onChange={(e) => setProfileForm({ ...profileForm, major: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={profileForm.graduation_year}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, graduation_year: Number(e.target.value) })
                    }
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current GPA (4.0 Scale)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={profileForm.gpa}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, gpa: Number(e.target.value) })
                    }
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bio / Research Background
              </label>
              <textarea
                rows={3}
                placeholder="Describe your technical background, lab projects, or publications..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full glass-input p-3 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Interactive Technical Skills Manager */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Technical Skills ({profileForm.skills.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Directly evaluated in 55% of the AI compatibility score
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. PyTorch, React, Docker, FastAPI)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 glass-input px-3 py-2 text-xs rounded-xl"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileForm.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications Manager */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Verified Certifications ({profileForm.certifications.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Awards up to +10% bonus boost in compatibility
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Certification Name (e.g. AWS Certified Developer)"
                value={newCertTitle}
                onChange={(e) => setNewCertTitle(e.target.value)}
                className="sm:col-span-2 glass-input px-3 py-2 text-xs rounded-xl"
              />
              <input
                type="text"
                placeholder="Issuer (e.g. Amazon, Google, Meta)"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                className="glass-input px-3 py-2 text-xs rounded-xl"
              />
              <button
                type="button"
                onClick={addCertification}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Cert
              </button>
            </div>

            <div className="space-y-2">
              {profileForm.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-200">{cert.title}</span>
                      <span className="text-slate-400 ml-2">
                        Issued by {cert.issuer} ({cert.year})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCert(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Interests */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Domain Research & Career Interests ({profileForm.interests.length})
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an interest (e.g. Natural Language Processing, Autonomous Systems, Clean Energy)..."
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterest();
                  }
                }}
                className="flex-1 glass-input px-3 py-2 text-xs rounded-xl"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileForm.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* QUICK APPLY MODAL */}
      {applyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-indigo-400" />
              Apply to {applyingTo.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              at {applyingTo.company?.company_name || "Partner Organization"}
            </p>

            {appSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{appSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Letter & Pitch
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full glass-input p-3 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyingTo(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 disabled:opacity-50"
                  >
                    {isSubmittingApp ? "Submitting..." : "Confirm Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
