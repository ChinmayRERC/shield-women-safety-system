export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'PENDING' | 'DISPATCHED' | 'ON_SCENE' | 'RESOLVED' | 'FALSE_ALARM';

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
  timestamp: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  notified?: boolean;
}

export interface Incident {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userPhone: string;
  location: GeoLocation;
  triggerType: 'SOS_BUTTON' | 'SILENT_ALERT' | 'IOT_FALL_DETECT' | 'IOT_HEART_SPIKE' | 'VOICE_TRIGGER' | 'SHAKE_TRIGGER' | 'SAFE_WALK_OVERDUE';
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: string[];
  status: IncidentStatus;
  assignedResponder?: string;
  notes?: string[];
  batteryLevel: number;
  heartRate?: number;
  deviceInfo?: string;
  isSimulated: boolean;
}

export interface IoTSensorData {
  connected: boolean;
  deviceName: string;
  deviceType: 'Smart Band V4' | 'Safety Pendant X1' | 'Guardian Ring R2';
  battery: number;
  heartRate: number; // BPM
  accelerometer: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  fallDetected: boolean;
  struggleDetected: boolean;
  signalStrength: number; // -30 to -90 dBm
  lastSync: number;
}

export interface RiskAnalysis {
  score: number; // 0 to 100
  level: RiskLevel;
  confidence: number; // 0 to 100%
  breakdown: {
    factor: string;
    weight: number;
    impact: 'POSITIVE' | 'NEUTRAL' | 'WARNING' | 'DANGER';
    value: string;
    description: string;
  }[];
  explanation: string;
  recommendations: string[];
}

export interface ResponderUnit {
  id: string;
  name: string;
  type: 'POLICE_PATROL' | 'PINK_SQUAD' | 'AMBULANCE' | 'CAMPUS_SECURITY';
  status: 'AVAILABLE' | 'DISPATCHED' | 'BUSY';
  location: { lat: number; lng: number };
  etaMinutes: number;
  contactNumber: string;
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'POLICE_STATION' | 'HOSPITAL' | 'WOMEN_HELP_DESK' | 'SAFE_SHELTER';
  location: { lat: number; lng: number };
  address: string;
  isOpen24x7: boolean;
  phone: string;
}

export interface RiskZone {
  id: string;
  name: string;
  riskScore: number;
  center: { lat: number; lng: number };
  radiusMeters: number;
  reason: string;
}
