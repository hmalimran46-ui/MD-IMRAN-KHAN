/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  benefits: string[];
  metric: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  suffix: string;
  description: string;
}

export interface ChartDataPoint {
  label: string; // e.g. "Month 1", "Jan"
  value: number; // Organic clicks / subscriber count / lead count
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  duration: string;
  challenge: string;
  strategy: string;
  results: string[];
  highlightMetric: string;
  highlightLabel: string;
  chartData: ChartDataPoint[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
  avatarUrl: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  serviceType: string;
  message: string;
}
