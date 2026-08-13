/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from "react";
import {
  X,
  Lock,
  Mail,
  Send,
  LayoutDashboard,
  FileText,
  Briefcase,
  Flame,
  MessageSquare,
  Key,
  LogOut,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Check,
  Trash2,
  PlusCircle,
  Eye,
  RefreshCw,
  Archive,
  Star,
  CheckCircle,
  Clock,
  UserCheck,
  Upload
} from "lucide-react";
import { useFirebase, HeroData, AboutData, OfferData, ContactData } from "./FirebaseContext";
import { Service, CaseStudy } from "../types";
import { uploadImageToStorage } from "../lib/firebase";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const {
    user,
    isAdminUser,
    isAuthLoading,
    authError,
    login,
    logout,
    forgotPassword,
    changePassword,
    hero,
    about,
    offer,
    contact,
    services,
    portfolio,
    messages,
    saveHero,
    saveAbout,
    saveOffer,
    saveContact,
    saveService,
    removeService,
    saveProject,
    removeProject,
    updateMessageStatus,
    deleteMessage
  } = useFirebase();

  // Navigation Admin Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "heroAbout" | "services" | "projects" | "offers" | "inbox" | "security">("overview");

  // Credentials form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Profile setup states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hero customizer state
  const [heroBadge, setHeroBadge] = useState("");
  const [heroTitle1, setHeroTitle1] = useState("");
  const [heroTitle2, setHeroTitle2] = useState("");
  const [heroPillStr, setHeroPillStr] = useState("");
  const [heroBanner, setHeroBanner] = useState("");

  // About customizer state
  const [aboutBio1, setAboutBio1] = useState("");
  const [aboutBio2, setAboutBio2] = useState("");
  const [aboutPortrait, setAboutPortrait] = useState("");
  const [aboutBadgeTitle, setAboutBadgeTitle] = useState("");
  const [aboutBadgeSub, setAboutBadgeSub] = useState("");
  const [skillsJson, setSkillsJson] = useState("");
  const [highlightsJson, setHighlightsJson] = useState("");

  // Contact info state
  const [contactEmail, setContactEmail] = useState("");
  const [contactWa, setContactWa] = useState("");
  const [contactWaDisplay, setContactWaDisplay] = useState("");
  const [contactWeb3formsKey, setContactWeb3formsKey] = useState("");

  // Statistics counters state
  const [statsJson, setStatsJson] = useState("");

  // Services edit states
  const [newService, setNewService] = useState<Partial<Service>>({
    id: "",
    title: "",
    description: "",
    iconName: "Search",
    benefits: [],
    metric: ""
  });
  const [benefitInput, setBenefitInput] = useState("");

  // Project case studies edit states
  const [newProject, setNewProject] = useState<Partial<CaseStudy>>({
    id: "",
    title: "",
    client: "",
    category: "",
    duration: "",
    challenge: "",
    strategy: "",
    highlightMetric: "",
    highlightLabel: "",
    results: [],
    chartData: []
  });
  const [resultInput, setResultInput] = useState("");
  const [chartLabels, setChartLabels] = useState("Month 1, Month 2, Month 3, Month 4, Month 5, Month 6");
  const [chartValues, setChartValues] = useState("10, 25, 45, 90, 150, 220");

  // Offers state
  const [offerBadge, setOfferBadge] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerText, setOfferText] = useState("");
  const [offerSubText, setOfferSubText] = useState("");
  const [offerHours, setOfferHours] = useState(2);
  const [offerMins, setOfferMins] = useState(0);

  // Status warnings
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Tab-specific success / error states with beautiful localized alerts
  const [successHero, setSuccessHero] = useState<string | null>(null);
  const [successAbout, setSuccessAbout] = useState<string | null>(null);
  const [successServices, setSuccessServices] = useState<string | null>(null);
  const [successProjects, setSuccessProjects] = useState<string | null>(null);
  const [successOffers, setSuccessOffers] = useState<string | null>(null);
  const [successSecurity, setSuccessSecurity] = useState<string | null>(null);

  const [errorHero, setErrorHero] = useState<string | null>(null);
  const [errorAbout, setErrorAbout] = useState<string | null>(null);
  const [errorServices, setErrorServices] = useState<string | null>(null);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [errorOffers, setErrorOffers] = useState<string | null>(null);
  const [errorSecurity, setErrorSecurity] = useState<string | null>(null);

  const [aboutSaving, setAboutSaving] = useState(false);

  // Populate data when available
  useEffect(() => {
    if (hero) {
      setHeroBadge(hero.badgeText || "");
      setHeroTitle1(hero.titleLines?.[0] || "");
      setHeroTitle2(hero.titleLines?.[1] || "");
      setHeroPillStr(hero.pills?.join(", ") || "");
      setHeroBanner(hero.bannerUrl || "");
    }
    if (about) {
      setAboutBio1(about.bioLine1 || "");
      setAboutBio2(about.bioLine2 || "");
      setAboutPortrait(about.portraitUrl || "");
      setAboutBadgeTitle(about.badgeTitle || "");
      setAboutBadgeSub(about.badgeSub || "");
      setSkillsJson(JSON.stringify(about.skillsList || [], null, 2));
      setHighlightsJson(JSON.stringify(about.highlights || [], null, 2));
      setStatsJson(JSON.stringify(about.stats || [], null, 2));
    }
    if (contact) {
      setContactEmail(contact.email || "h.malimran46@gmail.com");
      setContactWa(contact.whatsappUrl || "https://wa.me/8801700000000");
      setContactWaDisplay(contact.whatsappDisplay || "+880 1700-000000");
      setContactWeb3formsKey(contact.web3formsKey || "");
    }
    if (offer) {
      setOfferBadge(offer.badge || "");
      setOfferTitle(offer.mainTitle || "");
      setOfferText(offer.promoText || "");
      setOfferSubText(offer.promoSubtitle || "");
      setOfferHours(offer.hours ?? 2);
      setOfferMins(offer.minutes ?? 0);
    }
  }, [hero, about, contact, offer]);

  // Auth logins
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginLoading(true);
    setForgotSent(false);
    try {
      await login(email, password);
    } catch (_) {
      // Handled globally
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      alert("Please specify your email in the Email Input field first.");
      return;
    }
    try {
      await forgotPassword(email);
      setForgotSent(true);
    } catch (e: any) {
      alert(e.message || "Failed to trigger reset email verification link.");
    }
  };

  // Profile Password setups
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      alert("Passwords mismatch! Please double check.");
      return;
    }
    try {
      await changePassword(newPassword);
      setProfileSuccess("Active profile password updated cleanly!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      alert(e.message || "Unexpected authentication lockout encountered.");
    }
  };

  // Content savers
  const handleSaveHero = async () => {
    setSuccessHero(null);
    setErrorHero(null);
    setSaveStatus("Saving hero elements...");
    const parsedPills = heroPillStr.split(",").map(p => p.trim()).filter(Boolean);
    try {
      let resolvedBannerUrl = heroBanner;
      if (heroBanner && heroBanner.startsWith("data:image")) {
        setSaveStatus("Uploading hero banner to Firebase Cloud Storage...");
        const fileName = `hero/banner_${Date.now()}.jpg`;
        resolvedBannerUrl = await uploadImageToStorage(heroBanner, fileName);
      }

      const updated: HeroData = {
        badgeText: heroBadge,
        titleLines: [heroTitle1, heroTitle2],
        pills: parsedPills,
        bannerUrl: resolvedBannerUrl
      };

      await saveHero(updated);
      setSaveStatus("Hero parameters synced dynamically!");
      setSuccessHero("Changes Saved Successfully");
      setTimeout(() => setSaveStatus(null), 3500);
      setTimeout(() => setSuccessHero(null), 5000);
    } catch (e: any) {
      setSaveStatus(`Failed write: ${e.message}`);
      setErrorHero(e.message || "Failed to update Hero branding.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleOptimizedImageUpload = (file: File, type: "portrait" | "banner", onSuccess: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Invalid file format. Please upload a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }

    setSaveStatus(`Optimizing and fitting uploaded ${type} image...`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Portrait gets 600px max, banner gets 1200px max
        const limitSize = type === "portrait" ? 600 : 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > limitSize) {
            height *= limitSize / width;
            width = limitSize;
          }
        } else {
          if (height > limitSize) {
            width *= limitSize / height;
            height = limitSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          onSuccess(compressedDataUrl);
          setSaveStatus(`Succeeded: ${type === "portrait" ? "Profile picture" : "Banner image"} fitted & optimized! Click save below.`);
          setTimeout(() => setSaveStatus(null), 3500);
        }
      };
      img.onerror = () => {
        setSaveStatus("Failed to render and read uploaded image file.");
        setTimeout(() => setSaveStatus(null), 3000);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAboutAndStats = async () => {
    setSuccessAbout(null);
    setErrorAbout(null);
    setSaveStatus("Saving about and stats data...");
    setAboutSaving(true);
    try {
      let parsedStats = [];
      let parsedSkills = [];
      let parsedHighlights = [];

      try {
        parsedStats = JSON.parse(statsJson || "[]");
      } catch (_) {
        throw new Error("Invalid Statistics JSON syntax. Please check array brackets and quotation marks.");
      }

      try {
        parsedSkills = JSON.parse(skillsJson || "[]");
      } catch (_) {
        throw new Error("Invalid Skills JSON syntax. Please check array brackets and quotation marks.");
      }

      try {
        parsedHighlights = JSON.parse(highlightsJson || "[]");
      } catch (_) {
        throw new Error("Invalid Highlights JSON syntax. Please check array brackets and quotation marks.");
      }

      let resolvedPortraitUrl = aboutPortrait;
      if (aboutPortrait && aboutPortrait.startsWith("data:image")) {
        setSaveStatus("Uploading & saving profile image...");
        const fileName = `about/portrait_imran_${Date.now()}.jpg`;
        resolvedPortraitUrl = await uploadImageToStorage(aboutPortrait, fileName);
      }

      const updated: AboutData = {
        bioLine1: aboutBio1,
        bioLine2: aboutBio2,
        portraitUrl: resolvedPortraitUrl,
        badgeTitle: aboutBadgeTitle,
        badgeSub: aboutBadgeSub,
        skillsList: parsedSkills,
        highlights: parsedHighlights,
        stats: parsedStats
      };

      await saveAbout(updated);

      // Save contact information alongside
      const updatedContact: ContactData = {
        email: contactEmail,
        whatsappUrl: contactWa,
        whatsappDisplay: contactWaDisplay,
        web3formsKey: contactWeb3formsKey
      };
      await saveContact(updatedContact);

      // Set state with final cloud/doc URL to prevent re-upload on next saves
      setAboutPortrait(resolvedPortraitUrl);

      setSaveStatus("About bio and profile image synced dynamically!");
      setSuccessAbout("Saved Successfully");
      setTimeout(() => setSaveStatus(null), 3500);
      setTimeout(() => setSuccessAbout(null), 5000);
    } catch (e: any) {
      console.error("Save About Error:", e);
      setSaveStatus(`Error saving: ${e.message}`);
      setErrorAbout(e.message || "Failed to save profile configuration. Ensure JSON values are valid arrays.");
      setTimeout(() => setSaveStatus(null), 6000);
    } finally {
      setAboutSaving(false);
    }
  };

  const handleSaveOffer = async () => {
    setSuccessOffers(null);
    setErrorOffers(null);
    setSaveStatus("Updating and syncing promotional banner campaign...");
    const updated: OfferData = {
      badge: offerBadge,
      mainTitle: offerTitle,
      promoText: offerText,
      promoSubtitle: offerSubText,
      hours: Number(offerHours),
      minutes: Number(offerMins),
      seconds: 0
    };
    try {
      await saveOffer(updated);
      setSaveStatus("Campaign details synchronized across all nodes!");
      setSuccessOffers("Changes Saved Successfully");
      setTimeout(() => setSaveStatus(null), 3500);
      setTimeout(() => setSuccessOffers(null), 5000);
    } catch (e: any) {
      setSaveStatus(`Failed write: ${e.message}`);
      setErrorOffers(e.message || "Failed to update promotional campaign.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  // Managing Services subcollection items
  const handleAddService = async () => {
    setSuccessServices(null);
    setErrorServices(null);
    if (!newService.id || !newService.title || !newService.description) {
      setErrorServices("Please ensure the service ID, Title, and Description are defined.");
      return;
    }
    const serviceToSave: Service = {
      id: newService.id,
      title: newService.title,
      description: newService.description,
      iconName: newService.iconName || "Search",
      benefits: newService.benefits || [],
      metric: newService.metric || "Top ROI"
    };

    try {
      await saveService(serviceToSave);
      setNewService({ id: "", title: "", description: "", iconName: "Search", benefits: [], metric: "" });
      setBenefitInput("");
      setSaveStatus("Service successfully created!");
      setSuccessServices("Changes Saved Successfully");
      setTimeout(() => setSaveStatus(null), 3500);
      setTimeout(() => setSuccessServices(null), 5000);
    } catch (e: any) {
      setSaveStatus(`Failed: ${e.message}`);
      setErrorServices(e.message || "Failed to add service item.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleAddBenefit = () => {
    if (!benefitInput) return;
    setNewService(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), benefitInput]
    }));
    setBenefitInput("");
  };

  // Managing CaseStudies subcollection items
  const handleAddResult = () => {
    if (!resultInput) return;
    setNewProject(prev => ({
      ...prev,
      results: [...(prev.results || []), resultInput]
    }));
    setResultInput("");
  };

  const handleAddProject = async () => {
    setSuccessProjects(null);
    setErrorProjects(null);
    if (!newProject.id || !newProject.title || !newProject.client) {
      setErrorProjects("Fill out core Project Details (ID, Title, Client, Category) first.");
      return;
    }

    // Convert CSV lists into standard ChartDataPoint structs
    const labels = chartLabels.split(",").map(l => l.trim());
    const vals = chartValues.split(",").map(v => Number(v.trim()));
    const finalChart = labels.map((l, idx) => ({
      label: l,
      value: vals[idx] || 0
    }));

    const projectToSave: CaseStudy = {
      id: newProject.id,
      title: newProject.title,
      client: newProject.client,
      category: newProject.category || "SEO",
      duration: newProject.duration || "Months",
      challenge: newProject.challenge || "",
      strategy: newProject.strategy || "",
      highlightMetric: newProject.highlightMetric || "0k+",
      highlightLabel: newProject.highlightLabel || "Growth Scale",
      results: newProject.results || [],
      chartData: finalChart
    };

    try {
      await saveProject(projectToSave);
      setNewProject({
        id: "",
        title: "",
        client: "",
        category: "",
        duration: "",
        challenge: "",
        strategy: "",
        highlightMetric: "",
        highlightLabel: "",
        results: [],
        chartData: []
      });
      setResultInput("");
      setSaveStatus("Case study portfolio loaded live successfully!");
      setSuccessProjects("Changes Saved Successfully");
      setTimeout(() => setSaveStatus(null), 3500);
      setTimeout(() => setSuccessProjects(null), 5000);
    } catch (e: any) {
      setSaveStatus(`Failed: ${e.message}`);
      setErrorProjects(e.message || "Failed to add portfolio card.");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const handleDeleteService = async (id: string) => {
    setSuccessServices(null);
    setErrorServices(null);
    try {
      await removeService(id);
      setSuccessServices("Changes Saved Successfully");
      setTimeout(() => setSuccessServices(null), 5000);
    } catch (e: any) {
      setErrorServices(e.message || "Failed to remove service.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    setSuccessProjects(null);
    setErrorProjects(null);
    try {
      await removeProject(id);
      setSuccessProjects("Changes Saved Successfully");
      setTimeout(() => setSuccessProjects(null), 5000);
    } catch (e: any) {
      setErrorProjects(e.message || "Failed to remove case study.");
    }
  };

  // Media Library Curated Presets
  const visualPresets = [
    { title: "Sleek Corporate Headshot", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
    { title: "Digital Specialist Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" },
    { title: "Agency Office Tech Table", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" },
    { title: "Global PPC Keywords Desk", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#02000c]/98 backdrop-blur-xl border border-white/5 flex flex-col overflow-hidden text-white animate-fade-in font-sans">
      {/* 1. Header hud */}
      <div className="p-5 border-b border-white/5 bg-[#070519] flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold tracking-tight text-base">MD: IMRAN KHAN CONTROL GATEWAY</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider animate-pulse">
                ● Live sync active
              </span>
            </div>
            <span className="block font-mono text-[9px] text-gray-500 tracking-wider">SECURE DATABASE OVERRIDE PANEL DEPLOYED</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {saveStatus && (
        <div className="p-3 bg-gradient-to-r from-[#06b6d4]/10 to-[#a855f7]/10 border-b border-[#06b6d4]/30 text-center text-xs font-mono tracking-wider text-cyan-400 animate-[bounce_2s_infinite]">
          {saveStatus}
        </div>
      )}

      {/* 2. AUTHENTICATION GATEWAY MODE */}
      {isAuthLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
          <span className="font-mono text-xs text-gray-400">Authenticating database session slates...</span>
        </div>
      ) : !user || !isAdminUser ? (
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md bg-[#090724]/80 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative glow-card-purple">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-t-3xl" />
            
            <div className="text-center space-y-2 mb-8 select-none">
              <span className="font-mono text-[10px] text-[#06b6d4] tracking-widest uppercase font-bold">Authority Verification</span>
              <h2 className="font-display font-bold text-2xl text-white">Administrator Login</h2>
              <p className="font-sans text-xs text-gray-500 max-w-xs mx-auto">
                Sign in to manage homepage grids, active service listings, project charts, and response messages inbox.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {authError && (
                <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs text-left leading-normal">
                  Error: {authError}
                </div>
              )}

              {forgotSent && (
                <div className="p-3.5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 text-cyan-400 text-xs text-left leading-normal">
                  Password reset link sent securely to your inbox.
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-400" htmlFor="admin-email">Admin Username (Email)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    id="admin-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. h.malimran46@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-gray-400" htmlFor="admin-password">Password</label>
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="font-mono text-[10px] text-cyan-400 hover:underline hover:text-cyan-300 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    id="admin-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-black text-xs uppercase tracking-widest font-extrabold hover:translate-y-[-1px] transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? "Verifying Credentials..." : "Authenticate Session"}
              </button>
            </form>

            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <span className="font-mono text-[9px] text-gray-600 uppercase tracking-widest">
                Owner Email: h.malimran46@gmail.com
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* 3. ACTIVE LOGGED IN WORKSPACE */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Side navigation rail */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-[#05031b] overflow-x-auto md:overflow-x-visible md:overflow-y-auto flex flex-row md:flex-col justify-between shrink-0 select-none scrollbar-none">
            <div className="p-3 md:p-4 flex flex-row md:flex-col gap-2 shrink-0 md:w-full items-center md:items-stretch overflow-x-auto md:overflow-x-visible scrollbar-none">
              <button
                onClick={() => setActiveTab("overview")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "overview" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Overview Status</span>
              </button>

              <button
                onClick={() => setActiveTab("heroAbout")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "heroAbout" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <FileText className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Hero & About Bio</span>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "services" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <Star className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Services Growth Cards</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "projects" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <Briefcase className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Portfolio Charts</span>
              </button>

              <button
                onClick={() => setActiveTab("offers")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "offers" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <Flame className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Campaign Offers</span>
              </button>

              <button
                onClick={() => setActiveTab("inbox")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                  activeTab === "inbox" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <MessageSquare className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                  <span>Client Inbox</span>
                </div>
                {messages.filter(m => m.status === "new").length > 0 && (
                  <span className="h-4.5 w-4.5 md:h-5 md:w-5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-[9px] md:text-[10px] font-bold flex items-center justify-center animate-pulse shrink-0">
                    {messages.filter(m => m.status === "new").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`shrink-0 md:w-full text-left py-2 px-3.5 md:py-3 md:px-4 rounded-xl font-sans text-[11px] md:text-xs font-semibold tracking-wide flex items-center gap-2 md:gap-3 transition-colors cursor-pointer ${
                  activeTab === "security" ? "bg-cyan-500/15 border border-[#06b6d4]/30 text-cyan-400 font-bold" : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                <Key className="h-4 w-4 md:h-4.5 md:w-4.5 text-cyan-400" />
                <span>Credentials Safety</span>
              </button>
            </div>

            <div className="p-3 md:p-4 border-t md:border-t-0 md:border-l border-white/5 bg-[#030114]/50 shrink-0 flex flex-row md:flex-col items-center justify-between gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[9px] text-gray-400 leading-none truncate max-w-[125px] font-bold">
                  {user.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[10px] md:text-xs font-sans font-bold flex items-center justify-center gap-1.5 md:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Active Work panel edit grids */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#030110]/20">
            
            {/* OVERVIEW STATUS WORKSPACE */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="p-6 rounded-2xl glass-panel border border-white/5 bg-[#090724]/40 flex flex-col md:flex-row items-center justify-between gap-6 select-none relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-white">Live Operations Dashboard</h3>
                    <p className="font-sans text-xs text-gray-400 max-w-xl">
                      MD: IMRAN KHAN, everything updated on this panel propagates globally in milliseconds. The portfolio, pricing discount banner, service descriptions, and inbox alerts are connected directly to our lightning-fast cloud cluster.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#25d366]/20 bg-[#25d366]/5 text-[#25d366] text-xs font-mono font-bold">
                    <UserCheck className="h-4 w-4 animate-pulse" />
                    Verified Admin: Active
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Stats Count 1 */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#090724]/30 relative overflow-hidden flex flex-col justify-between">
                    <span className="block font-sans text-xs text-gray-500 font-bold">Total Services Managed</span>
                    <span className="block font-mono text-3xl font-bold text-white mt-1.5">{services.length} Units</span>
                    <span className="block font-sans text-[10px] text-[#06b6d4] mt-2 font-semibold">Active in services grids</span>
                  </div>
                  {/* Stats Count 2 */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#090724]/30 relative overflow-hidden flex flex-col justify-between">
                    <span className="block font-sans text-xs text-gray-500 font-bold">Portfolio Case Studies</span>
                    <span className="block font-mono text-3xl font-bold text-white mt-1.5">{portfolio.length} Projects</span>
                    <span className="block font-sans text-[10px] text-[#06b6d4] mt-2 font-semibold font-bold">Interactive D3 curves live</span>
                  </div>
                  {/* Stats Count 3 */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#090724]/30 relative overflow-hidden flex flex-col justify-between">
                    <span className="block font-sans text-xs text-gray-500 font-bold">Secure Inquiries Received</span>
                    <span className="block font-mono text-3xl font-bold text-cyan-400 mt-1.5">{messages.length} Messages</span>
                    <span className="block font-sans text-[10px] text-purple-400 mt-2 font-bold animate-pulse">
                      {messages.filter(m => m.status === "new").length} new pending attention
                    </span>
                  </div>
                </div>

                {/* Latest client messages snippet */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-wider font-bold">Pending Inquiries Inbox Snippet</span>
                    <button
                      onClick={() => setActiveTab("inbox")}
                      className="font-mono text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Messages
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {messages.filter(m => m.status === "new").length === 0 ? (
                    <div className="py-10 text-center rounded-2xl border border-white/5 border-dashed bg-[#030014]/40 flex flex-col items-center justify-center gap-3">
                      <CheckCircle className="h-8 w-8 text-[#25d366]" />
                      <span className="font-sans text-xs text-gray-400 leading-none">Absolutely clean! No new customer queries pending.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.filter(m => m.status === "new").slice(0, 3).map((msg) => (
                        <div key={msg.id} className="p-4 rounded-xl border border-white/5 bg-[#090724]/20 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-xs font-semibold text-white">{msg.name}</span>
                              <span className="text-[10px] font-sans text-gray-400">({msg.email})</span>
                            </div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-[#06b6d4]/10 border border-[#06b6d4]/10 text-cyan-400 text-[10px] font-bold">
                              {msg.serviceType?.toUpperCase()}
                            </span>
                            <p className="font-sans text-xs text-gray-400 leading-normal line-clamp-1 italic">
                              "{msg.message}"
                            </p>
                          </div>
                          <span className="font-mono text-[9px] text-gray-500 shrink-0 select-none">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}            {/* HERO & ABOUT BIO WORKSPACE */}
            {activeTab === "heroAbout" && (
              <div className="space-y-8 animate-fade-in text-left max-w-4xl pb-10">
                
                {/* Hero Section */}
                <div className="space-y-5 bg-[#090724]/30 p-6 rounded-3xl border border-white/5 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ● Live Sync Active
                  </div>

                  <h3 className="font-display font-medium text-lg text-white border-b border-white/5 pb-2">Hero Section Branding</h3>

                  {/* Success indicator for Hero Branding */}
                  {successHero && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in select-none">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <span className="font-bold block text-emerald-300">Changes Saved Successfully</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Hero database configurations synced dynamically on live nodes.</span>
                      </div>
                    </div>
                  )}

                  {errorHero && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500/10 text-red-400 text-xs font-sans leading-normal">
                      Error: {errorHero}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="hero-badge">Pill Badge Text</label>
                    <input
                      type="text"
                      id="hero-badge"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="e.g. ● ACCEPTING NEW AGENCY PARTNERS"
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="hero-t1">Headline Primary Line</label>
                      <input
                        type="text"
                        id="hero-t1"
                        value={heroTitle1}
                        onChange={(e) => setHeroTitle1(e.target.value)}
                        placeholder="e.g. ENGINEERED GROWTH PROTOCOLS"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="hero-t2">Headline Highlight italic Word</label>
                      <input
                        type="text"
                        id="hero-t2"
                        value={heroTitle2}
                        onChange={(e) => setHeroTitle2(e.target.value)}
                        placeholder="e.g. FOR DIGITAL BRANDS"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="hero-pills">Homepage Expertise Pills (Comma-separated)</label>
                    <input
                      type="text"
                      id="hero-pills"
                      value={heroPillStr}
                      onChange={(e) => setHeroPillStr(e.target.value)}
                      placeholder="SEO, SMM, Youtube scale, Ads optimization"
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  {/* Banner Image Customizer & Drag-and-Drop */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="hero-banner">Hero Background Banner Image URL (Optional)</label>
                      <input
                        type="text"
                        id="hero-banner"
                        value={heroBanner}
                        onChange={(e) => setHeroBanner(e.target.value)}
                        placeholder="Banner image URL path..."
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Banner Presets Preview Box */}
                    <div 
                      className="relative group border border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 bg-[#030014]/40 flex flex-col items-center justify-center gap-2 transition-all duration-300 overflow-hidden cursor-pointer select-none"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = e.dataTransfer.files;
                        if (files && files[0]) {
                          handleOptimizedImageUpload(files[0], "banner", setHeroBanner);
                        }
                      }}
                      onClick={() => {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = "image/*";
                        fileInput.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          const files = target.files;
                          if (files && files[0]) {
                            handleOptimizedImageUpload(files[0], "banner", setHeroBanner);
                          }
                        };
                        fileInput.click();
                      }}
                    >
                      {heroBanner && (
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={heroBanner} 
                            alt="Banner Preview" 
                            className="w-full h-full object-cover opacity-30 filter blur-[0.5px] transition-all group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-[#030014]/50" />
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1.5">
                        <div className="h-9 w-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Upload className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="block font-sans text-xs font-semibold text-white">
                            Drag & drop background banner here
                          </span>
                          <span className="block font-sans text-[10px] text-gray-400 mt-0.5">
                            Or click to upload from folder system
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveHero}
                      className="px-6 py-3 rounded-xl bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                    >
                      <Check className="h-4 w-4" /> Save Hero settings
                    </button>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Real-time database triggers loaded
                    </span>
                  </div>
                </div>

                <div className="space-y-6 pt-6 bg-[#090724]/35 p-6 rounded-3xl border border-white/5 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ● Live Sync Active
                  </div>

                  <h3 className="font-display font-bold text-lg text-white border-b border-white/5 pb-2">Biography / About Info</h3>

                  {/* Success indicator for About Segment */}
                  {successAbout && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in select-none">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <span className="font-bold block text-emerald-300">{successAbout}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Biography details and portrait configurations synced dynamically!</span>
                      </div>
                    </div>
                  )}

                  {errorAbout && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-400/5 text-red-150 text-xs font-sans leading-normal">
                      Error: {errorAbout}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="about-bio1">Main bio text paragraph</label>
                    <textarea
                      id="about-bio1"
                      rows={3}
                      value={aboutBio1}
                      onChange={(e) => setAboutBio1(e.target.value)}
                      placeholder="About narrative..."
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="about-bio2">Supporting bio callouts</label>
                    <textarea
                      id="about-bio2"
                      rows={3}
                      value={aboutBio2}
                      onChange={(e) => setAboutBio2(e.target.value)}
                      placeholder="Bio supporting details..."
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-portrait">Profile Headshot Image URL</label>
                      <input
                        type="text"
                        id="about-portrait"
                        value={aboutPortrait}
                        onChange={(e) => setAboutPortrait(e.target.value)}
                        placeholder="Headshot URL link..."
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>

                    {/* Upload preview / image preview displays immediately */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Drag-and-Drop Column */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400">Upload Premium Headshot Image</label>
                        <div 
                          className="relative h-44 group border border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 bg-[#030014]/40 flex flex-col items-center justify-center gap-2 transition-all duration-300 overflow-hidden cursor-pointer select-none"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const files = e.dataTransfer.files;
                            if (files && files[0]) {
                              handleOptimizedImageUpload(files[0], "portrait", setAboutPortrait);
                            }
                          }}
                          onClick={() => {
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.accept = "image/*";
                            fileInput.onchange = (e) => {
                              const target = e.target as HTMLInputElement;
                              const files = target.files;
                              if (files && files[0]) {
                                handleOptimizedImageUpload(files[0], "portrait", setAboutPortrait);
                              }
                            };
                            fileInput.click();
                          }}
                        >
                          {aboutPortrait && (
                            <div className="absolute inset-0 z-0">
                              <img 
                                src={aboutPortrait} 
                                alt="Headshot Preview" 
                                className="w-full h-full object-cover opacity-20 filter blur-[0.5px] transition-all group-hover:scale-[1.02]"
                              />
                              <div className="absolute inset-0 bg-[#030014]/50" />
                            </div>
                          )}
                          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1.5">
                            <div className="h-9 w-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <span className="block font-sans text-xs font-semibold text-white">
                                Drag & drop profile picture here
                              </span>
                              <span className="block font-sans text-[10px] text-gray-400 mt-0.5">
                                Or click to upload from folder system
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Explicit Interactive Upload Preview Card */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="block text-xs font-semibold text-gray-400">Upload Image Preview</label>
                        <div className="flex-1 min-h-44 border border-white/10 rounded-2xl bg-[#030014]/40 flex flex-col items-center justify-center relative overflow-hidden group">
                          {aboutPortrait ? (
                            <>
                              <img 
                                src={aboutPortrait} 
                                alt="Live Portrait Thumbnail" 
                                className="w-full h-full object-cover grayscale-0 transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-[#02010a]/90 border border-white/5 text-[9px] font-mono text-center text-cyan-400 uppercase tracking-wider select-none font-bold">
                                Current Active Shape
                              </div>
                            </>
                          ) : (
                            <div className="text-center font-mono text-[10px] text-gray-600 uppercase p-4">
                              <span>No portrait selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Professional Image Save Button right beneath the Image Upload Area */}
                    <div className="p-4 bg-[#06b6d4]/5 border border-white/10 hover:border-cyan-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_0_15px_rgba(6,182,212,0.02)] transition-colors">
                      <div className="space-y-0.5 text-left">
                        <span className="block font-sans text-xs font-bold text-white uppercase tracking-wider">
                          {aboutPortrait && aboutPortrait.startsWith("data:image") ? "⚠️ Pending Profile Image Sync" : "Profile Image Save Control"}
                        </span>
                        <p className="font-sans text-[10px] text-gray-400 leading-normal">
                          {aboutPortrait && aboutPortrait.startsWith("data:image") 
                            ? "New custom profile picture detected! Click Save Changes to store it permanently."
                            : "Commit current headshot upload updates permanently to dynamic Cloud Storage."}
                        </p>
                      </div>
                      <button
                        type="button"
                        id="save-portrait-btn"
                        disabled={aboutSaving}
                        onClick={handleSaveAboutAndStats}
                        className={`px-5 py-2.5 rounded-xl text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                          aboutPortrait && aboutPortrait.startsWith("data:image")
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse"
                            : "bg-cyan-400 hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        }`}
                      >
                        {aboutSaving ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4.5 w-4.5" />
                        )}
                        {aboutSaving ? "Saving Image..." : "Save Changes"}
                      </button>
                    </div>

                    {/* Curated Presets Library */}
                    <div className="p-4 bg-[#090724]/40 border border-white/10 rounded-2xl">
                      <span className="block font-mono text-[9px] text-[#06b6d4] uppercase tracking-wider font-bold mb-3">
                        Curated Visual Headshots Presets Library (Click to Fast Apply)
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {visualPresets.map((preset) => (
                          <div
                            key={preset.title}
                            onClick={() => setAboutPortrait(preset.url)}
                            className={`p-2 rounded-xl border transition-all duration-300 text-center group flex flex-col items-center justify-between cursor-pointer ${
                              aboutPortrait === preset.url
                                ? "bg-cyan-500/10 border-cyan-400"
                                : "bg-[#030014] border-white/5 hover:border-cyan-400/50"
                            }`}
                          >
                            <img src={preset.url} alt="headshot mockup" className="w-12 h-12 object-cover rounded-lg mb-2 group-hover:scale-105 transition-all" />
                            <span className="font-sans text-[9px] text-gray-400 group-hover:text-cyan-400 leading-snug">{preset.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* The Explicit and Professional "Save Changes" Button requested specifically for Admin About & picture uploaders */}
                    <div className="p-4.5 bg-[#06b6d4]/5 border border-[#06b6d4]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_25px_rgba(6,182,212,0.1)] transition-all">
                      <div className="space-y-1">
                        <span className="block font-sans text-xs font-bold text-white uppercase tracking-wider">Biography & Picture Sync</span>
                        <p className="font-sans text-[11px] text-gray-400 leading-normal">
                          Permanently commit portrait edits and text modifications instantly to live database.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          disabled={aboutSaving}
                          onClick={handleSaveAboutAndStats}
                          className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-cyan-400 text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 disabled:pointer-events-none cursor-pointer font-sans"
                        >
                          {aboutSaving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4.5 w-4.5" />
                          )}
                          {aboutSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#030014] border border-white/5 font-mono text-[9px] text-[#06b6d4] font-bold uppercase tracking-tight">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse inline-block mr-1" /> Live Sync
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-bt">Portrait Float Badge Title</label>
                      <input
                        type="text"
                        id="about-bt"
                        value={aboutBadgeTitle}
                        onChange={(e) => setAboutBadgeTitle(e.target.value)}
                        placeholder="Top-Rated Freelancer"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-bs">Portrait Float Badge Subtitle</label>
                      <input
                        type="text"
                        id="about-bs"
                        value={aboutBadgeSub}
                        onChange={(e) => setAboutBadgeSub(e.target.value)}
                        placeholder="Verified Digital Marketer"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-contact-email">Corporate Email Address</label>
                      <input
                        type="text"
                        id="about-contact-email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-contact-wa">Direct WhatsApp Redirect URL</label>
                      <input
                        type="text"
                        id="about-contact-wa"
                        value={contactWa}
                        onChange={(e) => setContactWa(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="about-contact-wadisplay">WhatsApp Display Label</label>
                      <input
                        type="text"
                        id="about-contact-wadisplay"
                        value={contactWaDisplay}
                        onChange={(e) => setContactWaDisplay(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Automated Gmail Direct Inbox Notification setup block */}
                  <div className="p-4.5 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Mail className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                      <span className="block font-sans text-xs font-bold text-white uppercase tracking-wider">Automated Background Gmail Inbox Relay</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wide">Secure Sync Gate</span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-450 leading-normal">
                      Receive instant copy notifications on your Gmail <code className="text-cyan-400 font-mono">h.malimran46@gmail.com</code> completely in the background without redirections. Secure your free <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300 font-semibold">Web3Forms Access Key</a> and paste below:
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                      <input
                        type="text"
                        placeholder="e.g. 71e98822-ba30-4e5b-bebe-1f6e0b7cb93b"
                        value={contactWeb3formsKey}
                        onChange={(e) => setContactWeb3formsKey(e.target.value)}
                        className="flex-1 px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 outline-none transition-colors placeholder:text-gray-600"
                      />
                      <a
                        href="https://web3forms.com/#start"
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4.5 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/25 text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        Get Free Web3Forms Key ↗
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="skills-json">Core Skills Level Matrix JSON Array</label>
                    <textarea
                      id="skills-json"
                      rows={4}
                      value={skillsJson}
                      onChange={(e) => setSkillsJson(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-cyan-400 font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="highlights-json">Methodology Highlights List JSON Array</label>
                    <textarea
                      id="highlights-json"
                      rows={3}
                      value={highlightsJson}
                      onChange={(e) => setHighlightsJson(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-cyan-400 font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="stats-json">Professional Numerical Stats JSON Array</label>
                    <textarea
                      id="stats-json"
                      rows={4}
                      value={statsJson}
                      onChange={(e) => setStatsJson(e.target.value)}
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-cyan-400 font-mono text-xs focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={aboutSaving}
                    onClick={handleSaveAboutAndStats}
                    className="px-6 py-3.5 rounded-xl bg-[#030014] border border-cyan-400 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-95 disabled:pointer-events-none"
                  >
                    {aboutSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {aboutSaving ? "Saving Changes..." : "Save About & Statistics Configuration"}
                  </button>
                </div>
              </div>
            )}

            {/* SERVICES GROWTH CARDS WORKSPACE */}
            {activeTab === "services" && (
              <div className="space-y-8 animate-fade-in text-left max-w-4xl pb-10">
                <div className="space-y-6 bg-[#090724]/30 p-6 rounded-3xl border border-white/5 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ● Live Sync Active
                  </div>

                  <h3 className="font-display font-medium text-lg text-white border-b border-white/5 pb-2">Add New High-converting Growth Service</h3>

                  {successServices && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in select-none">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <span className="font-bold block text-emerald-300">Changes Saved Successfully</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Services configurations synced dynamically across all visitor sessions.</span>
                      </div>
                    </div>
                  )}

                  {errorServices && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-sans leading-normal">
                      Error: {errorServices}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="ser-id">Unique Service ID (lowercase)</label>
                      <input
                        type="text"
                        id="ser-id"
                        value={newService.id}
                        onChange={(e) => setNewService(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="e.g. email-marketing"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="ser-title">Service Title</label>
                      <input
                        type="text"
                        id="ser-title"
                        value={newService.title}
                        onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Cold Email Outreach"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="ser-metric">Target Outcome Metric</label>
                      <input
                        type="text"
                        id="ser-metric"
                        value={newService.metric}
                        onChange={(e) => setNewService(prev => ({ ...prev, metric: e.target.value }))}
                        placeholder="e.g. +45% Leads Acquired"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="ser-desc">Service Detailed Summary Description</label>
                      <input
                        type="text"
                        id="ser-desc"
                        value={newService.description}
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide details about PPC keywords filters..."
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="ser-icon">Lucide Selector Icon Name</label>
                      <select
                        id="ser-icon"
                        value={newService.iconName}
                        onChange={(e) => setNewService(prev => ({ ...prev, iconName: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm outline-none"
                      >
                        {["Search", "Youtube", "Share2", "TrendingUp", "FileText", "Shield", "MessageSquare", "Award", "Clock", "Mail", "Globe", "Laptop"].map(i => (
                          <option key={i} value={i} className="bg-[#0b0822] text-white">{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400">Tactics / Benefits Bullet Points</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="In-depth technical keywords review..."
                        className="flex-1 px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                      <button
                        onClick={handleAddBenefit}
                        className="px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-cyan-400 text-xs hover:border-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        Add Point
                      </button>
                    </div>
                    {(newService.benefits || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {newService.benefits?.map((b) => (
                          <span key={b} className="font-sans text-[10px] px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-md flex items-center gap-1.5">
                            {b}
                            <button
                              onClick={() => setNewService(prev => ({ ...prev, benefits: prev.benefits?.filter(item => item !== b) }))}
                              className="text-gray-400 hover:text-white"
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddService}
                    className="px-6 py-3 rounded-xl bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                  >
                    <PlusCircle className="h-4.5 w-4.5" /> Save active service grid unit
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Services Listings</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((ser) => (
                      <div key={ser.id} className="p-4 rounded-xl border border-white/5 bg-[#090724]/20 flex items-center justify-between gap-4">
                        <div>
                          <span className="block font-sans text-xs font-bold text-white leading-normal">{ser.title}</span>
                          <span className="block font-sans text-[10px] text-gray-500 mt-1">ID: {ser.id} | Icon: {ser.iconName}</span>
                        </div>
                        <button
                          onClick={() => removeService(ser.id)}
                          className="h-9.5 w-9.5 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer"
                          title="Remove Service"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO CASE STUDIES WORKSPACE */}
            {activeTab === "projects" && (
              <div className="space-y-8 animate-fade-in text-left max-w-4xl pb-10">
                <div className="space-y-6 bg-[#090724]/30 p-6 rounded-3xl border border-white/5 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ● Live Sync Active
                  </div>

                  <h3 className="font-display font-medium text-lg text-white border-b border-white/5 pb-2">Add New Client Case Study & Live Growth Chart</h3>

                  {successProjects && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in select-none">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <span className="font-bold block text-emerald-300">Changes Saved Successfully</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Portfolio case studies synced dynamically on live database curves.</span>
                      </div>
                    </div>
                  )}

                  {errorProjects && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-150 text-xs font-sans leading-normal">
                      Error: {errorProjects}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-id">Project Campaign ID</label>
                      <input
                        type="text"
                        id="cs-id"
                        value={newProject.id}
                        onChange={(e) => setNewProject(p => ({ ...p, id: e.target.value }))}
                        placeholder="e.g. case-google-ads"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-title">Campaign Title</label>
                      <input
                        type="text"
                        id="cs-title"
                        value={newProject.title}
                        onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. High-converting Lead Scale"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-client">Client Business Name</label>
                      <input
                        type="text"
                        id="cs-client"
                        value={newProject.client}
                        onChange={(e) => setNewProject(p => ({ ...p, client: e.target.value }))}
                        placeholder="e.g. Prime Tech Ltd."
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-category">Growth Domain Category</label>
                      <input
                        type="text"
                        id="cs-category"
                        value={newProject.category}
                        onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value }))}
                        placeholder="e.g. YouTube Management"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-duration">Campaign Duration scale</label>
                      <input
                        type="text"
                        id="cs-duration"
                        value={newProject.duration}
                        onChange={(e) => setNewProject(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. 6 Months Campaign"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-metric-v">Audit Highlight Metric Value</label>
                      <input
                        type="text"
                        id="cs-metric-v"
                        value={newProject.highlightMetric}
                        onChange={(e) => setNewProject(p => ({ ...p, highlightMetric: e.target.value }))}
                        placeholder="e.g. +350%"
                        className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-metric-label">Highlight Scale Label</label>
                    <input
                      type="text"
                      id="cs-metric-label"
                      value={newProject.highlightLabel}
                      onChange={(e) => setNewProject(p => ({ ...p, highlightLabel: e.target.value }))}
                      placeholder="e.g. ROI Surge Ratio Achieved"
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-challenge">The Obstacle (Challenge Detail)</label>
                    <textarea
                      id="cs-challenge"
                      rows={2}
                      value={newProject.challenge}
                      onChange={(e) => setNewProject(p => ({ ...p, challenge: e.target.value }))}
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="cs-strategy">The Growth Protocol (Strategy Detail)</label>
                    <textarea
                      id="cs-strategy"
                      rows={2}
                      value={newProject.strategy}
                      onChange={(e) => setNewProject(p => ({ ...p, strategy: e.target.value }))}
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none resize-none"
                    />
                  </div>

                  {/* D3 chart coordinates mapper */}
                  <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-4">
                    <span className="block font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                      Graphical Growth curve values mapper (Recharts/D3 parameters)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-gray-400">Chart X-Axis Labels (Comma separated list)</label>
                        <input
                          type="text"
                          value={chartLabels}
                          onChange={(e) => setChartLabels(e.target.value)}
                          placeholder="Jan, Feb, Mar, Apr, May, Jun"
                          className="w-full px-3 py-2 rounded-lg bg-[#030014] border border-white/10 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-gray-400">Chart Numeric Coordinates values (Comma separated list)</label>
                        <input
                          type="text"
                          value={chartValues}
                          onChange={(e) => setChartValues(e.target.value)}
                          placeholder="12, 19, 45, 98, 140, 280"
                          className="w-full px-3 py-2 rounded-lg bg-[#030014] border border-white/10 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400">Audit achievements bullet list</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        placeholder="Elevated organic search CTR from 2% to 11.5%..."
                        className="flex-1 px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none"
                      />
                      <button
                        onClick={handleAddResult}
                        className="px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-cyan-400 text-xs hover:border-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        Add Result
                      </button>
                    </div>
                    {(newProject.results || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {newProject.results?.map((r) => (
                          <span key={r} className="font-sans text-[10px] px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-md flex items-center gap-1.5">
                            {r}
                            <button
                              onClick={() => setNewProject(prev => ({ ...prev, results: prev.results?.filter(item => item !== r) }))}
                              className="text-gray-400 hover:text-white"
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddProject}
                    className="px-6 py-3 rounded-xl bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                  >
                    <PlusCircle className="h-4.5 w-4.5" /> Save interactive Case Study
                  </button>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <span className="font-mono text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Campaigns Portfolio</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolio.map((port) => (
                      <div key={port.id} className="p-4 rounded-xl border border-white/5 bg-[#090724]/20 flex items-center justify-between gap-4">
                        <div>
                          <span className="block font-sans text-xs font-bold text-white leading-normal">{port.title}</span>
                          <span className="block font-sans text-[10px] text-gray-500 mt-1">Client: {port.client} | Highlight: {port.highlightMetric}</span>
                        </div>
                        <button
                          onClick={() => removeProject(port.id)}
                          className="h-9.5 w-9.5 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer"
                          title="Remove Case Study"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CAMPAIGN OFFERS WORKSPACE */}
            {activeTab === "offers" && (
              <div className="space-y-8 animate-fade-in text-left max-w-3xl pb-10">
                <div className="space-y-6 bg-[#090724]/30 p-6 rounded-3xl border border-white/5 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-[#06b6d4] text-[9px] font-mono uppercase font-bold tracking-wider select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ● Live Sync Active
                  </div>

                  <div className="border-b border-white/5 pb-2">
                    <h3 className="font-display font-medium text-lg text-white">Interactive Promotional Offer Setup</h3>
                    <p className="font-sans text-xs text-gray-400 mt-1">
                      Instantly change active promotions and countdown clocks shown inside the glowing special campaign banners cards.
                    </p>
                  </div>

                  {successOffers && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in select-none">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <span className="font-bold block text-emerald-300">Changes Saved Successfully</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Promotional campaigns and active clocks updated in real-time.</span>
                      </div>
                    </div>
                  )}

                  {errorOffers && (
                    <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-00 text-xs font-sans leading-normal">
                      Error: {errorOffers}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="off-badge">Promotion badge name</label>
                    <input
                      type="text"
                      id="off-badge"
                      value={offerBadge}
                      onChange={(e) => setOfferBadge(e.target.value)}
                      placeholder="LIMITED TIME OFFER"
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="off-title">Promotion Headline Title (split with – hyphen for custom gradient overlays)</label>
                    <input
                      type="text"
                      id="off-title"
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      placeholder="LIMITED TIME OFFER – GET 20% DISCOUNT"
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="off-text">Incentive details text</label>
                    <textarea
                      id="off-text"
                      rows={3}
                      value={offerText}
                      onChange={(e) => setOfferText(e.target.value)}
                      placeholder="Promotional call-to-actions details..."
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="off-sub">Banner footer caveats stats</label>
                    <input
                      type="text"
                      id="off-sub"
                      value={offerSubText}
                      onChange={(e) => setOfferSubText(e.target.value)}
                      placeholder="*Applicable for the first 5 signups only."
                      className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                    />
                  </div>

                  {/* Always Active Status Banner */}
                  <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-400/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                      <span className="block font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                        PROMOTIONAL RUNTIME STATE: ALWAYS ACTIVE
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-300 leading-normal">
                      Countdowns and expiration timers are completely disabled. Visiting clients on the frontend will always see this promotion as <strong>LIVE & ACTIVE</strong> until you manually alter text parameters or clear active promotional banner copies.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveOffer}
                    className="px-6 py-3 rounded-xl bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                  >
                    <Check className="h-4 w-4" /> Save active promotional slates
                  </button>
                </div>
              </div>
            )}

            {/* MESSAGES SECURITY INBOX WORKSPACE */}
            {activeTab === "inbox" && (
              <div className="space-y-6 animate-fade-in text-left max-w-4xl">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-medium text-lg text-white">Interactive Client messages Inbox</h3>
                  <p className="font-sans text-xs text-gray-400 mt-1">
                    Manage direct traffic submissions registered from the public web page forms.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="py-20 text-center rounded-3xl border border-white/5 border-dashed bg-[#090724]/10 flex flex-col items-center justify-center gap-4">
                    <MessageSquare className="h-10 w-10 text-gray-600 animate-pulse" />
                    <div className="space-y-1">
                      <span className="block font-sans text-sm text-gray-300 font-semibold">Inbox is currently empty</span>
                      <span className="block font-sans text-xs text-gray-500 leading-none">Successful inquiries submitted through contacts form load here globally.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const clientMailSubject = encodeURIComponent(`Re: Inquiry regarding ${msg.serviceType?.toUpperCase()} on Imran Portfolio`);
                      const clientMailUrl = `mailto:${msg.email}?subject=${clientMailSubject}`;

                      return (
                        <div
                          key={msg.id}
                          className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden bg-[#0a082c]/40 ${
                            msg.status === "new"
                              ? "border-cyan-500/30 bg-gradient-to-tr from-[#020014] to-[#090724]"
                              : "border-white/5"
                          }`}
                        >
                          <div className="space-y-3.5 flex-1 text-left">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-sans text-sm font-bold text-white leading-none">{msg.name}</span>
                              <span className="font-sans text-xs text-cyan-400 font-semibold bg-[#06b6d4]/10 px-2.5 py-0.5 rounded-md border border-[#06b6d4]/10">
                                {msg.serviceType?.toUpperCase()}
                              </span>
                              {msg.status === "new" && (
                                <span className="h-2 w-2 rounded-full bg-[#06b6d4] animate-pulse" />
                              )}
                            </div>

                            <div className="space-y-1 font-mono text-[10px] text-gray-400 select-all">
                              <div className="flex items-center gap-1.5 break-all">
                                <Mail className="h-3.5 w-3.5 text-gray-500" />
                                {msg.email}
                              </div>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <Clock className="h-3.5 w-3.5 text-gray-500" />
                                {new Date(msg.createdAt).toLocaleString()}
                              </div>
                            </div>

                            <p className="font-sans text-sm text-gray-300 leading-relaxed bg-[#030014]/70 p-4 rounded-xl border border-white/5 select-text italic">
                              "{msg.message}"
                            </p>
                          </div>

                          <div className="flex md:flex-col items-stretch gap-2 shrink-0 w-full md:w-auto self-end md:self-start pt-2 md:pt-0">
                            {/* Gmail Action Button trigger replies */}
                            <a
                              href={clientMailUrl}
                              className="flex-1 py-2.5 px-3.5 rounded-xl bg-cyan-400 text-black text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-all cursor-pointer"
                              title="Send Email Reply via Gmail Client"
                            >
                              <Send className="h-3.5 w-3.5 text-black" />
                              Email client
                            </a>

                            {msg.status === "new" && (
                              <button
                                onClick={() => updateMessageStatus(msg.id, "read")}
                                className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#090724] border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Resolved
                              </button>
                            )}

                            {msg.status === "read" && (
                              <button
                                onClick={() => updateMessageStatus(msg.id, "archived")}
                                className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#090724] border border-white/5 text-gray-500 hover:text-gray-300 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                Archive
                              </button>
                            )}

                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="py-2.5 px-3.5 rounded-xl bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              title="Permanently Delete Message"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CREDENTIALS PASSWORD CHANGE SETUP WORKSPACE */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-fade-in text-left max-w-md pb-10">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="font-display font-medium text-lg text-white">Credentials Maintenance Panel</h3>
                  <p className="font-sans text-xs text-gray-400 mt-1">
                    Keep your session lock secure. Rotate active system profile credentials cleanly.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  {profileSuccess && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-sans flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-fade-in">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold block text-emerald-300">Changes Saved Successfully</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">{profileSuccess}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="prof-new">New Password Input</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        id="prof-new"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Must exceed 6 characters"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-400" htmlFor="prof-confirm">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        id="prof-confirm"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retype password"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm focus:border-cyan-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-all cursor-pointer flex items-center gap-2 shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                  >
                    <Key className="h-4 w-4 text-black" />
                    Rotate System Password
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
