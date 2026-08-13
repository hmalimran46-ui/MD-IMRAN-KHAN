/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Award, Target, Rocket, Zap, CheckCircle2 } from "lucide-react";
import { useFirebase } from "./FirebaseContext";

export default function About() {
  const { about } = useFirebase();
  const [activeTab, setActiveTab] = useState("expertise");

  // Auxiliary tool arrays to keep the visual high-end styling
  const getDefaultTools = (skillName: string) => {
    if (!skillName || typeof skillName !== "string") return ["GSC", "Analytics", "Performance"];
    const sl = skillName.toLowerCase();
    if (sl.includes("seo")) {
      return ["Ahrefs", "Semrush", "Screaming Frog", "GSC", "PageSpeed"];
    } else if (sl.includes("youtube")) {
      return ["VidIQ", "TubeBuddy", "Creator Studio", "Premiere", "AfterEffects"];
    } else if (sl.includes("ad") || sl.includes("ppc") || sl.includes("google")) {
      return ["Meta Ads", "Google Merchant", "Ads Manager", "GA4", "Tag Manager"];
    } else if (sl.includes("social") || sl.includes("strategy") || sl.includes("brand")) {
      return ["Figma", "Buffer", "Figma Analytics", "Canva Team", "Notion"];
    }
    return ["Figma", "GSC", "Analytics", "Performance Tracking"];
  };

  const getMethodologyIcon = (index: number) => {
    const icons = [Target, Zap, Rocket, CheckCircle2];
    return icons[index % icons.length];
  };

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#040212]/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest font-bold">
            Who is MD Imran Khan
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight mt-3">
            Crafting High-Converting <br className="hidden sm:inline" />
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Digital Masterpieces
            </span>
          </h2>
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Image Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm sm:max-w-md">
              {/* Colored Glow Backlight */}
              <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500 -z-10" />
              
              {/* Border Ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/40 via-blue-500/10 to-purple-500/40 p-[1.5px] -z-10 saturate-150" />

              {/* Core Portrait Mask */}
              <div className="relative rounded-2xl bg-brand-dark/90 overflow-hidden shadow-[0_20px_50px_rgba(6,182,212,0.15)] backdrop-blur-sm border border-white/5 bg-[#030014]/60">
                <img
                  src={about.portraitUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"}
                  alt="MD: IMRAN KHAN - Digital Marketer"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-square object-cover object-center saturate-110 brightness-110 scale-100 hover:scale-[1.04] transition-all duration-500 ease-out"
                />
                
                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel border border-white/10 rounded-xl p-3.5 backdrop-blur-md flex items-center gap-3 bg-[#030014]/80">
                  <div className="h-8.5 w-8.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-white leading-none">
                      {about.badgeTitle || "Top-Rated Freelancer"}
                    </span>
                    <span className="block font-mono text-[9px] text-gray-400 mt-1">
                      {about.badgeSub || "Verified Digital Marketer"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Details Content */}
          <div className="lg:col-span-7">
            <p className="font-sans text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              {about.bioLine1 || "I am MD: IMRAN KHAN, a professional Digital Marketer & Freelancer specializing in SEO, SMM, and Conversion Tactics."}
            </p>
            <p className="font-sans text-sm sm:text-base text-gray-400 leading-relaxed mb-10 border-l border-white/10 pl-4 py-1">
              {about.bioLine2 || "Equipped with high-performance metrics engines and automated search strategies to design scalable customer acquisitions."}
            </p>

            {/* Quick Switch Panel (About Tabs) */}
            <div className="flex border-b border-white/5 mb-8">
              <button
                onClick={() => setActiveTab("expertise")}
                className={`pb-3.5 font-sans text-sm tracking-wide font-medium transition-all mr-8 border-b-2 cursor-pointer ${
                  activeTab === "expertise"
                    ? "border-cyan-400 text-white font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Core Expertise
              </button>
              <button
                onClick={() => setActiveTab("methodology")}
                className={`pb-3.5 font-sans text-sm tracking-wide font-medium transition-all border-b-2 cursor-pointer ${
                  activeTab === "methodology"
                    ? "border-cyan-400 text-white font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                Why MD Imran Khan?
              </button>
            </div>

            {/* Tab: Expertise */}
            {activeTab === "expertise" && (
              <div className="space-y-6 animate-fade-in">
                {(about.skillsList || []).map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-sans font-semibold text-gray-200">{skill.name}</span>
                      <span className="font-mono text-[#06b6d4] font-bold">{skill.level}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    {/* Tool Stack Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {getDefaultTools(skill.name).map((tool) => (
                        <span key={tool} className="font-mono text-[9px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Methodology */}
            {activeTab === "methodology" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                {(about.highlights || []).map((highlight, index) => {
                  const Icon = getMethodologyIcon(index);
                  // Split title and description if it contains colons
                  const parts = highlight.split(":");
                  const title = parts[1] ? parts[0] : `Protocol 0${index + 1}`;
                  const desc = parts[1] ? parts.slice(1).join(":") : parts[0];

                  return (
                    <div key={index} className="glass-panel border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 hover:shadow-lg bg-[#070520]/40">
                      <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="block font-sans text-sm font-bold text-white mb-2">{title}</span>
                      <span className="block font-sans text-xs text-gray-400 leading-relaxed">{desc}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Counters & Statistics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          {(about.stats || []).map((stat) => (
            <div
              key={stat.id}
              className="glass-panel glass-panel-hover border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative group bg-[#090724]/60"
            >
              {/* Hover Radial Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.04)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <span className="block font-mono text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-2.5">
                {stat.value}
                <span className="text-cyan-400 font-sans text-2xl sm:text-3.5xl font-bold">{stat.suffix}</span>
              </span>
              <span className="block font-sans text-xs font-semibold text-gray-200 tracking-wide uppercase mb-1">
                {stat.label}
              </span>
              <span className="block font-sans text-[10px] sm:text-xs text-gray-500 leading-relaxed max-w-xs">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
