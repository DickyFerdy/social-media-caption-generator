import React from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export const Toast = ({ message, type = "success", visible }) => {
  if (!visible) return null;
  
  const themeClasses = {
    success: "bg-emerald-950/90 border-emerald-500/30 text-emerald-300",
    error: "bg-rose-950/90 border-rose-500/30 text-rose-300",
    info: "bg-indigo-950/90 border-indigo-500/30 text-indigo-300",
  };
  
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl border text-sm font-semibold flex items-center gap-3 z-50 shadow-2xl backdrop-blur-md transition-all duration-300 animate-bounce ${themeClasses[type]}`}>
      <span>
        {type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
        {type === "info" && <Sparkles className="w-5 h-5 text-indigo-400" />}
      </span>
      <span>{message}</span>
    </div>
  );
};
