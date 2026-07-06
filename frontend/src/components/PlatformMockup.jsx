import React from "react";
import { 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MessageSquare, 
  Repeat2, 
  Share2, 
  Briefcase, 
  ThumbsUp 
} from "lucide-react";
import { InstagramIcon, XIcon, FacebookIcon, LinkedInIcon } from "./SocialIcons";

export const PlatformMockup = ({ platform, tone, captionObj }) => {
  const previewText = captionObj ? captionObj.text : "Pratinjau caption Anda akan muncul di sini secara real-time...";
  const hashtags = captionObj && captionObj.hashtags ? captionObj.hashtags : [];
  
  if (platform === "Instagram") {
    return (
      <div className="bg-black text-white rounded-xl border border-zinc-800 overflow-hidden text-sm mockup-instagram shadow-xl">
        {/* Instagram Header */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-black border border-black flex items-center justify-center text-[10px] font-bold">AI</div>
            </div>
            <div>
              <span className="font-semibold text-xs tracking-tight block">smart_caption</span>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">Saran Gaya: {tone}</span>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-zinc-400 cursor-pointer" />
        </div>
        
        {/* Instagram Post Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center text-zinc-500 relative border-b border-zinc-900">
          <div className="p-4 rounded-full bg-black/40 backdrop-blur-sm border border-zinc-800/50 mb-2 animate-float">
            <InstagramIcon className="w-8 h-8 text-pink-500/80" />
          </div>
          <span className="text-xs font-medium tracking-wide text-zinc-400">Post Visual Placeholder</span>
          <span className="text-[10px] text-zinc-600 mt-1">Gaya layout postingan Instagram</span>
        </div>
        
        {/* Instagram Actions */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 hover:text-zinc-300 cursor-pointer" />
            <MessageCircle className="w-6 h-6 hover:text-zinc-300 cursor-pointer" />
            <Send className="w-6 h-6 hover:text-zinc-300 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 hover:text-zinc-300 cursor-pointer" />
        </div>
        
        {/* Instagram Caption Content */}
        <div className="px-3 pb-4">
          <span className="font-bold text-xs tracking-tight mr-2">smart_caption</span>
          <span className="text-zinc-200 whitespace-pre-line leading-relaxed text-xs">{previewText}</span>
          {hashtags.length > 0 && (
            <span className="block text-sky-400 hover:underline cursor-pointer text-xs mt-1">
              {hashtags.map(h => `#${h}`).join(" ")}
            </span>
          )}
          <span className="block text-[10px] text-zinc-500 uppercase mt-2">1 menit yang lalu</span>
        </div>
      </div>
    );
  }
  
  if (platform === "X") {
    return (
      <div className="bg-black text-zinc-200 rounded-xl border border-zinc-800 p-4 text-[14px] mockup-x shadow-xl">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">AI</div>
          
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="font-bold text-white truncate text-sm">Smart Caption AI</span>
                <span className="text-zinc-500 text-xs truncate">@smart_caption</span>
                <span className="text-zinc-500 text-xs">·</span>
                <span className="text-zinc-500 text-xs flex-shrink-0">skrg</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-500 cursor-pointer" />
            </div>
            
            {/* Tweet Text */}
            <p className="mt-1 text-zinc-100 whitespace-pre-line leading-relaxed text-[15px]">{previewText}</p>
            {hashtags.length > 0 && (
              <p className="text-sky-400 hover:underline cursor-pointer text-[14px] mt-1.5">
                {hashtags.map(h => `#${h}`).join(" ")}
              </p>
            )}
            
            {/* Tone Badge */}
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Gaya: {tone}
            </div>

            {/* X Action Buttons */}
            <div className="flex items-center justify-between mt-4 text-zinc-500 max-w-md text-xs border-t border-zinc-900 pt-3">
              <span className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors">
                <Repeat2 className="w-4 h-4" />
                <span>0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-pink-500 cursor-pointer transition-colors">
                <Heart className="w-4 h-4" />
                <span>0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === "Facebook") {
    return (
      <div className="bg-[#18191a] text-zinc-200 rounded-xl border border-zinc-800 overflow-hidden text-sm mockup-facebook shadow-xl">
        {/* FB Header */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white border border-zinc-700">AI</div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-[14px]">Smart Caption Generator</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-blue-600/20 text-blue-400 rounded-full font-medium">Halaman</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 text-[12px] mt-0.5">
              <span>Baru saja</span>
              <span>·</span>
              <Briefcase className="w-3 h-3 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="px-3 pb-3">
          <p className="whitespace-pre-line leading-relaxed text-[14px] text-zinc-100">{previewText}</p>
          {hashtags.length > 0 && (
            <p className="text-blue-400 hover:underline cursor-pointer text-[14px] mt-1.5">
              {hashtags.map(h => `#${h}`).join(" ")}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="px-3 py-2 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">👍</div>
            <span>0</span>
          </div>
          <div className="flex gap-2">
            <span>0 Komentar</span>
            <span>0 Dibagikan</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mx-3 py-1 border-t border-zinc-800 grid grid-cols-3 text-center text-xs font-semibold text-zinc-400">
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span>Suka</span>
          </div>
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Komentar</span>
          </div>
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </div>
        </div>
      </div>
    );
  }

  if (platform === "LinkedIn") {
    return (
      <div className="bg-[#1b1f23] text-zinc-200 rounded-xl border border-zinc-800 p-4 text-xs mockup-linkedin shadow-xl">
        {/* LinkedIn Profile */}
        <div className="flex gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white border border-zinc-700">AI</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-[13px] hover:text-blue-400 hover:underline cursor-pointer truncate">Smart Social AI</span>
              <MoreHorizontal className="w-4 h-4 text-zinc-400 cursor-pointer" />
            </div>
            <span className="text-zinc-400 block truncate text-[11px]">Social Media Strategist & AI Copywriter</span>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-0.5">
              <span>Baru saja</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">🌎</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-[13px] text-zinc-100 whitespace-pre-line leading-relaxed mb-2">{previewText}</p>
        {hashtags.length > 0 && (
          <p className="text-sky-400 hover:underline cursor-pointer text-[13px] font-semibold mb-4">
            {hashtags.map(h => `#${h}`).join(" ")}
          </p>
        )}
        
        {/* Tone Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-medium">
          💼 Gaya Bahasa: {tone}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="flex items-center -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[7px] text-white border border-zinc-900">👍</span>
              <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[7px] text-white border border-zinc-900">👏</span>
            </span>
            <span>0</span>
          </div>
          <span>0 komentar</span>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-4 text-center text-zinc-400 font-semibold text-[11px] pt-1.5">
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Rekomendasi</span>
          </div>
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Komentar</span>
          </div>
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors">
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </div>
          <div className="py-2 hover:bg-zinc-800 rounded-md cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-colors">
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
