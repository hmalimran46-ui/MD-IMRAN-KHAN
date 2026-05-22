/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Award, Lock } from "lucide-react";

interface NavbarProps {
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Offers", href: "#offers" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple intersection tracker
      const sections = ["about", "services", "portfolio", "offers", "contact"];
      let currentSection = "hero";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-brand-dark/80 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Award className="h-5 w-5 text-white" />
            </div>
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 rounded-lg bg-cyan-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-lg text-white group-hover:text-cyan-400 transition-colors duration-300">
              MD: IMRAN KHAN
            </span>
            <span className="block font-mono text-[8px] tracking-wider text-[#06b6d4] uppercase font-bold leading-none mt-0.5">
              Digital Marketing Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isSectionActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`font-sans text-sm tracking-wide transition-all duration-300 relative py-1.5 ${
                  isSectionActive
                    ? "text-cyan-400 font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
                {/* Active Indicator Underline */}
                {isSectionActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                )}
              </a>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative group/tooltip">
            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-full text-gray-400 hover:text-cyan-400 border border-white/5 bg-white/3 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all hover:scale-105 active:scale-95 duration-300 cursor-pointer flex items-center justify-center relative shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              aria-label="Admin Access Secure Gateway"
            >
              <Lock className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-6" />
              {/* Glowing active indicator dot */}
              <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400 border border-[#030014] animate-pulse" />
            </button>
            {/* Custom Tooltip */}
            <span className="absolute top-12 right-0 bg-[#090724]/95 border border-white/10 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 tracking-wide shadow-xl whitespace-nowrap z-50">
              Admin Gateway
            </span>
          </div>
          
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wider text-white bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(255,255,255,0.02)] group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:-translate-y-0.5"
          >
            Hire Now
            <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>

        {/* Mobile Actions (Admin Panel Shortcut + Hamburger Toggle) */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl text-cyan-400 border border-[#06b6d4]/25 bg-[#06b6d4]/5 hover:bg-[#06b6d4]/10 active:scale-95 transition-all text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer"
            aria-label="Admin Access Portal"
          >
            <Lock className="h-3 w-3 animate-pulse" />
            <span>Admin Panel</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-80 z-40 bg-[#040212]/98 border-l border-white/10 backdrop-blur-xl shadow-2xl p-8 transform transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <span className="font-display font-bold tracking-tight text-white">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((link) => {
            const isSectionActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-sans text-lg tracking-wide py-1 border-b border-white/5 transition-colors duration-300 ${
                  isSectionActive ? "text-cyan-400 font-semibold" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            );
          })}

          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="w-full justify-center inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-sans text-sm font-semibold tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 mt-6"
          >
            Get Started
            <ArrowUpRight className="h-4 w-4 text-white" />
          </a>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAdmin();
            }}
            className="w-full justify-center inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-400/25 bg-cyan-400/5 hover:bg-cyan-400/10 transition-all cursor-pointer mt-2"
          >
            Admin Panel Login
          </button>
        </div>
      </div>
    </nav>
  );
}
