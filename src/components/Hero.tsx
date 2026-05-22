/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { Search, Youtube, TrendingUp, Share2, ArrowRight, Facebook, Instagram } from "lucide-react";
import { useFirebase } from "./FirebaseContext";

function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      alphaSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#14b8a6"];

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      const count = Math.min(Math.floor((w * h) / 18000), 60);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 3 + 1,
          alpha: Math.random() * 0.45 + 0.1,
          alphaSpeed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;
        canvas.width = newWidth;
        canvas.height = newHeight;
        initParticles(newWidth, newHeight);
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    const initialRect = container.getBoundingClientRect();
    width = initialRect.width || window.innerWidth;
    height = initialRect.height || window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles(width, height);

    let gradientOffset = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      gradientOffset += 0.0012;
      const gradient = ctx.createRadialGradient(
        width / 2 + Math.sin(gradientOffset) * (width * 0.15),
        height / 2 + Math.cos(gradientOffset * 0.7) * (height * 0.15),
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.95
      );
      gradient.addColorStop(0, "rgba(8, 4, 38, 0.92)");
      gradient.addColorStop(0.6, "rgba(5, 2, 26, 0.98)");
      gradient.addColorStop(1, "#030014");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Aurora diagonal light streaks
      ctx.strokeStyle = "rgba(6, 182, 212, 0.025)";
      ctx.lineWidth = 140;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.15 + Math.sin(gradientOffset * 1.2) * 60);
      ctx.lineTo(width, height * 0.75 + Math.cos(gradientOffset) * 60);
      ctx.stroke();

      ctx.strokeStyle = "rgba(139, 92, 246, 0.015)";
      ctx.lineWidth = 200;
      ctx.beginPath();
      ctx.moveTo(width * 0.1 + Math.cos(gradientOffset * 0.4) * 100, 0);
      ctx.lineTo(width * 0.9 + Math.sin(gradientOffset * 0.6) * 100, height);
      ctx.stroke();

      // Connections between digital nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.08 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes with soft out-of-focus halos
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.alpha += p.alphaSpeed;
        if (p.alpha <= 0.08 || p.alpha >= 0.65) p.alphaSpeed *= -1;
        p.alpha = Math.max(0.08, Math.min(0.65, p.alpha));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.radius > 2.5) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default function Hero() {
  const { hero } = useFirebase();

  const socialIcons = [
    { Icon: Facebook, href: "https://www.facebook.com/mdimrankhan48?utm_source=chatgpt.com", color: "hover:text-[#1877f2]", label: "Facebook" },
    { Icon: Instagram, href: "https://www.instagram.com/md_imran.khan.1/?hl=en&utm_source=chatgpt.com", color: "hover:text-[#e1306c]", label: "Instagram" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-[#030014]"
    >
      {/* Cinematic Animated Background Canvas (Particles, Glowing sweep gradients, Light streaks) */}
      <CinematicBackground />

      {/* Background Banner with elegant absolute mask */}
      {hero.bannerUrl && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={hero.bannerUrl}
            alt="Mohammad Al Imran - Background Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 scale-100 select-none animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/40 via-[#030014]/85 to-[#030014]" />
        </div>
      )}
      {/* Background Decorative Neon Orbs/Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-slow mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[140px] pointer-events-none animate-pulse-slow mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[160px] pointer-events-none mix-blend-screen" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-[0.35]" />

      {/* Floating Marketing Particles (lucide-react icons built elegantly) */}
      <div className="absolute top-1/4 left-1/12 animate-float-1 hidden xl:block pointer-events-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#090720]/80 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-cyan-400">
          <Search className="h-6 w-6" />
        </div>
      </div>

      <div className="absolute top-1/3 right-1/10 animate-float-2 hidden xl:block pointer-events-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#090720]/80 border border-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.15)] text-purple-400">
          <Youtube className="h-7 w-7" />
        </div>
      </div>

      <div className="absolute bottom-1/3 left-1/8 animate-float-2 hidden xl:block pointer-events-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#090720]/80 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] text-blue-400">
          <TrendingUp className="h-6 w-6" />
        </div>
      </div>

      <div className="absolute bottom-1/4 right-1/6 animate-float-1 hidden xl:block pointer-events-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#090720]/80 border border-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.1)] text-teal-400">
          <Share2 className="h-5 w-5" />
        </div>
      </div>

      <div className="absolute top-1/2 right-[5%] animate-float-2 hidden lg:block pointer-events-none opacity-60">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a081a]/40 border border-gray-500/10 text-gray-500 text-xs font-bold">
          CPM
        </div>
      </div>
      
      <div className="absolute bottom-1/5 left-[15%] animate-float-1 hidden lg:block pointer-events-none opacity-60">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a081a]/40 border border-gray-500/10 text-gray-500 text-xs font-bold">
          ROAS
        </div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-5xl mx-auto px-6 text-center z-10 flex flex-col items-center">
        {/* Upper Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-md mb-8 group cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs tracking-wider text-gray-300 uppercase font-semibold">
            {hero.badgeText || "Accepting New Clients • High ROI Driven"}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono font-bold group-hover:translate-x-0.5 transition-transform duration-300">→</span>
        </div>

        {/* Large professional Headline */}
        <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 max-w-4xl selection:bg-cyan-500/30">
          {hero.titleLines?.[0] || "DIGITAL MARKETING"}{" "}<br className="hidden sm:inline" />
          {hero.titleLines?.[1]?.startsWith("THAT") ? "" : ""}
          <span className="font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic selection:text-white">
            {hero.titleLines?.[1] || "DRIVES REAL RESULTS"}
          </span>
          {hero.titleLines?.slice(2).map((l, i) => (
            <span key={i} className="block text-3xl sm:text-4xl text-gray-400 mt-2">{l}</span>
          ))}
        </h1>

        {/* Subheadline (Expertise Bullet Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10 max-w-2xl">
          {(hero.pills || []).map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-600 text-xs">•</span>}
              <span className="font-sans text-xs sm:text-sm text-gray-300 tracking-wide hover:text-white transition-colors">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button Set */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-sans text-sm font-bold tracking-wider text-black bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[size:200%_auto] hover:bg-[right_center] text-glow-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Get Started
            <ArrowRight className="h-4 w-4 tracking-normal group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-sans text-sm font-semibold tracking-wider text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Contact Me
          </a>
        </div>

        {/* Social Media Links with Hover Animations */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase font-semibold">
            Connect & Elevate
          </span>
          <div className="flex items-center gap-6">
            {socialIcons.map(({ Icon, href, color, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className={`p-2.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer ${color} hover:bg-white/10 hover:border-white/10`}
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Symmetrical Fader */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
    </section>
  );
}
