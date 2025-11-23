export type Role = 'user' | 'assistant';

export enum IntentType {
  PERSONAL = 'personal',
  MEDICAL = 'medical',
  SCHEMES = 'schemes', // New Intent for Financial Schemes
  EMERGENCY = 'emergency',
  GREETING = 'greeting',
  UNKNOWN = 'unknown'
}

export type ProcessingStep = 'idle' | 'detecting_intent' | 'retrieving_docs' | 'synthesizing' | 'extracting_data' | 'complete';

export interface ProcessingState {
  step: ProcessingStep;
  details?: string;
}

export interface DocumentData {
  id: string;
  title: string;
  category: 'personal' | 'medical' | 'schemes';
  filename: string;
  icon: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  intent?: IntentType;
  usedDocs?: DocumentData[];
  isEmergency?: boolean;
}

export type RiskLevel = 'low' | 'moderate' | 'critical';

export interface Symptom {
  symptom: string;
  severity: string;
  duration?: string;
  frequency?: string;
  timestamp: string;
}

export interface Medication {
  name: string;
  status: 'taking' | 'missed' | 'stopped' | 'side_effects' | 'unknown';
  side_effect?: string;
  timestamp: string;
}

export interface Vitals {
  blood_pressure?: string;
  weight?: string;
  fetal_movement?: string;
}

export interface Lifestyle {
  diet?: string;
  sleep?: string;
  stress?: string;
}

export interface ExtractedHealthData {
  symptoms: Symptom[];
  medications: Medication[];
  vitals: Vitals;
  lifestyle: Lifestyle;
  concerns: string[];
  action_needed: string; // mapped to RiskLevel
  summary: string;
  suspected_conditions?: string[]; // New field for specific risk tagging
}

export interface HealthTimelineEntry extends ExtractedHealthData {}

export interface AshaPatient {
  id: string;
  name: string;
  age: number;
  weeks_pregnant: number;
  risk_level: RiskLevel;
  last_contact: string;
  next_checkup: string;
  location: string;
  timeline: HealthTimelineEntry[];
}