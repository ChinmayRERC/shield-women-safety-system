import { Incident, EmergencyContact, ResponderUnit, SafeZone, RiskZone } from '../types';

export const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Ananya Sharma (Sister)',
    relation: 'Sister',
    phone: '+91 98765 43210',
    isPrimary: true,
  },
  {
    id: 'c2',
    name: 'Rajesh Sharma (Father)',
    relation: 'Father',
    phone: '+91 98111 22334',
    isPrimary: false,
  },
  {
    id: 'c3',
    name: 'Pooja Verma (Best Friend)',
    relation: 'Friend',
    phone: '+91 99887 76655',
    isPrimary: false,
  },
];

// Default reference coordinates (Central Hub, e.g., Tech City / Urban Zone: 12.9716, 77.5946 - Bengaluru, or customizable)
export const DEFAULT_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
};

export const MOCK_SAFE_ZONES: SafeZone[] = [
  {
    id: 'sz1',
    name: 'Women Police Station - Cubbon Park',
    type: 'WOMEN_HELP_DESK',
    location: { lat: 12.9745, lng: 77.5925 },
    address: 'Kasturba Road, Near High Court, Bengaluru',
    isOpen24x7: true,
    phone: '080-22942222',
  },
  {
    id: 'sz2',
    name: 'Central Command Police Station',
    type: 'POLICE_STATION',
    location: { lat: 12.9680, lng: 77.6010 },
    address: 'Infantry Road, Shivajinagar, Bengaluru',
    isOpen24x7: true,
    phone: '112 / 100',
  },
  {
    id: 'sz3',
    name: 'Victoria Memorial Govt Hospital',
    type: 'HOSPITAL',
    location: { lat: 12.9635, lng: 77.5750 },
    address: 'Fort Road, Bengaluru',
    isOpen24x7: true,
    phone: '080-26701150',
  },
  {
    id: 'sz4',
    name: 'Pink Booth 24/7 Safety Kiosk',
    type: 'SAFE_SHELTER',
    location: { lat: 12.9780, lng: 77.6050 },
    address: 'MG Road Metro Station Concourse',
    isOpen24x7: true,
    phone: '1091',
  },
];

export const MOCK_RISK_ZONES: RiskZone[] = [
  {
    id: 'rz1',
    name: 'Unlit Industrial Corridor - Lane 4',
    riskScore: 82,
    center: { lat: 12.9640, lng: 77.6090 },
    radiusMeters: 450,
    reason: 'Reported poor street lighting, low pedestrian density after 9 PM, CCTV blindspot',
  },
  {
    id: 'rz2',
    name: 'Isolated Transit Underpass Bypass',
    riskScore: 74,
    center: { lat: 12.9810, lng: 77.5850 },
    radiusMeters: 320,
    reason: 'Construction obstruction, intermittent cellular dead zone',
  },
];

export const MOCK_RESPONDERS: ResponderUnit[] = [
  {
    id: 'resp-1',
    name: 'Pink Patrol PCR-04 (Women Rapid Action)',
    type: 'PINK_SQUAD',
    status: 'AVAILABLE',
    location: { lat: 12.9730, lng: 77.5990 },
    etaMinutes: 3,
    contactNumber: '+91 94808 01091',
  },
  {
    id: 'resp-2',
    name: 'City Sector Cheetah Bike Unit #12',
    type: 'POLICE_PATROL',
    status: 'AVAILABLE',
    location: { lat: 12.9660, lng: 77.5900 },
    etaMinutes: 5,
    contactNumber: '+91 94808 00100',
  },
  {
    id: 'resp-3',
    name: 'Emergency Medical First Responder AMB-09',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    location: { lat: 12.9610, lng: 77.5820 },
    etaMinutes: 7,
    contactNumber: '+91 94808 00108',
  },
  {
    id: 'resp-4',
    name: 'University Campus Safety Marshal QRT',
    type: 'CAMPUS_SECURITY',
    status: 'BUSY',
    location: { lat: 12.9850, lng: 77.6100 },
    etaMinutes: 9,
    contactNumber: '+91 94808 00999',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-8492',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    userId: 'usr-demo-01',
    userName: 'Kavita Sundaram',
    userPhone: '+91 98450 12345',
    location: {
      lat: 12.9695,
      lng: 77.6045,
      address: 'Near Brigade Road junction, Bengaluru',
      timestamp: Date.now() - 1000 * 60 * 18,
    },
    triggerType: 'IOT_HEART_SPIKE',
    riskScore: 78,
    riskLevel: 'HIGH',
    riskFactors: ['Tachycardia detected (>142 BPM)', 'Late evening (11:42 PM)', 'Isolated route anomaly'],
    status: 'DISPATCHED',
    assignedResponder: 'Pink Patrol PCR-04 (Women Rapid Action)',
    notes: [
      '11:42 PM - Triggered via IoT Smart Band biometrics.',
      '11:43 PM - Automated verification SMS sent. No cancellation response.',
      '11:44 PM - Pink Patrol PCR-04 dispatched. En route ETA 3 mins.'
    ],
    batteryLevel: 68,
    heartRate: 144,
    deviceInfo: 'Smart Band V4 (BT-5.2)',
    isSimulated: true,
  },
  {
    id: 'INC-8491',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    userId: 'usr-demo-02',
    userName: 'Meera Nair',
    userPhone: '+91 97401 56789',
    location: {
      lat: 12.9620,
      lng: 77.6080,
      address: 'Outer Lane 3, Richmond Town',
      timestamp: Date.now() - 1000 * 60 * 75,
    },
    triggerType: 'SOS_BUTTON',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    riskFactors: ['Manual Hard Panic SOS', 'High-risk unlit corridor', 'Device battery < 15%'],
    status: 'RESOLVED',
    assignedResponder: 'City Sector Cheetah Bike Unit #12',
    notes: [
      '10:15 PM - Panic SOS activated by user.',
      '10:19 PM - Unit arrived on scene, escorted citizen to safe transit hub.',
      '10:45 PM - Marked RESOLVED after verified safe return home.'
    ],
    batteryLevel: 14,
    heartRate: 130,
    deviceInfo: 'Mobile Web Native Client',
    isSimulated: true,
  },
  {
    id: 'INC-8488',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    userId: 'usr-demo-03',
    userName: 'Priyanka Sen',
    userPhone: '+91 98200 98765',
    location: {
      lat: 12.9790,
      lng: 77.5890,
      address: 'Near Seshadripuram Railway Underpass',
      timestamp: Date.now() - 1000 * 60 * 140,
    },
    triggerType: 'IOT_FALL_DETECT',
    riskScore: 64,
    riskLevel: 'MODERATE',
    riskFactors: ['Severe impact vector (3.8G)', 'Sudden cessation of movement'],
    status: 'FALSE_ALARM',
    notes: [
      '09:10 PM - IoT Fall detection triggered.',
      '09:12 PM - User entered PIN 1234 within grace period: accidental drop of pendant.'
    ],
    batteryLevel: 82,
    deviceInfo: 'Safety Pendant X1',
    isSimulated: true,
  }
];
