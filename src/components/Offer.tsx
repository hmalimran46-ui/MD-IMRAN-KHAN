/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Calendar, ArrowRight, ShieldCheck, Flame } from "lucide-react";
import { useFirebase } from "./FirebaseContext";

export default function Offer() {
  const { offer } = useFirebase();

  return (
    <section id="offers" className="py-20 bg-[#030014] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#8b5cf6]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Glow Frame Card */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 glow-card-purple p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 bg-[#070422]/65">
          
          {/* Animated Background Gradients */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/15 blur-[80px] pointer-events-none" />

          {/* Symmetrical vertical grid mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_auto] pointer-events-none" />

          {/* Left Block: Offer Text & Badges */}
          <div className="relative z-10 text-center lg:text-left space-y-4 max-w-xl">
            {/* Top Red Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/20 text-[#a855f7] justify-center mx-auto lg:mx-0">
              <Flame className="h-4 w-4 fill-current text-purple-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest font-bold uppercase">
                {offer.badge || "LIMITED TIME PROMO"}
              </span>
            </div>

            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              {offer.mainTitle?.split("–")?.[0] || "LIMITED TIME OFFER"}{" "}
              <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent block sm:inline">
                {offer.mainTitle?.split("–")?.[1] || "GET 20% DISCOUNT"}
              </span>
            </h2>

            <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed pt-2">
              {offer.promoText || "Scale your organic keywords, Google PPC ROAS, or YouTube viewership stats. Book a digital marketing audits workshop this week and claim a premium 20% discount on monthly retainer contracts."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                No Setup Fees
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Guaranteed Launch Slates
              </span>
            </div>
          </div>

          {/* Right Block: Premium Status & Claim Box */}
          <div className="relative z-10 shrink-0 w-full lg:w-80 glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center bg-[#030114]/80">
            <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider font-semibold mb-4">
              Promo Status
            </span>

            {/* Glowing Active Offer Block with high-end pulse animation */}
            <div className="relative py-4 px-6 mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex flex-col items-center justify-center gap-1 w-full shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_100%)]" />
              
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase">
                  ACTIVE OFFER
                </span>
              </div>
              <span className="font-sans text-[9px] text-gray-400 tracking-wide mt-1 animate-pulse">
                Direct Consultation Open
              </span>
            </div>

            {/* Claim Contract Button */}
            <a
              href="#contact"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans text-xs font-bold tracking-wider text-black bg-white hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 group cursor-pointer"
            >
              Claim Promo Rate
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <span className="font-sans text-[10px] text-gray-500 mt-3 block">
              {offer.promoSubtitle || "*Applicable for the first 5 signups only."}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
