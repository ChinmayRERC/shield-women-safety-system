import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Incident,
  EmergencyContact,
  IoTSensorData,
  RiskAnalysis,
  GeoLocation,
  ResponderUnit,
  SafeZone,
  RiskZone,
} from '../types';
import {
  storageService,
  UserProfile,
  DEFAULT_USER_PROFILE,
} from '../services/storage';
import {
  MOCK_RESPONDERS,
  MOCK_SAFE_ZONES,
  MOCK_RISK_ZONES,
  DEFAULT_CENTER,
} from '../services/mockData';
import { getBrowserLocation } from '../services/geoService';
import { evaluateAIRisk, AIRiskInput } from '../services/aiRiskEngine';
import { soundService } from '../services/audioSiren';

export interface SimLog {
  id: string;
  time: string;
  type: 'SMS' | 'DISPATCH' | 'IOT' | 'SYSTEM' | 'AI';
  title: string;
  detail: string;
}

interface SafetyContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  userLocation: GeoLocation;
  refreshLocation: () => Promise<void>;
  setUserLocation: (loc: GeoLocation) => void;

  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;

  contacts: EmergencyContact[];
  addContact: (c: Omit<EmergencyContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  togglePrimaryContact: (id: string) => void;

  // SOS & Emergency
  activeIncident: Incident | null;
  isCountingDown: boolean;
  countdownSeconds: number;
  triggerSOS: (
    type?: Incident['triggerType'],
    options?: { silent?: boolean; immediate?: boolean; customRiskScore?: number }
  ) => void;
  confirmSOSNow: () => void;
  cancelSOSCountdown: (reason?: string) => void;
  resolveIncident: (incidentId: string, notes?: string) => void;

  // Sound & Siren
  isSirenPlaying: boolean;
  toggleSiren: () => void;
  stopSiren: () => void;
  playWhistle: () => void;

  // Strobe Flashlight Deterrent
  isStrobeActive: boolean;
  toggleStrobe: () => void;
  stopStrobe: () => void;

  // Silent Mode & Disguise
  isSilentMode: boolean;
  toggleSilentMode: () => void;

  // Safe Walk Companion
  isSafeWalkActive: boolean;
  safeWalkETA: number; // in minutes
  startSafeWalk: (durationMinutes: number) => void;
  stopSafeWalk: () => void;

  // IoT Wearable Simulator
  iotData: IoTSensorData;
  setIotData: React.Dispatch<React.SetStateAction<IoTSensorData>>;
  toggleIotConnection: () => void;
  simulateFallEvent: () => void;
  simulateStruggleEvent: () => void;
  simulateHeartSpike: () => void;
  resetIoTEvents: () => void;

  // AI Risk State
  aiInput: AIRiskInput;
  setAiInput: React.Dispatch<React.SetStateAction<AIRiskInput>>;
  riskAnalysis: RiskAnalysis;

  // Incident & Responder Management
  incidents: Incident[];
  responders: ResponderUnit[];
  dispatchUnit: (incidentId: string, responderId: string) => void;
  updateIncidentState: (incidentId: string, status: Incident['status'], note?: string) => void;

  // Simulation Broadcast Logs
  simLogs: SimLog[];
  addSimLog: (log: Omit<SimLog, 'id' | 'time'>) => void;
  clearSimLogs: () => void;

  // Fake Call Tool
  isFakeCallActive: boolean;
  triggerFakeCall: (callerName?: string) => void;
  endFakeCall: () => void;
  fakeCallerName: string;

  // Zones
  safeZones: SafeZone[];
  riskZones: RiskZone[];
}

