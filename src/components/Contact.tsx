/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent, FormEvent } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { ContactFormData } from "../types";
import { useFirebase } from "./FirebaseContext";

export default function Contact() {
  const { contact, submitContactForm } = useFirebase();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    serviceType: "seo",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceOptions = [
    { value: "seo", label: "SEO Optimization / Audit" },
    { value: "youtube", label: "YouTube Growth Campaign" },
    { value: "smm", label: "Social Media Strategy" },
    { value: "ads", label: "Google & Meta PPC Ads" },
    { value: "brand", label: "Brand Growth Positioning" },
    { value: "all", label: "All-In-One Strategic Scale" }
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      // 1. Persist securely to Firestore database messages collection
      await submitContactForm(
        formData.name,
        formData.email,
        formData.serviceType,
        formData.message
      );

      const receiver = contact.email || "h.malimran46@gmail.com";
      const selectedService = serviceOptions.find(o => o.value === formData.serviceType)?.label || formData.serviceType;
      
      // Try background dispatch via Web3Forms if Key is registered
      const notificationKey = contact.web3formsKey || "";
      let sentViaApi = false;

      if (notificationKey) {
        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              access_key: notificationKey,
              name: formData.name,
              email: formData.email,
              subject: `[IMRAN CONTROL GATEWAY] New inquiry from ${formData.name}`,
              from_name: "MD Imran Khan Portfolio Portal",
              message: `You received a new inquiry on your website:

Name: ${formData.name}
Email: ${formData.email}
Growth Program: ${selectedService}
Date & Time: ${new Date().toLocaleString()}

Message Details:
"${formData.message}"`
            })
          });
          const apiJSON = await response.json();
          if (apiJSON.success) {
            sentViaApi = true;
          }
        } catch (apiErr) {
          console.error("Web3Forms automatic direct mailer failure: ", apiErr);
        }
      }

      setStatus("success");
      
      // Only trigger mailto popup if Web3Forms key was NOT configured or failed
      if (!sentViaApi) {
        const subject = encodeURIComponent(`[INBOX GROWTH AUDIT] from ${formData.name}`);
        const body = encodeURIComponent(
          `Hello MD: IMRAN KHAN,\n\nMy name is ${formData.name} (${formData.email}).\nI am reaching out regarding your "${selectedService}" services.\n\nMessage Details:\n"${formData.message}"\n\nKind regards,\n${formData.name}`
        );
        const mailtoUrl = `mailto:${receiver}?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
          try {
            window.location.href = mailtoUrl;
          } catch (_) {}
        }, 1500);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to submit inquiry to security gateway.");
      setStatus("error");
    }
  };

  // Safe WhatsApp Link and default constants
  const defaultEmail = "h.malimran46@gmail.com";
  const rawWa = "https://wa.me/8801986620247";
  const displayWa = "01986620247";

  // Prefill text for custom floating floating whatsapp CTA button
  const prefilledWaUrl = `${rawWa}?text=${encodeURIComponent("Hi MD Imran Khan, I'm visiting your portfolio website and would love to schedule a digital marketing consultation.")}`;

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#030014] relative">
      {/* Symmetrical dividers & glowing blur dots */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Floating Animated WhatsApp Direct contact button */}
      <a
        href={prefilledWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_35px_rgba(37,211,102,0.65)] hover:-translate-y-1 transition-all duration-300 animate-bounce active:scale-95 group cursor-pointer"
      >
        <MessageCircle className="h-7 w-7 text-white fill-current" />
        
        {/* Floating pulse wave effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25d366]/20 animate-ping -z-10" />
        <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-white font-mono text-[9px] font-bold shadow-md animate-pulse">
          1
        </span>

        {/* Hover label readout */}
        <span className="absolute right-16 bg-[#0c0926]/95 border border-white/10 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 tracking-wide shadow-xl whitespace-nowrap">
          Chat with MD: IMRAN KHAN on WhatsApp
        </span>
      </a>

      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="font-mono text-xs text-[#06b6d4] uppercase tracking-widest font-bold">
            Initiate Growth
          </span>
          <h2 className="font-display font-medium text-3xl sm:text-5xl text-white tracking-tight mt-3">
            Secure Your Free Audit <br className="hidden sm:inline" />
            <span className="font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Consultation Today
            </span>
          </h2>
          <p className="font-sans text-sm text-gray-500 max-w-xl mx-auto mt-4 leading-relaxed">
            Ready to rank higher, convert faster, and generate double the sales yields? Complete the inquiry form to register live inside my secure portal inbox.
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Card Left: Quick Contact methods */}
          <div className="lg:col-span-5 space-y-6">
            <span className="block font-mono text-[10px] uppercase text-gray-500 tracking-wider font-semibold">
              Direct Channels
            </span>

            {/* Email card Button */}
            <a
              href={`mailto:${defaultEmail}`}
              className="block glass-panel border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 bg-[#08051e]/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Email Direct
                  </span>
                  <span className="block font-sans text-sm sm:text-base text-white group-hover:text-cyan-400 font-semibold mt-1 transition-colors break-all">
                    {defaultEmail}
                  </span>
                  <span className="block font-sans text-[11px] text-gray-400 mt-1">
                    Typically responds within 4 business hours.
                  </span>
                </div>
              </div>
            </a>

            {/* WhatsApp Card inside section */}
            <a
              href={prefilledWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-panel border border-white/5 hover:border-[#25d366]/40 rounded-2xl p-6 transition-all duration-300 bg-[#08051e]/40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,211,102,0.1)] group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#25d366]/10 border border-[#25d366]/25 flex items-center justify-center text-[#25d366] shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Direct WhatsApp Link
                  </span>
                  <span className="block font-sans text-sm sm:text-base text-white group-hover:text-[#25d366] font-semibold mt-1 transition-colors">
                    {displayWa}
                  </span>
                  <span className="block font-sans text-[11px] text-gray-400 mt-1">
                    Available for immediate video consultations.
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Card Right: Contact Form */}
          <div className="lg:col-span-7 glass-panel border border-white/10 rounded-2xl glow-card-purple p-6 sm:p-8 bg-[#090724]/50">
            <span className="block font-mono text-[10px] uppercase text-gray-500 tracking-wider font-semibold mb-6">
              Launch Inquiry Form
            </span>

            {status === "idle" || status === "error" ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {status === "error" && (
                  <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs text-left leading-normal">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block font-sans text-xs font-semibold text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block font-sans text-xs font-semibold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-colors"
                  />
                </div>

                {/* Service Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="serviceType" className="block font-sans text-xs font-semibold text-gray-300">Requested Growth Service</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4.5 py-3 rounded-xl bg-[#030014] border border-white/10 text-white font-sans text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-colors cursor-pointer"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0c0926] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block font-sans text-xs font-semibold text-gray-300">Your Project Outline</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Provide a brief summary of what goals, traffic levels, or YouTube stats you plan to accelerate"
                    className="w-full px-4.5 py-3 rounded-xl bg-[#030014]/60 border border-white/10 text-white font-sans text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10 outline-none transition-colors resize-none mb-2"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest text-[#000000] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-98 transition-all duration-300 cursor-pointer"
                >
                  Submit Inquiry to Inbox
                  <Send className="h-4 w-4 text-black" />
                </button>
              </form>
            ) : status === "submitting" ? (
              <div className="text-center py-12 space-y-6 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Send className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-medium text-lg text-white">Sending Secure Message</h4>
                  <p className="font-sans text-xs text-gray-400 max-w-xs mx-auto">
                    Routing your inquiry directly to MD: IMRAN KHAN's cloud inbox...
                  </p>
                </div>
              </div>
            ) : (
              // Success visualizer
              <div className="text-center py-12 space-y-6 flex flex-col items-center justify-center animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <CheckCircle2 className="h-8 w-8 text-cyan-400" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-medium text-xl text-white">Inquiry Saved Successfully!</h4>
                  <p className="font-sans text-xs text-gray-300 max-w-sm mx-auto">
                    Thank you! Your message is now active on MD: IMRAN KHAN's personal Admin Panel Inbox. A backup email client request is also launching.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                  <a
                    href={rawWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] text-xs font-semibold hover:bg-[#25d366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="h-4.5 w-4.5" />
                    Double Check on WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setFormData({ name: "", email: "", serviceType: "seo", message: "" });
                      setStatus("idle");
                    }}
                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-sans text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
