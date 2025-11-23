import { AshaPatient, DocumentData } from '../types';
import { userDocuments, medicalDocuments, schemeDocuments, mockAshaPatients } from '../data/mockData';

const PATIENTS_KEY = 'sehat_saathi_db_patients_v2';
const DOCS_KEY = 'sehat_saathi_db_docs_v2';

// Setup Broadcast Channel for Instant Sync
const syncChannel = new BroadcastChannel('sehat_saathi_sync');

type Listener<T> = (data: T) => void;

export class LocalDatabase {
  private patientsListeners: Listener<AshaPatient[]>[] = [];
  private docsListeners: Listener<DocumentData[]>[] = [];

  constructor() {
    this.init();
    
    // Listen for "Pings" from other tabs
    syncChannel.onmessage = (event) => {
      if (event.data === 'PATIENTS_UPDATED') {
        this.notifyPatients(); 
      }
    };
  }

  private init() {
    if (!localStorage.getItem(PATIENTS_KEY)) {
      // Initialize with exactly 3 patients
      const initialPatients = mockAshaPatients.slice(0, 3);
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(initialPatients));
    }
    // Always sync docs code updates
    const allDocs = [...userDocuments, ...medicalDocuments, ...schemeDocuments];
    localStorage.setItem(DOCS_KEY, JSON.stringify(allDocs));
  }

  // --- PUBLIC METHODS ---

  getPatients(): AshaPatient[] {
    try {
      return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    } catch { return []; }
  }

  getDocuments(): DocumentData[] {
    try {
      return JSON.parse(localStorage.getItem(DOCS_KEY) || '[]');
    } catch { return []; }
  }

  getCurrentUser(): AshaPatient {
    const patients = this.getPatients();
    return patients.find(p => p.id === 'user_123') || patients[0];
  }

  updatePatient(updatedPatient: AshaPatient) {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    
    if (index !== -1) {
      patients[index] = updatedPatient;
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
      // Update this tab immediately
      this.notifyPatients(); 
      // Notify other tabs
      syncChannel.postMessage('PATIENTS_UPDATED');
    }
  }

  subscribeToPatients(callback: Listener<AshaPatient[]>) {
    this.patientsListeners.push(callback);
    callback(this.getPatients());
    return () => {
      this.patientsListeners = this.patientsListeners.filter(l => l !== callback);
    };
  }

  subscribeToDocuments(callback: Listener<DocumentData[]>) {
    this.docsListeners.push(callback);
    callback(this.getDocuments());
    return () => {
      this.docsListeners = this.docsListeners.filter(l => l !== callback);
    };
  }

  private notifyPatients() {
    const data = this.getPatients();
    this.patientsListeners.forEach(l => l(data));
  }
}

// EXPORT THE INSTANCE
export const db = new LocalDatabase();