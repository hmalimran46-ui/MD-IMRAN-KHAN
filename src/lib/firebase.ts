/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  limit,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { Service, Stat, CaseStudy, Testimonial } from '../types';
import { SERVICES_DATA, STATS_DATA, CASE_STUDIES_DATA } from '../data';

// Initialize Firebase Core SDKs
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);
export const storage = getStorage(app);

// Upload string (Base64 data URL) to Firebase Storage and retrieve the download URL.
export async function uploadImageToStorage(dataUrl: string, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, dataUrl, 'data_url');
  return await getDownloadURL(storageRef);
}

// Operational Types as specified in the security/rules skill guideline
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Global Exception Mapping for Security rules Audit Trail
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.error('Firestore Secure Audit: ', JSON.stringify(errInfo));
  // Log the audit information gently; throwing inside an active onSnapshot subscriber
  // will crash the entire root React component rendering sequence, leading to blank pages.
}

// Connection Validation Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test_connection_ping', 'ping_doc'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore client is offline or starting up.");
    }
  }
}
testConnection();

// Auto-Seeding: Bootstraps the Firestore collections with beautiful default content
// if the documents do not exist. This ensures Mohammad Al Imran's website loads
// instantly with default premium state, while allowing Admins to override live.
export async function seedDatabaseIfEmpty() {
  const checkDocRef = doc(db, 'content', 'hero');
  try {
    const docSnap = await getDoc(checkDocRef);
    if (docSnap.exists()) {
      return; // Database is already seeded
    }

    console.log("Firestore content data empty. Bootstrapping dynamic portfolio seed data...");

    // 1. Seed Hero Single doc
    await setDoc(doc(db, 'content', 'hero'), {
      badgeText: "● OPEN FOR GLOBAL AGENCY PARTNERSHIPS",
      titleLines: [
        "Engineered Growth Protocols",
        "For Digital Brands & Creators"
      ],
      pills: ["SEO Mastery", "YouTube Management", "High-ROAS Google Ads", "Organic Loops"]
    });

    // 2. Seed About Single doc
    await setDoc(doc(db, 'content', 'about'), {
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

    // 3. Seed Offers Single doc
    await setDoc(doc(db, 'content', 'offers'), {
      badge: "LIMITED TIME OFFER",
      mainTitle: "GET 20% DISCOUNT ON YOUR FIRST STRATEGIC CAMPAIGN",
      promoText: "Sign up today to receive a comprehensive SEO audit and Facebook/Google ads optimization blueprint worth $1,500 for a 20% flat discount rate.",
      promoSubtitle: "Offer expires in exactly 2 hours - Claim your strategic roadmap now!",
      hours: 2,
      minutes: 0,
      seconds: 0
    });

    // 4. Seed Contacts Single doc
    await setDoc(doc(db, 'content', 'contacts'), {
      email: "h.malimran46@gmail.com",
      whatsappUrl: "https://wa.me/8801700000000",
      whatsappDisplay: "+880 1700-000000"
    });

    // 5. Seed Services Sub-Collection
    for (const service of SERVICES_DATA) {
      await setDoc(doc(db, 'content', 'services', service.id), service);
    }

    // 6. Seed Case Studies Sub-Collection
    for (const study of CASE_STUDIES_DATA) {
      await setDoc(doc(db, 'content', 'portfolio', study.id), study);
    }

    console.log("Seeding procedure completed successfully.");
  } catch (error) {
    console.error("Error setting up database content seed matches:", error);
  }
}
