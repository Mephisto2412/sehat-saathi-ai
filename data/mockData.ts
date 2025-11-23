import { DocumentData, AshaPatient } from '../types';

// ==========================================
// USER PERSONAL STORE (Rani Devi)
// ==========================================
export const userDocuments: DocumentData[] = [
  {
    id: 'u1',
    title: 'Prescription Oct 2024',
    category: 'personal',
    filename: 'prescription_2024_10.pdf',
    icon: '💊',
    content: `
      PATIENT: Rani Devi (User_123)
      DATE: 2024-10-15
      DOCTOR: Dr. A. Smith
      
      PRESCRIPTION:
      1. Prenatal Vitamins - 1 tab daily after lunch.
      2. Calcium 500mg - 1 tab daily after dinner.
      3. Iron Folic Acid - 1 tab daily morning (empty stomach).
      
      NOTES:
      - BP: 110/70 (Normal)
      - Weight: 65kg (+2kg since last month)
    `
  },
  {
    id: 'u2',
    title: 'Ultrasound Report Week 20',
    category: 'personal',
    filename: 'ultrasound_report_week20.pdf',
    icon: '👶',
    content: `
      REPORT: Anomaly Scan (Week 20)
      DATE: 2024-10-01
      PATIENT: Rani Devi
      
      FINDINGS:
      - Single live intrauterine fetus.
      - Fetal Heart Rate (FHR): 145 bpm (Normal range).
      - Placenta: Posterior, upper segment.
      - Liquor: Adequate.
      - EFW (Est. Fetal Weight): 350g.
      
      IMPRESSION: No obvious anomalies seen. Growth corresponds to 20 weeks.
    `
  },
  {
    id: 'u3',
    title: 'Appointment Schedule',
    category: 'personal',
    filename: 'appointment_schedule.json',
    icon: '📅',
    content: `
      {
        "upcoming_appointments": [
          {
            "date": "2024-12-05",
            "time": "10:00 AM",
            "doctor": "Dr. A. Smith",
            "type": "Routine Checkup (Week 28)",
            "location": "City Maternity Clinic, Room 302"
          }
        ]
      }
    `
  }
];

// ==========================================
// GOVERNMENT SCHEMES STORE (Financial)
// ==========================================
export const schemeDocuments: DocumentData[] = [
  {
    id: 's1',
    title: 'PMMVY Scheme Benefits (₹5000)',
    category: 'schemes',
    filename: 'pmmvy_scheme_rules.pdf',
    icon: '₹',
    content: `
      SCHEME: Pradhan Mantri Matru Vandana Yojana (PMMVY)
      BENEFIT: ₹5,000 cash incentive for first living child.
      
      INSTALLMENTS:
      1. ₹1,000: On early registration of pregnancy at Anganwadi/Health Center.
      2. ₹2,000: After 6 months of pregnancy & at least one Antenatal Check-up.
      3. ₹2,000: After child birth registration & first cycle of vaccines (BCG, OPV, DPT).
      
      DOCUMENTS REQUIRED:
      - Aadhaar Card
      - Bank Account Passbook (Aadhaar linked)
      - MCP Card (Mother and Child Protection Card)
    `
  },
  {
    id: 's2',
    title: 'Janani Suraksha Yojana (JSY)',
    category: 'schemes',
    filename: 'jsy_scheme_details.pdf',
    icon: '🏥',
    content: `
      SCHEME: Janani Suraksha Yojana (JSY)
      OBJECTIVE: Safe institutional delivery.
      
      BENEFITS (Rural Areas):
      - Mother: ₹1,400 cash assistance for delivering in a Govt Hospital.
      - ASHA Worker: ₹600 incentive for accompanying the mother.
      
      ELIGIBILITY: All pregnant women delivering in public health centers (PHC/CHC).
    `
  }
];

