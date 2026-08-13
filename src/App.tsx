/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Offer from "./components/Offer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import { FirebaseProvider } from "./components/FirebaseContext";
import { SectionErrorBoundary } from "./components/ErrorBoundary";
import { Award } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Elegant agency entry loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#030014] z-[9999] flex flex-col items-center justify-center">
        {/* Particle and Glow Orbs in loader */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6">
          {/* Glowing Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-[#06b6d4] animate-spin" />
            <div className="absolute h-11 w-11 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
              <Award className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-1.5 z-10">
            <span className="block font-display font-bold tracking-widest text-[#06b6d4] text-sm uppercase">
              MD: IMRAN KHAN
            </span>
            <span className="block font-sans text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
              Digital Marketing Portfolio
            </span>
          </div>

          {/* Glowing bottom progress scale */}
          <div className="h-[2px] w-48 bg-white/5 rounded-full overflow-hidden mt-2 p-[0.5px]">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider>
      <div id="top" className="min-h-screen bg-[#030014] text-white overflow-hidden scroll-smooth selection:bg-cyan-500/30 selection:text-white">
        {/* Dynamic Back-drop Grid */}
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(6,182,212,0.12)_0%,transparent_100%)] pointer-events-none -z-10" />

        {/* Sticky Top Navbar with Admin Panel custom trigger */}
        <SectionErrorBoundary><Navbar onOpenAdmin={() => setIsAdminOpen(true)} /></SectionErrorBoundary>

        {/* Core Pages Sections Layout */}
        <main className="relative">
          <SectionErrorBoundary><Hero /></SectionErrorBoundary>
          <SectionErrorBoundary><About /></SectionErrorBoundary>
          <SectionErrorBoundary><Services /></SectionErrorBoundary>
          <SectionErrorBoundary><Portfolio /></SectionErrorBoundary>
          <SectionErrorBoundary><Offer /></SectionErrorBoundary>
          <SectionErrorBoundary><Contact /></SectionErrorBoundary>
        </main>

        {/* Footer */}
        <SectionErrorBoundary><Footer /></SectionErrorBoundary>

        {/* Luxury Overlay Panel control */}
        {isAdminOpen && (
          <SectionErrorBoundary><AdminPanel onClose={() => setIsAdminOpen(false)} /></SectionErrorBoundary>
        )}
      </div>
    </FirebaseProvider>
  );
}
