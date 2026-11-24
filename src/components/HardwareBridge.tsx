import React, { useEffect, useSyncExternalStore } from 'react';
import { useSafety } from '../context/SafetyContext';
import {
  getSnapshot,
  sendCommand,
  setFallHandler,
  setSwitchHandler,
  subscribe,
} from '../services/hardwareBridge';

/**
 * Invisible glue between the ESP8266 bridge and SHIELD's own state.
 * Rendered once from App so hardware keeps working on every screen.
 */
export const HardwareBridge: React.FC = () => {
  const {
    triggerSOS,
    simulateFallEvent,
    setIotData,
    setAiInput,
    activeIncident,
    isSirenPlaying,
    isStrobeActive,
  } = useSafety();

  const hardware = useSyncExternalStore(subscribe, getSnapshot);

  // Physical switch / fall sensor press behaves like the on-screen SOS buttons.
  useEffect(() => {
    setSwitchHandler(() => triggerSOS('SOS_BUTTON'));
    setFallHandler(() => simulateFallEvent());
    return () => {
      setSwitchHandler(null);
      setFallHandler(null);
    };
  }, [triggerSOS, simulateFallEvent]);

  // Device battery from A0 becomes both the shown battery and an AI risk input.
  useEffect(() => {
    const battery = hardware.telemetry?.battery;
    if (!hardware.connected || battery === null || battery === undefined) return;
    setIotData((prev) => ({ ...prev, battery }));
    setAiInput((prev) => ({ ...prev, batteryLevel: battery }));
  }, [hardware.telemetry?.battery, hardware.connected, setIotData, setAiInput]);

  // Tell the ESP8266 what to do with its buzzer and LED.
  useEffect(() => {
    const alerting = Boolean(activeIncident) || isSirenPlaying || isStrobeActive;
    void sendCommand({
      buzzer: alerting,
      led: activeIncident ? 'flashing' : isSirenPlaying || isStrobeActive ? 'red' : hardware.connected ? 'green' : 'off',
    });
  }, [
    hardware.enabled,
    hardware.connected,
    activeIncident,
    isSirenPlaying,
    isStrobeActive,
  ]);

  return null;
};