// ==========================================
// GLOBAL MEDICAL KNOWLEDGE STORE
// ==========================================
export const medicalDocuments: DocumentData[] = [
  {
    id: 'm1',
    title: 'Common Pregnancy Symptoms',
    category: 'medical',
    filename: 'pregnancy_symptoms_guide.pdf',
    icon: 'ℹ️',
    content: `
      SOURCE: Global Health Pregnancy Guide
      
      STOMACH ACHE / ABDOMINAL PAIN:
      - Mild/Gas: Common. Solution: Drink warm water, walk for 10 mins.
      - Round Ligament Pain: Sharp pain on sides when moving. Normal in 2nd trimester.
      - WARNING: Severe, constant pain could be labor or pre-eclampsia.
      
      BACKACHE:
      - Extremely common. Solution: Good posture, sleep on side.
      
      LEG CRAMPS:
      - Dehydration or low calcium. Stretch heel down, toes up.
    `
  },
  {
    id: 'm2',
    title: 'Nutrition Guidelines (Indian Diet)',
    category: 'medical',
    filename: 'nutrition_guidelines.pdf',
    icon: '🥗',
    content: `
      ESSENTIAL NUTRIENTS:
      1. Protein: Dal, eggs, milk, nuts, paneer.
      2. Iron: Spinach (Palak), jaggery (Gud), meat. Prevents anemia.
      3. Calcium: Milk, curd.
      
      AVOID:
      - Raw papaya, raw eggs, alcohol, tobacco.
    `
  },
  {
    id: 'm3',
    title: 'Emergency Signs (Red Flags)',
    category: 'medical',
    filename: 'emergency_red_flags.pdf',
    icon: '🚨',
    content: `
      DANGER SIGNS - GO TO HOSPITAL IMMEDIATELY:
      1. Vaginal Bleeding: Any heavy fresh red blood.
      2. Severe Headache + Blurry Vision: Signs of High BP (Pre-eclampsia).
      3. Reduced Fetal Movement: Less than 10 kicks in 12 hours.
      4. Water Break: Fluid leaking before 37 weeks.
      5. High Fever: > 100.4 F with chills.
    `
  }
];

// ==========================================
// ASHA DASHBOARD MOCK DATA
// ==========================================
export const mockAshaPatients: AshaPatient[] = [
  {
    id: 'user_123', // Matches the current user
    name: 'Rani Devi',
    age: 24,
    weeks_pregnant: 28,
    risk_level: 'low',
    last_contact: 'Just now',
    next_checkup: 'Dec 05, 2024',
    location: 'Village Sector 3',
    timeline: []
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    age: 24,
    weeks_pregnant: 28,
    risk_level: 'critical',
    last_contact: '10 mins ago',
    next_checkup: 'Nov 24, 2024',
    location: 'Village Sector 4',
    timeline: [
      {
        symptoms: [{ symptom: 'Bleeding', severity: 'severe', duration: '1 hour', frequency: 'constant', timestamp: '2024-11-22T10:30:00' }],
        medications: [],
        vitals: { blood_pressure: '90/60', fetal_movement: 'reduced' },
        lifestyle: {},
        concerns: ['Dizziness', 'Soaking pads'],
        action_needed: 'critical',
        summary: 'Patient reported heavy bleeding and dizziness. Immediate transport advised.',
        suspected_conditions: ['Haemorrhage']
      }
    ]
  },
  {
    id: 'p3',
    name: 'Meera Patel',
    age: 29,
    weeks_pregnant: 32,
    risk_level: 'moderate',
    last_contact: '1 day ago',
    next_checkup: 'Nov 25, 2024',
    location: 'Village Sector 2',
    timeline: [
      {
        symptoms: [{ symptom: 'Swelling', severity: 'moderate', duration: '2 days', frequency: 'intermittent', timestamp: '2024-11-21T09:00:00' }],
        medications: [{ name: 'Iron', status: 'taking', timestamp: '2024-11-21T09:00:00' }],
        vitals: { blood_pressure: '135/85' },
        lifestyle: { diet: 'High salt intake' },
        concerns: [],
        action_needed: 'moderate',
        summary: 'Early signs of edema. BP slightly elevated.',
        suspected_conditions: ['Hypertension Risk']
      }
    ]
  }
];