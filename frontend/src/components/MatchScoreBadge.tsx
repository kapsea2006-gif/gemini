"use client";

import React, { useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { MatchBreakdownModal } from "./MatchBreakdownModal";

interface MatchScoreBadgeProps {
  score: number;
  breakdown?: any;
  internshipTitle?: string;
  showModalOnClick?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  breakdown,
  internshipTitle,
  showModalOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeStyle = () => {
    if (score >= 85) {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/20";
    } else if (score >= 70) {
      return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 ring-1 ring-indigo-500/20";
    } else if (score >= 50) {
      return "bg-amber-500/15 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20";
    } else {
      return "bg-slate-800/80 text-slate-400 border-slate-700";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => showModalOnClick && breakdown && setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${getBadgeStyle()} ${
          showModalOnClick && breakdown ? "hover:scale-105 cursor-pointer shadow-sm" : ""
        }`}
        title={breakdown ? "Click to view detailed AI Match Breakdown" : undefined}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{score}% Match</span>
        {showModalOnClick && breakdown && (
          <Info className="w-3 h-3 opacity-70 hover:opacity-100 ml-0.5" />
        )}
      </button>

      {isOpen && breakdown && (
        <MatchBreakdownModal
          score={score}
          breakdown={breakdown}
          internshipTitle={internshipTitle}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
