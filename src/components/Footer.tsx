/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Facebook, Instagram, ArrowUp } from "lucide-react";

export default function Footer() {
  const socialIcons = [
    { Icon: Facebook, href: "https://www.facebook.com/mdimrankhan48?utm_source=chatgpt.com", color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10" },
    { Icon: Instagram, href: "https://www.instagram.com/md_imran.khan.1/?hl=en&utm_source=chatgpt.com", color: "hover:text-[#e1306c] hover:border-[#e1306c]/30 hover:bg-[#e1306c]/10" },
  ];

  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#030014] border-t border-white/5 py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Upper Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
          {/* Logo Brand Brand */}
          <a href="#top" onClick={handleScrollTop} className="flex items-center gap-2 group">
            <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white shadow-md">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-display font-medium text-base text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                MD: IMRAN KHAN
              </span>
              <span className="block font-sans text-[8px] tracking-widest text-[#06b6d4] uppercase font-bold leading-none mt-0.5">
                Digital Marketing Portfolio
              </span>
            </div>
          </a>

          {/* Social Icons row */}
          <div className="flex items-center gap-5">
            {socialIcons.map(({ Icon, href, color }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-500 hover:scale-110 active:scale-95 transition-all duration-300 p-2.5 rounded-full bg-white/3 border border-white/3 hover:border-white/10 hover:bg-white/5 ${color} cursor-pointer`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Scroll Top Trigger */}
          <button
            onClick={handleScrollTop}
            aria-label="Scroll target to top of viewport"
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-gray-500 hover:text-cyan-400 group cursor-pointer"
          >
            Scroll to Top
            <div className="h-7 w-7 rounded-lg border border-white/5 bg-white/3 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/20 text-gray-500 group-hover:text-cyan-400 flex items-center justify-center transition-all duration-300">
              <ArrowUp className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>

        {/* Lower Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-center md:text-left text-xs text-gray-500">
          <div>
            <span className="block font-sans">
              &copy; {currentYear} MD Imran Khan Digital Marketing Portfolio. All rights reserved.
            </span>
            <span className="block font-mono text-[10px] text-gray-600 mt-1 uppercase tracking-wider">
              Specialized Freelance Digital Marketer Portfolio
            </span>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Client Work</a>
            <a href="#offers" className="hover:text-cyan-400 transition-colors">Offers</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