const SafetyContext = createContext<SafetyContextType | null>(null);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Location State
  const [userLocation, setUserLocation] = useState<GeoLocation>({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    address: 'Brigade Road & MG Road Hub, Bengaluru (Simulated Baseline)',
    timestamp: Date.now(),
    accuracy: 12,
  });

  // User Profile & Contacts
  const [userProfile, setUserProfile] = useState<UserProfile>(storageService.getUserProfile());
  const [contacts, setContacts] = useState<EmergencyContact[]>(storageService.getContacts());

  // Incidents & Responders
  const [incidents, setIncidents] = useState<Incident[]>(storageService.getIncidents());
  const [responders, setResponders] = useState<ResponderUnit[]>(MOCK_RESPONDERS);

  // Active SOS incident
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const countdownTimerRef = useRef<any>(null);
  const pendingTriggerTypeRef = useRef<Incident['triggerType']>('SOS_BUTTON');

  // Siren & Strobe
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);

  // Silent Mode
  const [isSilentMode, setIsSilentMode] = useState(false);

  // Safe Walk
  const [isSafeWalkActive, setIsSafeWalkActive] = useState(false);
  const [safeWalkETA, setSafeWalkETA] = useState(15);
  const safeWalkTimerRef = useRef<any>(null);

  // Fake Call
  const [isFakeCallActive, setIsFakeCallActive] = useState(false);
  const [fakeCallerName, setFakeCallerName] = useState('Mom (Urgent)');

  // Simulation Broadcast Logs
  const [simLogs, setSimLogs] = useState<SimLog[]>([
    {
      id: 'log-0',
      time: new Date().toLocaleTimeString(),
      type: 'SYSTEM',
      title: 'SHIELD Engine Initialized',
      detail: 'Sensors linked, AI predictive weights calibrated, and emergency telemetry ready.',
    },
  ]);

  // IoT Wearable Simulator State
  const [iotData, setIotData] = useState<IoTSensorData>({
    connected: true,
    deviceName: 'SHIELD Guardian Ring R2',
    deviceType: 'Guardian Ring R2',
    battery: 88,
    heartRate: 74,
    accelerometer: { x: 0.05, y: 0.12, z: 0.98, magnitude: 1.0 },
    fallDetected: false,
    struggleDetected: false,
    signalStrength: -48,
    lastSync: Date.now(),
  });

  // AI Risk State
  const [aiInput, setAiInput] = useState<AIRiskInput>({
    timeOfDayHours: new Date().getHours(),
    ambientLighting: 'POOR',
    crowdDensity: 'SPARSE',
    batteryLevel: 42,
    routeStatus: 'ON_SAFE_ROUTE',
    iotData: null,
    nearRiskZone: null,
  });

  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis>(() =>
    evaluateAIRisk({
      ...aiInput,
      iotData,
    })
  );

  // Synchronize AI risk whenever inputs or IoT telemetry changes
  useEffect(() => {
    const updated = evaluateAIRisk({
      ...aiInput,
      iotData,
    });
    setRiskAnalysis(updated);
  }, [aiInput, iotData]);

  // Add Sim Log helper
  const addSimLog = useCallback((log: Omit<SimLog, 'id' | 'time'>) => {
    const newEntry: SimLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: new Date().toLocaleTimeString(),
    };
    setSimLogs((prev) => [newEntry, ...prev.slice(0, 40)]);
  }, []);

  const clearSimLogs = useCallback(() => {
    setSimLogs([]);
  }, []);

  // Fetch real browser location on startup
  const refreshLocation = useCallback(async () => {
    const loc = await getBrowserLocation();
    setUserLocation(loc);
    addSimLog({
      type: 'SYSTEM',
      title: 'GPS Coordinates Refreshed',
      detail: `Lat: ${loc.lat}, Lng: ${loc.lng} (${loc.address || 'Live Location'})`,
    });
  }, [addSimLog]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  // Periodic heartbeat simulation for IoT data
  useEffect(() => {
    if (!iotData.connected) return;

    const interval = setInterval(() => {
      setIotData((prev) => {
        if (!prev.connected) return prev;
        // Mild normal heart rate variance unless an event is active
        const jitter = Math.floor(Math.random() * 5) - 2;
        let nextHr = prev.heartRate + jitter;
        if (!prev.struggleDetected && !prev.fallDetected) {
          nextHr = Math.max(68, Math.min(88, nextHr));
        }

        // Accelerometer subtle noise
        const ax = Number(((Math.random() - 0.5) * 0.15).toFixed(2));
        const ay = Number(((Math.random() - 0.5) * 0.15).toFixed(2));
        const az = Number((0.95 + Math.random() * 0.08).toFixed(2));
        const mag = Number(Math.sqrt(ax * ax + ay * ay + az * az).toFixed(2));

        return {
          ...prev,
          heartRate: nextHr,
          accelerometer: { x: ax, y: ay, z: az, magnitude: mag },
          lastSync: Date.now(),
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [iotData.connected]);

  // Handle siren toggling
  const toggleSiren = useCallback(() => {
    if (isSirenPlaying) {
      soundService.stopEmergencySiren();
      setIsSirenPlaying(false);
      addSimLog({
        type: 'SYSTEM',
        title: 'Loud Alarm Muted',
        detail: 'Acoustic siren halted by user.',
      });
    } else {
      soundService.startEmergencySiren();
      setIsSirenPlaying(true);
      addSimLog({
        type: 'SYSTEM',
        title: 'High-Decibel Siren Activated',
        detail: 'Deterrent wail siren engaged at full volume to attract immediate bystander attention.',
      });
    }
  }, [isSirenPlaying, addSimLog]);

  const stopSiren = useCallback(() => {
    soundService.stopEmergencySiren();
    setIsSirenPlaying(false);
  }, []);

  const playWhistle = useCallback(() => {
    soundService.playPoliceWhistle(2);
    addSimLog({
      type: 'SYSTEM',
      title: 'Police Whistle Blast Triggered',
      detail: 'High-frequency 2.8kHz acoustic burst synthesized to deter hostile advances.',
    });
  }, [addSimLog]);

  const toggleStrobe = useCallback(() => {
    setIsStrobeActive((prev) => {
      const next = !prev;
      addSimLog({
        type: 'SYSTEM',
        title: next ? 'High-Frequency SOS Strobe Engaged' : 'Strobe Flash Halted',
        detail: next
          ? 'Full-screen high-frequency optical pulse active to disorient threats and signal coordinates.'
          : 'Optical strobe deactivated.',
      });
      return next;
    });
  }, [addSimLog]);

  const stopStrobe = useCallback(() => {
    setIsStrobeActive(false);
  }, []);

  // Handle Profile Update
  const updateUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    storageService.saveUserProfile(profile);
  }, []);

  // Handle Contacts
  const addContact = useCallback(
    (c: Omit<EmergencyContact, 'id'>) => {
      const newContact: EmergencyContact = {
        ...c,
        id: `c-${Date.now()}`,
      };
      const updated = [...contacts, newContact];
      setContacts(updated);
      storageService.saveContacts(updated);
      addSimLog({
        type: 'SYSTEM',
        title: 'Guardian Contact Added',
        detail: `${newContact.name} (${newContact.phone}) added to emergency network.`,
      });
    },
    [contacts, addSimLog]
  );

  const deleteContact = useCallback(
    (id: string) => {
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      storageService.saveContacts(updated);
    },
    [contacts]
  );

  const togglePrimaryContact = useCallback(
    (id: string) => {
      const updated = contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }));
      setContacts(updated);
      storageService.saveContacts(updated);
    },
    [contacts]
  );

  // Dispatch live incident creation after countdown or immediately
  const createActiveIncident = useCallback(
    (type: Incident['triggerType'], customScore?: number) => {
      const currentScore = customScore !== undefined ? customScore : riskAnalysis.score;
      const currentLevel =
        currentScore >= 75 ? 'CRITICAL' : currentScore >= 50 ? 'HIGH' : currentScore >= 25 ? 'MODERATE' : 'LOW';

      const newInc: Incident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        userId: userProfile.id,
        userName: userProfile.name,
        userPhone: userProfile.phone,
        location: { ...userLocation, timestamp: Date.now() },
        triggerType: type,
        riskScore: currentScore,
        riskLevel: currentLevel,
        riskFactors: riskAnalysis.breakdown
          .filter((b) => b.impact === 'DANGER' || b.impact === 'WARNING')
          .map((b) => `${b.factor} (${b.value})`),
        status: 'PENDING',
        notes: [
          `${new Date().toLocaleTimeString()} - Emergency distress signaled via ${type.replace(/_/g, ' ')}.`,
          `AI Computed Threat Score: ${currentScore}/100 [${currentLevel}].`,
          `Simulated GPS fix: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}.`,
        ],
        batteryLevel: aiInput.batteryLevel,
        heartRate: iotData.connected ? iotData.heartRate : undefined,
        deviceInfo: iotData.connected ? `${iotData.deviceName} (${iotData.battery}%)` : 'Mobile Browser Client',
        isSimulated: true,
      };

      setActiveIncident(newInc);
      const updatedList = storageService.addIncident(newInc);
      setIncidents(updatedList);

      // Trigger Simulated broadcast logs
      contacts.forEach((contact) => {
        addSimLog({
          type: 'SMS',
          title: `SMS Broadcast -> ${contact.name}`,
          detail: `[SIMULATED SMS] "EMERGENCY ALERT: ${userProfile.name} triggered ${type.replace(/_/g, ' ')}! Live GPS: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}"`,
        });
      });

      addSimLog({
        type: 'DISPATCH',
        title: 'Emergency Dispatch Center Notified',
        detail: `[SIMULATED API] Incident ${newInc.id} transmitted to Municipal Emergency Response Hub (112/Pink Patrol).`,
      });
    },
    [userProfile, userLocation, riskAnalysis, aiInput.batteryLevel, iotData, contacts, addSimLog]
  );

  // Trigger SOS with optional countdown
  const triggerSOS = useCallback(
    (
      type: Incident['triggerType'] = 'SOS_BUTTON',
      options?: { silent?: boolean; immediate?: boolean; customRiskScore?: number }
    ) => {
      pendingTriggerTypeRef.current = type;

      if (options?.silent) {
        setIsSilentMode(true);
        addSimLog({
          type: 'SYSTEM',
          title: 'Silent Distress Mode Engaged',
          detail: 'Screen darkened and telemetry transmitted covertly with zero audible cues.',
        });
      }

      if (options?.immediate) {
        createActiveIncident(type, options.customRiskScore);
        return;
      }

      // Start 5s countdown
      setIsCountingDown(true);
      setCountdownSeconds(5);
      soundService.playCountdownPip(800, 150);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      let remaining = 5;
      countdownTimerRef.current = setInterval(() => {
        remaining -= 1;
        setCountdownSeconds(remaining);
        if (remaining > 0) {
          soundService.playCountdownPip(800 + (5 - remaining) * 80, 120);
        } else {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          setIsCountingDown(false);
          createActiveIncident(pendingTriggerTypeRef.current, options?.customRiskScore);
        }
      }, 1000);
    },
    [createActiveIncident, addSimLog]
  );

  const confirmSOSNow = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsCountingDown(false);
    createActiveIncident(pendingTriggerTypeRef.current);
  }, [createActiveIncident]);

  const cancelSOSCountdown = useCallback(
    (reason: string = 'User pressed Cancel within grace window') => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setIsCountingDown(false);
      setCountdownSeconds(5);
      soundService.playSuccessTone();
      addSimLog({
        type: 'SYSTEM',
        title: 'Emergency Alert Cancelled',
        detail: `Verification confirmed: ${reason}. Incident was aborted before dispatch.`,
      });
    },
    [addSimLog]
  );

  const resolveIncident = useCallback(
    (incidentId: string, notes?: string) => {
      const resolutionNote = `${new Date().toLocaleTimeString()} - Case closed: ${notes || 'Citizen verified safe.'}`;
      const updated = storageService.updateIncidentStatus(incidentId, 'RESOLVED', resolutionNote);
      setIncidents(updated);
      if (activeIncident && activeIncident.id === incidentId) {
        setActiveIncident(null);
      }
      stopSiren();
      soundService.playSuccessTone();
      addSimLog({
        type: 'DISPATCH',
        title: `Incident ${incidentId} Closed`,
        detail: resolutionNote,
      });
    },
    [activeIncident, stopSiren, addSimLog]
  );

  // Dispatch responder to incident
  const dispatchUnit = useCallback(
    (incidentId: string, responderId: string) => {
      const unit = responders.find((r) => r.id === responderId);
      const unitName = unit ? unit.name : 'Rapid Action Unit';
      const dispatchNote = `${new Date().toLocaleTimeString()} - Responder Assigned: ${unitName}. ETA: ${unit?.etaMinutes || 4} mins.`;

      const updated = storageService.updateIncidentStatus(incidentId, 'DISPATCHED', dispatchNote, unitName);
      setIncidents(updated);

      // Update unit status to busy
      setResponders((prev) =>
        prev.map((r) => (r.id === responderId ? { ...r, status: 'DISPATCHED' } : r))
      );

      if (activeIncident && activeIncident.id === incidentId) {
        setActiveIncident((prev) =>
          prev ? { ...prev, status: 'DISPATCHED', assignedResponder: unitName } : null
        );
      }

      addSimLog({
        type: 'DISPATCH',
        title: `Unit Dispatched to ${incidentId}`,
        detail: `[SIMULATED CAD] ${unitName} mobilized. En-route to coordinates.`,
      });
    },
    [responders, activeIncident, addSimLog]
  );

  const updateIncidentState = useCallback(
    (incidentId: string, status: Incident['status'], note?: string) => {
      const timestampNote = note ? `${new Date().toLocaleTimeString()} - ${note}` : undefined;
      const updated = storageService.updateIncidentStatus(incidentId, status, timestampNote);
      setIncidents(updated);
      if (activeIncident && activeIncident.id === incidentId) {
        setActiveIncident((prev) => (prev ? { ...prev, status } : null));
      }
    },
    [activeIncident]
  );

  // Safe Walk
  const startSafeWalk = useCallback(
    (minutes: number) => {
      setIsSafeWalkActive(true);
      setSafeWalkETA(minutes);
      addSimLog({
        type: 'SYSTEM',
        title: 'SafeWalk Companion Activated',
        detail: `Live route tracking engaged for ${minutes} minutes. Automated check-in ping scheduled.`,
      });

      if (safeWalkTimerRef.current) clearInterval(safeWalkTimerRef.current);

      safeWalkTimerRef.current = setInterval(() => {
        setSafeWalkETA((prev) => {
          if (prev <= 1) {
            clearInterval(safeWalkTimerRef.current);
            setIsSafeWalkActive(false);
            // Overdue triggered!
            triggerSOS('SAFE_WALK_OVERDUE', {
              customRiskScore: 85,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    },
    [addSimLog, triggerSOS]
  );

  const stopSafeWalk = useCallback(() => {
    setIsSafeWalkActive(false);
    if (safeWalkTimerRef.current) {
      clearInterval(safeWalkTimerRef.current);
      safeWalkTimerRef.current = null;
    }
    soundService.playSuccessTone();
    addSimLog({
      type: 'SYSTEM',
      title: 'SafeWalk Ended Safely',
      detail: 'Destination reached. Live guardian tracking session closed.',
    });
  }, [addSimLog]);

  // Fake Call Tool
  const triggerFakeCall = useCallback(
    (caller: string = 'Mom (Urgent Call)') => {
      setFakeCallerName(caller);
      setIsFakeCallActive(true);
      soundService.playCountdownPip(440, 400);
      addSimLog({
        type: 'SYSTEM',
        title: 'Fake Call Simulator Triggered',
        detail: `Simulated incoming ringtone from "${caller}" to assist awkward or uncomfortable exit.`,
      });
    },
    [addSimLog]
  );

  const endFakeCall = useCallback(() => {
    setIsFakeCallActive(false);
  }, []);

  // IoT Simulation Actions
  const toggleIotConnection = useCallback(() => {
    setIotData((prev) => {
      const next = !prev.connected;
      addSimLog({
        type: 'IOT',
        title: next ? 'IoT Wearable Connected' : 'IoT Wearable Disconnected',
        detail: `${prev.deviceName} ${next ? 'paired via BLE 5.2' : 'unpaired'}.`,
      });
      return { ...prev, connected: next };
    });
  }, [addSimLog]);

  const simulateFallEvent = useCallback(() => {
    if (!iotData.connected) return;
    setIotData((prev) => ({
      ...prev,
      fallDetected: true,
      accelerometer: { x: 0.1, y: 3.4, z: -1.8, magnitude: 3.85 },
      heartRate: 138,
    }));
    addSimLog({
      type: 'IOT',
      title: 'HARD FALL DETECTED (3.85G)',
      detail: 'Abrupt vertical drop and impact signature recorded on smart wearable accelerometer.',
    });
    // Auto initiate SOS countdown
    triggerSOS('IOT_FALL_DETECT');
  }, [iotData.connected, addSimLog, triggerSOS]);

  const simulateStruggleEvent = useCallback(() => {
    if (!iotData.connected) return;
    setIotData((prev) => ({
      ...prev,
      struggleDetected: true,
      accelerometer: { x: 2.1, y: -2.8, z: 2.4, magnitude: 4.2 },
      heartRate: 152,
    }));
    addSimLog({
      type: 'IOT',
      title: 'STRUGGLE / ERRATIC MOTION DETECTED',
      detail: 'High-frequency rapid oscillatory movement matches defense or physical restraint.',
    });
    // Auto initiate SOS countdown
    triggerSOS('SHAKE_TRIGGER');
  }, [iotData.connected, addSimLog, triggerSOS]);

  const simulateHeartSpike = useCallback(() => {
    if (!iotData.connected) return;
    setIotData((prev) => ({
      ...prev,
      heartRate: 148,
    }));
    addSimLog({
      type: 'IOT',
      title: 'ACUTE TACHYCARDIA SPIKE (148 BPM)',
      detail: 'Sudden resting heart rate surge detected (+65 BPM above nominal threshold).',
    });
    triggerSOS('IOT_HEART_SPIKE');
  }, [iotData.connected, addSimLog, triggerSOS]);

  const resetIoTEvents = useCallback(() => {
    setIotData((prev) => ({
      ...prev,
      fallDetected: false,
      struggleDetected: false,
      heartRate: 74,
      accelerometer: { x: 0.05, y: 0.12, z: 0.98, magnitude: 1.0 },
    }));
  }, []);

  const toggleSilentMode = useCallback(() => {
    setIsSilentMode((prev) => !prev);
  }, []);

  return (
    <SafetyContext.Provider
      value={{
        activeTab,
        setActiveTab,

        userLocation,
        refreshLocation,
        setUserLocation,

        userProfile,
        updateUserProfile,

        contacts,
        addContact,
        deleteContact,
        togglePrimaryContact,

        activeIncident,
        isCountingDown,
        countdownSeconds,
        triggerSOS,
        confirmSOSNow,
        cancelSOSCountdown,
        resolveIncident,

        isSirenPlaying,
        toggleSiren,
        stopSiren,
        playWhistle,

        isStrobeActive,
        toggleStrobe,
        stopStrobe,

        isSilentMode,
        toggleSilentMode,

        isSafeWalkActive,
        safeWalkETA,
        startSafeWalk,
        stopSafeWalk,

        iotData,
        setIotData,
        toggleIotConnection,
        simulateFallEvent,
        simulateStruggleEvent,
        simulateHeartSpike,
        resetIoTEvents,

        aiInput,
        setAiInput,
        riskAnalysis,

        incidents,
        responders,
        dispatchUnit,
        updateIncidentState,

        simLogs,
        addSimLog,
        clearSimLogs,

        isFakeCallActive,
        triggerFakeCall,
        endFakeCall,
        fakeCallerName,

        safeZones: MOCK_SAFE_ZONES,
        riskZones: MOCK_RISK_ZONES,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export function useSafety(): SafetyContextType {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
