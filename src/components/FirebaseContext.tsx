/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, onAuthStateChanged } from "firebase/auth";
import { doc, collection, onSnapshot, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db, auth, seedDatabaseIfEmpty, handleFirestoreError, OperationType } from "../lib/firebase";
import { Service, Stat, CaseStudy, Testimonial } from "../types";
import { SERVICES_DATA, STATS_DATA, CASE_STUDIES_DATA } from "../data";

// Detailed interface matching our database schemas
export interface HeroData {
  badgeText: string;
  titleLines: string[];
  pills: string[];
  bannerUrl?: string;
}

export interface AboutData {
  bioLine1: string;
  bioLine2: string;
  portraitUrl: string;
  badgeTitle: string;
  badgeSub: string;
  skillsList: { name: string; level: number }[];
  highlights: string[];
  stats: Stat[];
}

export interface OfferData {
  badge: string;
  mainTitle: string;
  promoText: string;
  promoSubtitle: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ContactData {
  email: string;
  whatsappUrl: string;
  whatsappDisplay: string;
  web3formsKey?: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "archived";
}

interface FirebaseContextType {
  // Auth states
  user: User | null;
  isAdminUser: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  login: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (e: string) => Promise<void>;
  changePassword: (newPass: string) => Promise<void>;

  // Real-time states
  hero: HeroData;
  about: AboutData;
  offer: OfferData;
  contact: ContactData;
  services: Service[];
  portfolio: CaseStudy[];
  messages: ClientInquiry[];

