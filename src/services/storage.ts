import { Incident, EmergencyContact, IoTSensorData } from '../types';
import { INITIAL_CONTACTS, INITIAL_INCIDENTS } from './mockData';

const KEYS = {
  INCIDENTS: 'shield_incidents_v1',
  CONTACTS: 'shield_contacts_v1',
  USER_PROFILE: 'shield_user_profile_v1',
  IOT_STATE: 'shield_iot_state_v1',
  SETTINGS: 'shield_settings_v1',
};

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  medicalConditions: string;
  emergencyPin: string;
  safeWord: string;
  homeAddress: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-primary-001',
  name: 'Aarohi Sen',
  phone: '+91 98765 01234',
  bloodGroup: 'O+',
  medicalConditions: 'Mild Asthmatic, carries inhaler',
  emergencyPin: '4321',
  safeWord: 'LAVENDER',
  homeAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
};

export const storageService = {
  getIncidents(): Incident[] {
    try {
      const data = localStorage.getItem(KEYS.INCIDENTS);
      return data ? JSON.parse(data) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  },

  saveIncidents(incidents: Incident[]): void {
    try {
      localStorage.setItem(KEYS.INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.warn('Failed to save incidents to localStorage:', e);
    }
  },

  addIncident(incident: Incident): Incident[] {
    const list = this.getIncidents();
    const updated = [incident, ...list];
    this.saveIncidents(updated);
    return updated;
  },

  updateIncidentStatus(id: string, status: Incident['status'], notesAppend?: string, assignedResponder?: string): Incident[] {
    const list = this.getIncidents();
    const updated = list.map((inc) => {
      if (inc.id === id) {
        const notes = inc.notes ? [...inc.notes] : [];
        if (notesAppend) notes.push(notesAppend);
        return {
          ...inc,
          status,
          notes,
          assignedResponder: assignedResponder !== undefined ? assignedResponder : inc.assignedResponder,
        };
      }
      return inc;
    });
    this.saveIncidents(updated);
    return updated;
  },

  getContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(KEYS.CONTACTS);
      return data ? JSON.parse(data) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  },

  saveContacts(contacts: EmergencyContact[]): void {
    try {
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts:', e);
    }
  },

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  },

  resetToDemo(): void {
    localStorage.removeItem(KEYS.INCIDENTS);
    localStorage.removeItem(KEYS.CONTACTS);
    localStorage.removeItem(KEYS.USER_PROFILE);
    localStorage.removeItem(KEYS.IOT_STATE);
  },
};
