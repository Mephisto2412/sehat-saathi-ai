import { AshaPatient, DocumentData } from '../types';
import { userDocuments, medicalDocuments, schemeDocuments, mockAshaPatients } from '../data/mockData';

const PATIENTS_KEY = 'sehat_saathi_patients_v1';
const DOCS_KEY = 'sehat_saathi_docs_v1';

export const db = {
  // Initialize DB with default data if empty
  init: () => {
    if (!localStorage.getItem(PATIENTS_KEY)) {
      console.log('Initializing Patients DB...');
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(mockAshaPatients));
    } else {
        // Migration/Reset logic if needed, skipping for hackathon simplicity
    }
    
    // Always refresh docs on reload to ensure code updates (like new schemes) are reflected
    // In a real app, you'd check versions.
    const allDocs = [...userDocuments, ...medicalDocuments, ...schemeDocuments];
    localStorage.setItem(DOCS_KEY, JSON.stringify(allDocs));
  },

  getPatients: (): AshaPatient[] => {
    try {
      const data = localStorage.getItem(PATIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return mockAshaPatients;
    }
  },

  getCurrentUser: (): AshaPatient => {
    const patients = db.getPatients();
    let user = patients.find(p => p.id === 'user_123');
    if (!user) {
        // Fallback if local storage got corrupted
        user = mockAshaPatients[0];
    }
    return user;
  },

  updatePatient: (updatedPatient: AshaPatient) => {
    const patients = db.getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      patients[index] = updatedPatient;
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    }
  },

  getDocuments: (): DocumentData[] => {
    try {
      const data = localStorage.getItem(DOCS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [...userDocuments, ...medicalDocuments, ...schemeDocuments];
    }
  }
};

// Auto-initialize on import
db.init();