/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useFirebase } from "./FirebaseContext";

function getServiceIcon(name: string) {
  // Graceful fallback for icons, supporting dynamic lookup of Lucide keys
  const Icon = (LucideIcons as any)[name] || (LucideIcons as any)[name?.charAt(0).toUpperCase() + name?.slice(1)] || LucideIcons.Search;
  return Icon;
}

export default function Services() {
  const { services } = useFirebase();

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#030014] relative">
      {/* Dynamic Lighting Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-24">
          <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest font-bold">
            Services & Expertise
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight mt-3">
            Elite Digital Strategies <br className="hidden sm:inline" />
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Engineered To Convert
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-4 leading-relaxed">
            I don't just optimize systems. I construct bespoke brand funnels that scale traffic, elevate organic authority, and generate predictable business pipelines.
          </p>
        </div>

        {/* Services Grid with dynamic contents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(services || []).map((service) => {
            const IconComponent = getServiceIcon(service.iconName);
            return (
              <div
                key={service.id}
                className="group relative rounded-2xl glass-panel glass-panel-hover border border-white/5 p-6 hover:border-cyan-500/30 transition-all duration-500 flex flex-col justify-between bg-[#05031d]/60 hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(6,182,212,0.08)]"
              >
                {/* Visual Glow Gradient inside card */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/2 group-hover:to-purple-500/2 transition-colors duration-500 pointer-events-none -z-10" />

                <div>
                  {/* Icon Header */}
                  <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 text-gray-400 group-hover:text-cyan-400 flex items-center justify-center transition-all duration-300 mb-6 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105">
                    <IconComponent className="h-5.5 w-5.5" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-medium text-base text-white tracking-wide mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Checklist of benefits */}
                  <ul className="space-y-2.5 border-t border-white/5 pt-5 pb-6">
                    {(service.benefits || []).map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-left">
                        <CheckCircle className="h-3.5 w-3.5 text-cyan-500/70 shrink-0 mt-0.5" />
                        <span className="font-sans text-[11px] text-gray-300 leading-tight">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Highlight HUD */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">
                    Expected Outcome
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/10">
                    {service.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
