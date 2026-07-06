import React from "react";

export const LoadingSkeleton = () => (
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-pulse mt-6">
    <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
      <div className="h-5 bg-slate-800 rounded w-1/3" />
      <div className="h-5 bg-slate-800 rounded w-1/6" />
    </div>
    <div className="space-y-3 pt-2">
      <div className="h-4 bg-slate-800 rounded w-full" />
      <div className="h-4 bg-slate-800 rounded w-5/6" />
      <div className="h-4 bg-slate-800 rounded w-4/5" />
      <div className="h-4 bg-slate-800 rounded w-full" />
    </div>
  </div>
);
