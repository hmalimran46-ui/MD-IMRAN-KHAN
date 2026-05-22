/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { CaseStudy } from "../types";
import MetricChart from "./MetricChart";
import { CheckCircle, TrendingUp, Award } from "lucide-react";
import { useFirebase } from "./FirebaseContext";

export default function Portfolio() {
  const { portfolio } = useFirebase();
  const [selectedCaseId, setSelectedCaseId] = useState("");

  // Select first item as default initially
  const activeCase = (portfolio || []).find((item) => item.id === selectedCaseId) || portfolio?.[0];

  useEffect(() => {
    if (portfolio && portfolio.length > 0 && !selectedCaseId) {
      setSelectedCaseId(portfolio[0].id);
    }
  }, [portfolio, selectedCaseId]);

  if (!portfolio || portfolio.length === 0) {
    return null; // Don't crash if loading or empty
  }

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-[#040212]/30 relative">
      {/* Decorative background grid and orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(168,85,247,0.03)_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20 text-center lg:text-left">
          <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest font-bold">
            Real Proof of Results
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight mt-3">
            Client Success Portfolios & <br className="hidden sm:inline" />
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Analytical Growth
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-gray-500 max-w-2xl mt-4 leading-relaxed">
            Data speaks louder than promises. Browse client campaign milestones, examine real audited metrics, and interact with growth analytical charts below.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* Left Column: Interactive Case Study Selection Cards (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="block font-mono text-[10px] uppercase text-gray-500 tracking-wider font-semibold mb-2">
              Select Client Campaign
            </span>

            {portfolio.map((study) => {
              const isSelected = study.id === selectedCaseId || study.id === activeCase?.id;
              return (
                <div
                  key={study.id}
                  onClick={() => setSelectedCaseId(study.id)}
                  className={`group rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01] cursor-pointer text-left relative ${
                    isSelected
                      ? "bg-gradient-to-br from-[#0c0926] to-[#040212] border-cyan-500/30 shadow-[0_10px_30px_-5px_rgba(6,182,212,0.12)]"
                      : "glass-panel border-white/5 hover:border-white/10 hover:bg-white/5 bg-[#030014]/65"
                  }`}
                >
                  {/* Selected neon light indicators */}
                  {isSelected && (
                    <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}

                  <span className="block font-sans text-[11px] font-bold text-[#06b6d4] uppercase tracking-wider">
                    {study.category}
                  </span>
                  
                  <h3 className="font-display font-medium text-base text-white mt-1 group-hover:text-cyan-400 transition-colors">
                    {study.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-sans text-xs text-gray-400">
                      Client: <strong className="text-gray-200">{study.client}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-gray-500">
                      {study.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High-Tech Growth Performance Dashboard (lg:col-span-7) */}
          {activeCase && (
            <div className="lg:col-span-7 glass-panel border border-white/10 rounded-2xl glow-card-cyan p-6 sm:p-8 relative bg-[#06041c]/50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
              
              {/* Dashboard Header Hud */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-cyan-400" />
                    <span className="font-display font-bold text-lg text-white">Campaign Audit</span>
                  </div>
                  <span className="font-sans text-xs text-gray-400">
                    Audit summary for <strong className="text-cyan-400">{activeCase.client}</strong>
                  </span>
                </div>

                {/* Highlight Counter Box */}
                <div className="glass-panel border border-cyan-400/20 bg-cyan-400/5 px-4.5 py-2.5 rounded-xl flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 bg-[#030014]/50">
                  <span className="block font-mono text-[9px] text-gray-400 uppercase tracking-widest leading-none">
                    Impact Scale
                  </span>
                  <span className="block font-mono text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent mt-1 leading-none">
                    {activeCase.highlightMetric}
                  </span>
                  <span className="block font-sans text-[10px] text-gray-500 tracking-tight leading-none mt-1">
                    {activeCase.highlightLabel}
                  </span>
                </div>
              </div>

              {/* Strategy narrative */}
              <div className="space-y-4 mb-8">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#06b6d4] uppercase font-semibold">The Obstacle</span>
                  <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed mt-1">{activeCase.challenge}</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#a855f7] uppercase font-semibold">The Growth Protocol</span>
                  <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed mt-1">{activeCase.strategy}</p>
                </div>
              </div>

              {/* D3 Graphical Visualization Container */}
              {activeCase.chartData && activeCase.chartData.length > 0 && (
                <div className="bg-[#040212]/60 rounded-xl border border-white/5 p-4 mb-8 relative">
                  <span className="absolute top-3 left-4 font-mono text-[9px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 pointer-events-none text-cyan-400">
                    <TrendingUp className="h-3 w-3 text-cyan-500 animate-pulse" />
                    Live Inbound Curve
                  </span>
                  <div className="pt-6">
                    <MetricChart data={activeCase.chartData} color="#06b6d4" />
                  </div>
                </div>
              )}

              {/* Audit Results bullets */}
              <div className="space-y-3.5 border-t border-white/5 pt-6">
                <span className="block font-mono text-[10px] uppercase text-gray-500 tracking-wider font-semibold">Campaign Metrics Achieved</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(activeCase.results || []).map((result, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-left">
                      <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="font-sans text-xs text-gray-300 leading-snug">
                        {result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
