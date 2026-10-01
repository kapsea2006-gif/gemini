"use client";

import React from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
  Award,
  BookOpen,
  ArrowRight,
  Cpu
} from "lucide-react";

interface MatchBreakdownModalProps {
  score: number;
  breakdown: {
    overall_score: number;
    skills_score: number;
    education_score: number;
    interests_score: number;
    certifications_bonus: number;
    matched_required_skills?: string[];
    missing_required_skills?: string[];
    matched_preferred_skills?: string[];
    skill_gap_recommendations?: string[];
    match_summary?: string;
    engine_used?: string;
  };
  internshipTitle?: string;
  onClose: () => void;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  score,
  breakdown,
  internshipTitle,
  onClose,
}) => {
  const matchedRequired = breakdown.matched_required_skills || [];
  const missingRequired = breakdown.missing_required_skills || [];
  const matchedPreferred = breakdown.matched_preferred_skills || [];
  const recommendations = breakdown.skill_gap_recommendations || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow backdrop effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                AI Compatibility Analysis
              </h3>
            </div>
            {internshipTitle && (
              <p className="text-xs text-slate-400 mt-1">
                Role: <span className="text-slate-200 font-medium">{internshipTitle}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto space-y-5 py-4 pr-1 text-sm text-slate-300">
          {/* Main Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-950 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 to-emerald-300">
                  {score}%
                </span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Engine: {breakdown.engine_used || "WeightedRulesMatchingEngine"}
                </div>
                <div className="text-sm font-semibold text-slate-100 mt-0.5">
                  {score >= 85
                    ? "Exceptional Fit"
                    : score >= 70
                    ? "Strong Candidate Match"
                    : score >= 50
                    ? "Moderate Match"
                    : "Foundational Match"}
                </div>
              </div>
            </div>

            {breakdown.certifications_bonus > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>+{breakdown.certifications_bonus}% Certifications Boost</span>
              </div>
            )}
          </div>

          {/* AI Natural Language Summary */}
          {breakdown.match_summary && (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-indigo-300 block mb-1">AI Executive Summary:</span>
              {breakdown.match_summary}
            </div>
          )}

          {/* Sub-scores Progress Bars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Factor Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Required Skills */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Core Required Skills (55%)</span>
                  <span className="font-bold text-indigo-400">{breakdown.skills_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${breakdown.skills_score}%` }}
                  />
                </div>
              </div>

              {/* Academic Alignment */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Academic & Major Match (15%)</span>
                  <span className="font-bold text-emerald-400">{breakdown.education_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${breakdown.education_score}%` }}
                  />
                </div>
              </div>

              {/* Domain Interests */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Domain Interests Synergy (15%)</span>
                  <span className="font-bold text-purple-400">{breakdown.interests_score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${breakdown.interests_score}%` }}
                  />
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Preferred Skills Bonus (15%)</span>
                  <span className="font-bold text-amber-400">
                    {matchedPreferred.length > 0 ? "Matched" : "Optional"}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchedPreferred.length > 0 ? 100 : 30}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skill Deep Dive (Matched vs Missing) */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skill Alignment
            </h4>

            {/* Matched Required Skills */}
            {matchedRequired.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Required Skills ({matchedRequired.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Required Skills */}
            {missingRequired.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing Required Skills ({missingRequired.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Preferred Skills */}
            {matchedPreferred.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-2">
                  <Star className="w-4 h-4" />
                  <span>Bonus: Matched Preferred Skills ({matchedPreferred.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedPreferred.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 text-purple-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Recommendations */}
          {recommendations.length > 0 && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>AI Skill-Bridge Guidance</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