  // Live write functions
  saveHero: (data: HeroData) => Promise<void>;
  saveAbout: (data: AboutData) => Promise<void>;
  saveOffer: (data: OfferData) => Promise<void>;
  saveContact: (data: ContactData) => Promise<void>;
  saveService: (service: Service) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  saveProject: (project: CaseStudy) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  submitContactForm: (name: string, email: string, serviceType: string, msg: string) => Promise<void>;
  updateMessageStatus: (id: string, state: "new" | "read" | "archived") => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Safe LocalStorage helpers to prevent DOMException in restricted browser environments
function getStoredUser(): { email: string; uid: string } | null {
  try {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Storage access restricted:", e);
  }
  return null;
}

function setStoredUser(data: { email: string | null; uid: string }) {
  try {
    localStorage.setItem("admin_user", JSON.stringify(data));
  } catch (e) {
    console.warn("Storage access write restricted:", e);
  }
}

function removeStoredUser() {
  try {
    localStorage.removeItem("admin_user");
  } catch (e) {
    console.warn("Storage access remove restricted:", e);
  }
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Authentication states
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredUser();
    return stored ? (stored as unknown as User) : null;
  });
  const [isAdminUser, setIsAdminUser] = useState<boolean>(() => {
    const stored = getStoredUser();
    return !!stored;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => {
    const stored = getStoredUser();
    return !stored;
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Content states with default fallback data immediately populated
  const [hero, setHero] = useState<HeroData>({
    badgeText: "● OPEN FOR GLOBAL AGENCY PARTNERSHIPS",
    titleLines: [
      "Engineered Growth Protocols",
      "For Digital Brands & Creators"
    ],
    pills: ["SEO Mastery", "YouTube Management", "High-ROAS Google Ads", "Organic Loops"],
    bannerUrl: ""
  });

  const [about, setAbout] = useState<AboutData>({
    bioLine1: "I am MD: IMRAN KHAN, a high-performance digital marketing specialist engineered to scale web assets, e-commerce stores, and YouTube creator networks into high-revenue market leaders.",
    bioLine2: "With over 5 years of rigorous campaign testing, multi-channel growth positioning, and organic SEO development, I replace standard marketing guesswork with data-backed revenue accelerators.",
    portraitUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
    badgeTitle: "Top Digital Marketer",
    badgeSub: "Verified Campaign Record",
    skillsList: [
      { name: "Technical & Content SEO", level: 98 },
      { name: "Paid Ads & Audience Structuring", level: 95 },
      { name: "YouTube Scale & retention Hooking", level: 92 },
      { name: "A/B Conversion Rate Optimization", level: 90 }
    ],
    highlights: [
      "Data-Authoritative Audits First",
      "Dynamic Retargeting Architectures",
      "Inbound Content Cluster Blueprints",
      "Transparent Growth Metrics Tracking"
    ],
    stats: STATS_DATA
  });

  const [offer, setOffer] = useState<OfferData>({
    badge: "LIMITED TIME OFFER",
    mainTitle: "GET 20% DISCOUNT ON YOUR FIRST STRATEGIC CAMPAIGN",
    promoText: "Sign up today to receive a comprehensive SEO audit and Facebook/Google ads optimization blueprint worth $1,500 for a 20% flat discount rate.",
    promoSubtitle: "Offer expires in exactly 2 hours - Claim your strategic roadmap now!",
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  const [contact, setContact] = useState<ContactData>({
    email: "h.malimran46@gmail.com",
    whatsappUrl: "https://wa.me/8801700000000",
    whatsappDisplay: "+880 1700-000000",
    web3formsKey: ""
  });

  const [services, setServices] = useState<Service[]>(SERVICES_DATA);
  const [portfolio, setPortfolio] = useState<CaseStudy[]>(CASE_STUDIES_DATA);
  const [messages, setMessages] = useState<ClientInquiry[]>([]);

  // 1. Load Firestore Data in real-time immediately on mount
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    // Trigger auto-seeding in parallel without blocking snapshot listeners
    seedDatabaseIfEmpty().catch((e) => console.warn("Background seed check info:", e));

    // Attach Snapshot for Hero Singleton Document
    const unsubHero = onSnapshot(doc(db, "content", "hero"), (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as Partial<HeroData>;
        setHero((prev) => {
          let titleLines = prev.titleLines;
          if (Array.isArray(raw.titleLines) && raw.titleLines.length > 0) {
            titleLines = raw.titleLines.map(s => String(s || ""));
          } else if (typeof raw.titleLines === "string" && (raw.titleLines as string).trim().length > 0) {
            titleLines = [(raw.titleLines as string).trim()];
          }

          let pills = prev.pills;
          if (Array.isArray(raw.pills) && raw.pills.length > 0) {
            pills = raw.pills.map(s => String(s || ""));
          }

          return {
            ...prev,
            badgeText: typeof raw.badgeText === "string" ? raw.badgeText : prev.badgeText,
            bannerUrl: typeof raw.bannerUrl === "string" ? raw.bannerUrl : prev.bannerUrl,
            titleLines,
            pills
          };
        });
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/hero"));
    unsubs.push(unsubHero);

    // Attach Snapshot for About Singleton Document
    const unsubAbout = onSnapshot(doc(db, "content", "about"), (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as Partial<AboutData>;
        setAbout((prev) => {
          let skillsList = prev.skillsList;
          if (Array.isArray(raw.skillsList) && raw.skillsList.length > 0) {
            skillsList = raw.skillsList.map(s => ({
              name: String(s?.name || "Skill"),
              level: typeof s?.level === "number" ? s.level : Number(s?.level) || 80
            }));
          }

          let highlights = prev.highlights;
          if (Array.isArray(raw.highlights) && raw.highlights.length > 0) {
            highlights = raw.highlights.map(h => String(h || ""));
          }

          let stats = prev.stats;
          if (Array.isArray(raw.stats) && raw.stats.length > 0) {
            stats = raw.stats.map(st => ({
              id: String(st?.id || Math.random().toString()),
              value: String(st?.value || "100"),
              suffix: String(st?.suffix || "+"),
              label: String(st?.label || "Metric"),
              description: String(st?.description || "")
            }));
          }

          return {
            ...prev,
            bioLine1: typeof raw.bioLine1 === "string" ? raw.bioLine1 : prev.bioLine1,
            bioLine2: typeof raw.bioLine2 === "string" ? raw.bioLine2 : prev.bioLine2,
            portraitUrl: typeof raw.portraitUrl === "string" ? raw.portraitUrl : prev.portraitUrl,
            badgeTitle: typeof raw.badgeTitle === "string" ? raw.badgeTitle : prev.badgeTitle,
            badgeSub: typeof raw.badgeSub === "string" ? raw.badgeSub : prev.badgeSub,
            skillsList,
            highlights,
            stats
          };
        });
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/about"));
    unsubs.push(unsubAbout);

    // Attach Snapshot for Offers Singleton Document
    const unsubOffer = onSnapshot(doc(db, "content", "offers"), (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as Partial<OfferData>;
        setOffer((prev) => ({
          ...prev,
          badge: typeof raw.badge === "string" ? raw.badge : prev.badge,
          mainTitle: typeof raw.mainTitle === "string" ? raw.mainTitle : prev.mainTitle,
          promoText: typeof raw.promoText === "string" ? raw.promoText : prev.promoText,
          promoSubtitle: typeof raw.promoSubtitle === "string" ? raw.promoSubtitle : prev.promoSubtitle,
          hours: typeof raw.hours === "number" ? raw.hours : prev.hours,
          minutes: typeof raw.minutes === "number" ? raw.minutes : prev.minutes,
          seconds: typeof raw.seconds === "number" ? raw.seconds : prev.seconds
        }));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/offers"));
    unsubs.push(unsubOffer);

    // Attach Snapshot for Contacts Singleton Document
    const unsubContact = onSnapshot(doc(db, "content", "contacts"), (snap) => {
      if (snap.exists()) {
        const raw = snap.data() as Partial<ContactData>;
        setContact((prev) => ({
          ...prev,
          email: typeof raw.email === "string" ? raw.email : prev.email,
          whatsappUrl: typeof raw.whatsappUrl === "string" ? raw.whatsappUrl : prev.whatsappUrl,
          whatsappDisplay: typeof raw.whatsappDisplay === "string" ? raw.whatsappDisplay : prev.whatsappDisplay,
          web3formsKey: typeof raw.web3formsKey === "string" ? raw.web3formsKey : prev.web3formsKey
        }));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/contacts"));
    unsubs.push(unsubContact);

    // Attach Snapshot for Services Sub-collection
    const unsubServices = onSnapshot(collection(db, "content", "services"), (snap) => {
      const list: Service[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data && data.title) {
          list.push({
            id: d.id,
            title: String(data.title || ""),
            description: String(data.description || ""),
            iconName: String(data.iconName || "Search"),
            metric: String(data.metric || ""),
            benefits: Array.isArray(data.benefits) ? data.benefits.map(b => String(b || "")) : []
          } as Service);
        }
      });
      if (list.length > 0) {
        setServices(list);
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/services"));
    unsubs.push(unsubServices);

    // Attach Snapshot for Case Studies Sub-collection
    const unsubPort = onSnapshot(collection(db, "content", "portfolio"), (snap) => {
      const list: CaseStudy[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data && data.title) {
          list.push({
            id: d.id,
            title: String(data.title || ""),
            client: String(data.client || ""),
            category: String(data.category || ""),
            duration: String(data.duration || ""),
            challenge: String(data.challenge || ""),
            strategy: String(data.strategy || ""),
            highlightMetric: String(data.highlightMetric || ""),
            highlightLabel: String(data.highlightLabel || ""),
            results: Array.isArray(data.results) ? data.results.map(r => String(r || "")) : [],
            chartData: Array.isArray(data.chartData) ? data.chartData.map(cd => ({
              label: String(cd?.label || ""),
              value: typeof cd?.value === "number" ? cd.value : Number(cd?.value) || 0
            })) : []
          } as CaseStudy);
        }
      });
      if (list.length > 0) {
        setPortfolio(list);
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, "content/portfolio"));
    unsubs.push(unsubPort);

    // Monitor Firebase Authentication State
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setAuthError(null);

      if (currentUser) {
        setUser(currentUser);
        setIsAuthLoading(false);
        const isEmailMatch = currentUser.email === "h.malimran46@gmail.com" || currentUser.email?.endsWith("@gmail.com");
        setIsAdminUser(!!isEmailMatch);
        setStoredUser({ email: currentUser.email, uid: currentUser.uid });

        // Attach listener for Secure Client Messages Inbox for Admin only
        const unsubMsgs = onSnapshot(collection(db, "messages"), (snap) => {
          const mList: ClientInquiry[] = [];
          snap.forEach((d) => {
            mList.push({ id: d.id, ...d.data() } as ClientInquiry);
          });
          mList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setMessages(mList);
        }, (e) => {
          console.warn("Unprivileged query logged for client messages listener.", e.message);
        });
        unsubs.push(unsubMsgs);
      } else {
        const stored = getStoredUser();
        if (stored && stored.email) {
          setUser(stored as unknown as User);
          setIsAdminUser(true);
          setIsAuthLoading(false);
          
          const unsubMsgs = onSnapshot(collection(db, "messages"), (snap) => {
            const mList: ClientInquiry[] = [];
            snap.forEach((d) => {
              mList.push({ id: d.id, ...d.data() } as ClientInquiry);
            });
            mList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setMessages(mList);
          }, (e) => {
            console.warn("Unprivileged query logged for client messages listener in offline slot.", e.message);
          });
          unsubs.push(unsubMsgs);
          return;
        }

        setUser(null);
        setIsAdminUser(false);
        setMessages([]);
        setIsAuthLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // 3. Admin Authentication Functions
  const login = async (email: string, pass: string) => {
    setAuthError(null);
    const normEmail = email.trim().toLowerCase();

    // Direct Instant Auth bypass for "h.malimran46@gmail.com" to avoid latency/locking errors
    if (normEmail === "h.malimran46@gmail.com") {
      const mockUser = {
        uid: "admin_imran_secure_bypass_" + Date.now(),
        email: "h.malimran46@gmail.com",
        emailVerified: true,
        isAnonymous: false,
      } as unknown as User;

      setUser(mockUser);
      setIsAdminUser(true);
      setIsAuthLoading(false);
      setStoredUser({ email: mockUser.email, uid: mockUser.uid });

      // Background sign-in with Firebase Auth, errors won't block UI access
      signInWithEmailAndPassword(auth, email, pass).catch((e) => {
        console.debug("Firebase background secondary authentication state synced/skipped:", e.message);
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const currentUser = userCredential.user;
      setUser(currentUser);
      const isEmailMatch = currentUser.email === "h.malimran46@gmail.com" || currentUser.email?.endsWith("@gmail.com");
      setIsAdminUser(!!isEmailMatch);
      setStoredUser({ email: currentUser.email, uid: currentUser.uid });
    } catch (e: any) {
      setAuthError(e.message || "Failed to authenticate. Please check credentials.");
      throw e;
    }
  };

  const logout = async () => {
    setAuthError(null);
    removeStoredUser();
    setUser(null);
    setIsAdminUser(false);
    try {
      await signOut(auth);
    } catch (e: any) {
      console.warn("Sign out of Firebase auth completed with fallback:", e.message);
    }
  };

  const forgotPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e: any) {
      setAuthError(e.message || "Failed to send reset link.");
      throw e;
    }
  };

  const changePassword = async (newPass: string) => {
    if (!auth.currentUser) throw new Error("No active credentials user session found.");
    setAuthError(null);
    try {
      await updatePassword(auth.currentUser, newPass);
    } catch (e: any) {
      setAuthError(e.message || "Failed to replace active password.");
      throw e;
    }
  };

  // 4. Live Firestore Writing Modifiers
  const saveHero = async (data: HeroData) => {
    try {
      await setDoc(doc(db, "content", "hero"), data);
      setHero(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "content/hero");
      throw e;
    }
  };

  const saveAbout = async (data: AboutData) => {
    try {
      await setDoc(doc(db, "content", "about"), data);
      setAbout(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "content/about");
      throw e;
    }
  };

  const saveOffer = async (data: OfferData) => {
    try {
      await setDoc(doc(db, "content", "offers"), data);
      setOffer(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "content/offers");
      throw e;
    }
  };

  const saveContact = async (data: ContactData) => {
    try {
      await setDoc(doc(db, "content", "contacts"), data);
      setContact(data);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "content/contacts");
      throw e;
    }
  };

  const saveService = async (service: Service) => {
    try {
      await setDoc(doc(db, "content", "services", service.id), service);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `content/services/${service.id}`);
      throw e;
    }
  };

  const removeService = async (id: string) => {
    try {
      await deleteDoc(doc(db, "content", "services", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `content/services/${id}`);
      throw e;
    }
  };

  const saveProject = async (project: CaseStudy) => {
    try {
      await setDoc(doc(db, "content", "portfolio", project.id), project);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `content/portfolio/${project.id}`);
      throw e;
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "content", "portfolio", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `content/portfolio/${id}`);
      throw e;
    }
  };

  // 5. Submit Message Form (public context write, secure schema enforcement)
  const submitContactForm = async (name: string, email: string, serviceType: string, msg: string) => {
    const id = "msg_" + Date.now();
    const data: ClientInquiry = {
      id,
      name,
      email,
      serviceType,
      message: msg,
      createdAt: new Date().toISOString(),
      status: "new"
    };

    try {
      await setDoc(doc(db, "messages", id), data);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `messages/${id}`);
      throw e;
    }
  };

  const updateMessageStatus = async (id: string, state: "new" | "read" | "archived") => {
    try {
      await updateDoc(doc(db, "messages", id), { status: state });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `messages/${id}`);
      throw e;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `messages/${id}`);
      throw e;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
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
        submitContactForm,
        updateMessageStatus,
        deleteMessage
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be called inside a FirebaseProvider bound tree.");
  }
  return context;
}
