/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Stat, CaseStudy, Testimonial } from "./types";

export const SERVICES_DATA: Service[] = [
  {
    id: "seo",
    title: "SEO Optimization",
    description: "Rank #1 on Google searching with data-backed content optimization, extensive competitor keyword GAP audits, and premium backlink blueprints.",
    iconName: "Search",
    benefits: ["In-depth Keyword GAP Audits", "Core Web Vitals Technical SEO Fixes", "High-Authority Editorial Backlink Building"],
    metric: "Rank #1 on Google"
  },
  {
    id: "youtube",
    title: "YouTube Channel Management",
    description: "Unlock exponential viewership growth. We design high-CTR custom click-magnets, construct title psychological triggers, and optimize tags.",
    iconName: "Youtube",
    benefits: ["High-CTR Custom Thumbnail Styling", "Video Hook SEO & Playlists Re-Structuring", "Audience Retention Optimization Tracking"],
    metric: "+350% Viewer Growth"
  },
  {
    id: "smm",
    title: "Social Media Management",
    description: "Convert silent scrollers into hyper-active brand advocates. Cohesive social calendars engineered across LinkedIn, Twitter, and Facebook.",
    iconName: "Share2",
    benefits: ["Tailored Multi-Channel Brand Tone styling", "High-Volume Social Post Designing", "Community Response Workflows Setup"],
    metric: "10x Engagement Spike"
  },
  {
    id: "ads",
    title: "Facebook & Google Paid Ads",
    description: "Maximize conversion ratios on PPC. Implement precise lookalike client scoping, demographic filtering, and split-tested landing architectures.",
    iconName: "TrendingUp",
    benefits: ["Multi-variant A/B Testing Campaigns", "High-Converting Landers Designing", "Advanced Lookalike Audience Scaling"],
    metric: "5.4x Average ROAS Boost"
  },
  {
    id: "content",
    title: "Content Marketing",
    description: "High-value articles, copywritten lead magnets, and strategic email engagement flows designed to convert interest into buyer sign-ups.",
    iconName: "FileText",
    benefits: ["Conversion-Optimized Landing Page Copy", "Inbound-focused Authority Articles", "Autoresponder Sales Funnels Writing"],
    metric: "2x Funnel Conversion Rate"
  },
  {
    id: "brand",
    title: "Brand Growth Strategy",
    description: "Comprehensive positioning alignment to scale your freelance business or digital agency from entry-level to high-end market powerhouse.",
    iconName: "Shield",
    benefits: ["Strategic Competitive Moat Planning", "Omnichannel Identity Blueprints", "Premium Positioning Guides Creation"],
    metric: "Top-Tier Brand Authority"
  },
  {
    id: "engagement",
    title: "Audience Engagement",
    description: "Nurture trust continuously. Leverage direct communication, interactive feedback loops, newsletters, and polls to bolster lifetime loyalties.",
    iconName: "MessageSquare",
    benefits: ["Interactive Direct Communication Frameworks", "Automated Feedback Survey Systems", "Highly Engaging Newsletter Strategies"],
    metric: "18% Retention Spike"
  },
  {
    id: "organic",
    title: "Organic Traffic Growth",
    description: "Future-proof inbound funnels that capture high-intent visual queries constantly and organically without reliance on continuous paid spend.",
    iconName: "Award",
    benefits: ["Evergreen Strategic SEO Blueprints", "Topic Cluster Content Orchestration", "Predictive Traffic Forecast Modeling"],
    metric: "+280% Free Search Growth"
  }
];

export const STATS_DATA: Stat[] = [
  {
    id: "experience",
    label: "Professional Experience",
    value: "5+",
    suffix: " Years",
    description: "Of continuous freelancing and digital marketing campaigns."
  },
  {
    id: "clients",
    label: "Global Clients Assisted",
    value: "140+",
    suffix: " Brands",
    description: "Across USA, UK, Canada, and European tech hubs."
  },
  {
    id: "views",
    label: "YouTube Views Generated",
    value: "4.8M+",
    suffix: " Views",
    description: "Driven by hyper-targeted SEO video optimization."
  },
  {
    id: "roi",
    label: "Ad Conversions Managed",
    value: "$120k",
    suffix: "/yr",
    description: "Administered with a consistent high ROI layout."
  }
];

