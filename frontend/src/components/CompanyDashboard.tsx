"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MatchScoreBadge } from "./MatchScoreBadge";
import {
  Building2,
  Plus,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Send,
  Trash2,
  Calendar
} from "lucide-react";

interface CompanyDashboardProps {
  activeTab: string;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ activeTab }) => {
  const { user, profile, refreshUser } = useAuth();

  // Internships list state
  const [internships, setInternships] = useState<any[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState<number | null>(null);

  // Applicants state for selected internship
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New Internship form state
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    location_type: "remote",
    location: "Remote",
    duration_weeks: 12,
    stipend_monthly: 4000,
    required_skills: [] as string[],
    preferred_skills: [] as string[],
    academic_fields: [] as string[],
    min_gpa: 3.0,
    openings: 2,
    deadline: "2026-12-15",
  });
  const [reqSkillInput, setReqSkillInput] = useState("");
  const [prefSkillInput, setPrefSkillInput] = useState("");
  const [majorInput, setMajorInput] = useState("");
  const [isSubmittingPosting, setIsSubmittingPosting] = useState(false);
  const [postingSuccess, setPostingSuccess] = useState(false);

  // Company Profile form state
  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    industry: "",
    website: "",
    location: "",
    description: "",
  });
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [companySaveSuccess, setCompanySaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setCompanyForm({
        company_name: profile.company_name || "",
        industry: profile.industry || "",
        website: profile.website || "",
        location: profile.location || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  const fetchCompanyInternships = async () => {
    setLoadingInternships(true);
    try {
      const data = await api.getCompanyInternships();
      setInternships(data);
      if (data.length > 0 && !selectedInternshipId) {
        setSelectedInternshipId(data[0].id);
      }
    } catch (err) {
      console.error("Error loading internships:", err);
    } finally {
      setLoadingInternships(false);
    }
  };

  const fetchApplicants = async (internshipId: number) => {
    setLoadingApplicants(true);
    try {
      const data = await api.getInternshipApplicants(internshipId);
      setApplicants(data);
    } catch (err) {
      console.error("Error loading applicants:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (activeTab === "postings") {
      fetchCompanyInternships();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedInternshipId) {
      fetchApplicants(selectedInternshipId);
    }
  }, [selectedInternshipId]);

  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.required_skills.length === 0) {
      alert("Please add at least one required skill for the AI matching engine to score candidates.");
      return;
    }
    setIsSubmittingPosting(true);
    try {
      await api.createInternship(formData);
      setPostingSuccess(true);
      fetchCompanyInternships();
      setTimeout(() => setPostingSuccess(false), 3000);
      // Reset form
      setFormData({
        title: "",
        department: "",
        description: "",
        location_type: "remote",
        location: "Remote",
        duration_weeks: 12,
        stipend_monthly: 4000,
        required_skills: [],
        preferred_skills: [],
        academic_fields: [],
        min_gpa: 3.0,
        openings: 2,
        deadline: "2026-12-15",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create internship");
    } finally {
      setIsSubmittingPosting(false);
    }
  };

  const handleUpdateApplicantStatus = async (appId: number, newStatus: string) => {
    try {
      await api.updateApplicantStatus(appId, newStatus);
      if (selectedInternshipId) {
        fetchApplicants(selectedInternshipId);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleSaveCompanyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCompany(true);
    try {
      await api.updateCompanyProfile(companyForm);
      await refreshUser();
      setCompanySaveSuccess(true);
      setTimeout(() => setCompanySaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update company profile");
    } finally {
      setIsSavingCompany(false);
    }
  };

  const addReqSkill = () => {
    if (!reqSkillInput.trim()) return;
    const clean = reqSkillInput.trim();
    if (!formData.required_skills.includes(clean)) {
      setFormData({ ...formData, required_skills: [...formData.required_skills, clean] });
    }
    setReqSkillInput("");
  };

  const addPrefSkill = () => {
    if (!prefSkillInput.trim()) return;
    const clean = prefSkillInput.trim();
    if (!formData.preferred_skills.includes(clean)) {
      setFormData({ ...formData, preferred_skills: [...formData.preferred_skills, clean] });
    }
    setPrefSkillInput("");
  };

  const addMajor = () => {
    if (!majorInput.trim()) return;
    const clean = majorInput.trim();
    if (!formData.academic_fields.includes(clean)) {
      setFormData({ ...formData, academic_fields: [...formData.academic_fields, clean] });
    }
    setMajorInput("");
  };

  return (
    <div className="space-y-6">
      {/* Verification Notice */}
      {profile && !profile.is_verified && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Pending University Admin Verification:</span> Your company account is awaiting review by academic administrators. You can still create postings and preview AI candidate matching.
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-200 font-semibold uppercase text-[10px]">
            Pending
          </span>
        </div>
      )}

      {/* TAB 1: POSTINGS & CANDIDATE REVIEW CENTER */}
      {activeTab === "postings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Internship Postings & AI Candidate Review
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Applicants are automatically ranked by skill compatibility using the AI Matching Engine.
              </p>
            </div>
          </div>

          {loadingInternships ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading your company's postings...
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">
                You haven't posted any internships yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Click "+ Post Internship" in the top navigation to publish a new role!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Postings List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Postings ({internships.length})
                </div>
                {internships.map((internship) => {
                  const isSelected = selectedInternshipId === internship.id;
                  return (
                    <div
                      key={internship.id}
                      onClick={() => setSelectedInternshipId(internship.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "glass-card border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-100">
                          {internship.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {internship.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{internship.department}</p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {internship.location_type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {internship.duration_weeks}w
                        </span>
                        {internship.stipend_monthly > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">
                              ${internship.stipend_monthly}/mo
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Candidate Review Center for Selected Internship */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-panel rounded-2xl p-5 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        AI Ranked Applicants
                      </div>
                      <h3 className="text-lg font-bold text-slate-100">
                        {internships.find((i) => i.id === selectedInternshipId)?.title || "Select a Posting"}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-center">
                      {applicants.length} Candidates
                    </span>
                  </div>

                  {loadingApplicants ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-spin mx-auto mb-2" />
                      Ranking candidates by AI compatibility...
                    </div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      No applications submitted for this role yet.
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      {applicants.map((cand) => {
                        const { student, match, application_id, application_status, cover_letter } = cand;

                        return (
                          <div
                            key={application_id}
                            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-100">
                                    {student.user?.full_name || "Student Candidate"}
                                  </h4>
                                  <span className="text-[11px] text-slate-400">
                                    ({student.university || "University"})
                                  </span>
                                </div>
                                <p className="text-xs text-indigo-300 font-medium">
                                  {student.headline || student.major}
                                </p>
                                {student.gpa && (
                                  <p className="text-[11px] text-slate-400">
                                    GPA: <span className="font-semibold text-slate-300">{student.gpa}</span> | Graduating: {student.graduation_year}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <MatchScoreBadge
                                  score={match.overall_score}
                                  breakdown={match}
                                  internshipTitle={internships.find((i) => i.id === selectedInternshipId)?.title}
                                />
                              </div>
                            </div>

                            {/* Skills breakdown chips */}
                            <div className="space-y-1">
                              <div className="text-[11px] text-slate-400 font-medium">
                                Skill Coverage:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(match.matched_required_skills || []).map((sk: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {sk}
                                  </span>
                                ))}
                                {(match.missing_required_skills || []).map((sk: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-500 border border-slate-700/60 line-through"
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Cover letter quote */}
                            {cover_letter && (
                              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic">
                                "{cover_letter}"
                              </div>
                            )}

                            {/* Status Changer Bar */}
                            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="text-slate-400 text-[11px]">
                                Application Decision Status:
                              </span>
                              <div className="flex items-center gap-1.5">
                                {[
                                  { key: "under_review", label: "Review" },
                                  { key: "shortlisted", label: "Shortlist" },
                                  { key: "interviewing", label: "Interview" },
                                  { key: "accepted", label: "Accept" },
                                  { key: "rejected", label: "Reject" },
                                ].map((st) => (
                                  <button
                                    key={st.key}
                                    type="button"
                                    onClick={() => handleUpdateApplicantStatus(application_id, st.key)}
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                                      application_status === st.key
                                        ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                                        : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST NEW INTERNSHIP */}
      {activeTab === "new-posting" && (
        <form onSubmit={handleCreateInternship} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Post New Industry Internship
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the requirements and skills. The AI Matching Engine will match suitable students.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmittingPosting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {isSubmittingPosting ? "Publishing..." : "Publish Internship"}
            </button>
          </div>

          {postingSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Internship posted successfully! It is now live for students and AI matching.</span>
            </div>
          )}

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Internship Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning Research Intern"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department / Team
                </label>
                <input
                  type="text"
                  placeholder="e.g. Applied AI Systems Group"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Workplace Location Type
                </label>
                <select
                  value={formData.location_type}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location (City, Country or Remote)
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="52"
                    value={formData.duration_weeks}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_weeks: Number(e.target.value) })
                    }
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monthly Stipend ($USD)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={formData.stipend_monthly}
                    onChange={(e) =>
                      setFormData({ ...formData, stipend_monthly: Number(e.target.value) })
                    }
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Openings Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.openings}
                    onChange={(e) =>
                      setFormData({ ...formData, openings: Number(e.target.value) })
                    }
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Internship Overview & Core Objectives *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe project responsibilities, learning outcomes, and day-to-day deliverables..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full glass-input p-3 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Required Skills (Critical for AI Score) */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Mandatory Required Skills (55% of Match Score) *
              </h3>
              <span className="text-[11px] text-slate-400">
                Skills essential for candidate qualification
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add required skill (e.g. Python, PyTorch, React, SQL)..."
                value={reqSkillInput}
                onChange={(e) => setReqSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addReqSkill();
                  }
                }}
                className="flex-1 glass-input px-3 py-2 text-xs rounded-xl"
              />
              <button
                type="button"
                onClick={addReqSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.required_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        required_skills: formData.required_skills.filter((s) => s !== skill),
                      })
                    }
                    className="hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">
              Preferred / Nice-to-Have Skills (15% Bonus)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add preferred skill (e.g. Docker, AWS, NLP, Kubernetes)..."
                value={prefSkillInput}
                onChange={(e) => setPrefSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPrefSkill();
                  }
                }}
                className="flex-1 glass-input px-3 py-2 text-xs rounded-xl"
              />
              <button
                type="button"
                onClick={addPrefSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.preferred_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        preferred_skills: formData.preferred_skills.filter((s) => s !== skill),
                      })
                    }
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

      {/* TAB 3: COMPANY PROFILE */}
      {activeTab === "company-profile" && (
        <form onSubmit={handleSaveCompanyProfile} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Company Profile & Industry Identity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your organization details and institutional presence.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingCompany}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
            >
              {isSavingCompany ? "Saving..." : "Save Company Profile"}
            </button>
          </div>

          {companySaveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Company details updated successfully!</span>
            </div>
          )}

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.company_name}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, company_name: e.target.value })
                  }
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence & Robotics"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Corporate Website
                </label>
                <input
                  type="url"
                  placeholder="https://company.ai"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Mission & Innovation Focus
              </label>
              <textarea
                rows={4}
                placeholder="Share your technological initiatives, culture, and what students will work on..."
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="w-full glass-input p-3 text-xs rounded-xl"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