export const CASE_STUDIES_DATA: CaseStudy[] = [
  {
    id: "case-seo",
    title: "Organic Inbound Explosion",
    client: "Zenith E-Commerce Inc.",
    category: "SEO Optimization",
    duration: "8 Months Campaign",
    challenge: "Struggling with invisible organic discoverability and a staggering 82% reliance on rapidly inflating paid banner ad bidding.",
    strategy: "Undertook standard Technical Crawl optimization, constructed deep e-comm transactional search hubs, and orchestrated premium guest-posting networks.",
    highlightMetric: "145k+",
    highlightLabel: "Clicks / Month",
    results: [
      "Secured #1 Spot rankings for 48 premium high-intent e-commerce keywords",
      "Slipped ad dependency down from 82% to 19% while maintaining total revenue margins",
      "Completed 280% organic sales trajectory growth over 8 strategic months"
    ],
    chartData: [
      { label: "Month 1", value: 12000 },
      { label: "Month 2", value: 15400 },
      { label: "Month 3", value: 19800 },
      { label: "Month 4", value: 31200 },
      { label: "Month 5", value: 48500 },
      { label: "Month 6", value: 78900 },
      { label: "Month 7", value: 112000 },
      { label: "Month 8", value: 145000 }
    ]
  },
  {
    id: "case-youtube",
    title: "Viral Creator Network Scale",
    client: "Prime Tech Channel",
    category: "YouTube Growth",
    duration: "6 Months Campaign",
    challenge: "Stuck at 8,000 subscribers, fighting abysmal click-through rates (2.4%) and major audience drop-off in the initial 30 seconds of videos.",
    strategy: "Crafted psychological title hooks, streamlined high-contrast graphical thumbnails, and engineered customized 15-second visual intros to retain users.",
    highlightMetric: "240k+",
    highlightLabel: "Subscribers Reached",
    results: [
      "Elevated Click-Through Rate (CTR) from 2.4% to a stellar 11.8% average",
      "Accumulated 2.1M views during a 6-month organic amplification strategy",
      "Attained YouTube Play Button status after scaling past 100k subscribers in record time"
    ],
    chartData: [
      { label: "Month 1", value: 8000 },
      { label: "Month 2", value: 14200 },
      { label: "Month 3", value: 29000 },
      { label: "Month 4", value: 58000 },
      { label: "Month 5", value: 112000 },
      { label: "Month 6", value: 168000 },
      { label: "Month 7", value: 205000 },
      { label: "Month 8", value: 240000 }
    ]
  },
  {
    id: "case-ads",
    title: "High-Intent Lead Gen Scale",
    client: "Apex SaaS Platforms",
    category: "Facebook & Google Paid Ads",
    duration: "5 Months Campaign",
    challenge: "SaaS customer acquisition costs (CAC) were unprofitable at $92 per trial signup, with heavily mistargeted campaign keyword match-types.",
    strategy: "Refined match types down to exact transactional phrasing, designed dedicated responsive landing cards, and organized lookalike campaigns.",
    highlightMetric: "5.8x",
    highlightLabel: "Average Campaign ROAS",
    results: [
      "Reduced Customer Acquisition Cost (CAC) down from $92 to a neat $31",
      "Generated a total of 28,500 highly-vetted B2B product trial lead signups",
      "Maintained structured and predictable leads funnel with a 5.8x ad-spend return"
    ],
    chartData: [
      { label: "Month 1", value: 1500 },
      { label: "Month 2", value: 2200 },
      { label: "Month 3", value: 4500 },
      { label: "Month 4", value: 8900 },
      { label: "Month 5", value: 14200 },
      { label: "Month 6", value: 19800 },
      { label: "Month 7", value: 23500 },
      { label: "Month 8", value: 28500 }
    ]
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "Chief Operating Officer",
    company: "Zenith E-Commerce Inc.",
    feedback: "MD Imran Khan is an organic traffic genius. Our monthly search clicks expanded by over 1,100% under his expert technical guidance. He didn't just build links; he structured our entire inbound sales engine.",
    rating: 5,
    avatarUrl: "https://picsum.photos/seed/sarah/150/150"
  },
  {
    id: "test-2",
    name: "Alex Rivera",
    role: "Executive Producer",
    company: "Prime Tech Channel",
    feedback: "MD Imran Khan completely unlocked the YouTube algorithm puzzle for us. Our CTR skyrocketed immediately when we switched to his thumbnail concepts. Decisive, communicative, and exceptionally results-driven.",
    rating: 5,
    avatarUrl: "https://picsum.photos/seed/alex/150/150"
  },
  {
    id: "test-3",
    name: "David Thorne",
    role: "Founder & CEO",
    company: "Apex SaaS Platforms",
    feedback: "Ad spend was driving us to bankruptcy. MD Imran Khan audited our accounts, stripped the fat, restructured targeting, and brought in high-intent trialists. Our acquisition cost sank by over 60%!",
    rating: 5,
    avatarUrl: "https://picsum.photos/seed/david/150/150"
  }
];
