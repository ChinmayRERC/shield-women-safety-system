import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Compass,
  Navigation,
  Layers,
  Activity,
  Heart,
  Phone,
  Radio,
  Route,
  Play,
  Square,
  Sparkles,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Incident, SafeZone, RiskZone, ResponderUnit } from '../../types';
import { calculateDistanceKm, formatDistance, CITY_PRESETS } from '../../services/geoService';

// Controller component to re-center map dynamically
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

// Helper for custom SVG DivIcons that never fail to load
const createDivIcon = (type: 'USER' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE' | 'RESPONDER' | 'DESTINATION') => {
  let bg = 'bg-teal-500';
  let border = 'border-white';
  let pulse = '';
  let iconSvg = '';

  if (type === 'USER') {
    bg = 'bg-teal-400';
    border = 'border-teal-100';
    pulse = '<span class="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-75"></span>';
    iconSvg = `<svg class="w-4 h-4 text-navy-950" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`;
  } else if (type === 'DESTINATION') {
    bg = 'bg-indigo-600';
    border = 'border-indigo-200';
    pulse = '<span class="absolute -inset-1 rounded-full bg-indigo-500 animate-pulse opacity-50"></span>';
    iconSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 3v18l7-5 7 5V3z"/></svg>`;
  } else if (type === 'CRITICAL') {
    bg = 'bg-rose-600';
    border = 'border-rose-200';
    pulse = '<span class="absolute -inset-2 rounded-full bg-rose-600 animate-ping opacity-60"></span>';
    iconSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
  } else if (type === 'HIGH') {
    bg = 'bg-amber-500';
    border = 'border-amber-100';
    iconSvg = `<svg class="w-4 h-4 text-navy-950" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else if (type === 'SAFE') {
    bg = 'bg-emerald-500';
    border = 'border-emerald-100';
    iconSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`;
  } else if (type === 'RESPONDER') {
    bg = 'bg-blue-600';
    border = 'border-blue-200';
    pulse = '<span class="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-50"></span>';
    iconSvg = `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`;
  } else {
    bg = 'bg-yellow-500';
    border = 'border-yellow-100';
    iconSvg = `<svg class="w-4 h-4 text-navy-950" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`;
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bg} border-2 ${border} shadow-lg shadow-black/40">
        ${pulse}
        <div class="relative z-10 flex items-center justify-center">${iconSvg}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const IncidentMap: React.FC = () => {
  const {
    userLocation,
    setUserLocation,
    incidents,
    safeZones,
    riskZones,
    responders,
    dispatchUnit,
    resolveIncident,
    addSimLog,
  } = useSafety();

  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showResponders, setShowResponders] = useState(true);
  const [showNavigator, setShowNavigator] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<'SAFE' | 'RISKY'>('SAFE');
  const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
  const walkIntervalRef = useRef<any>(null);

  // Dynamic route waypoints based on current user location
  const destination = {
    lat: userLocation.lat + 0.0075,
    lng: userLocation.lng + 0.0065,
    name: 'Safe Metro Hub & 24/7 Security Concourse',
  };

  // Safe Corridor: passes by high street lighting and Pink Booth
  const safeCorridorWaypoints: [number, number][] = [
    [userLocation.lat, userLocation.lng],
    [userLocation.lat + 0.002, userLocation.lng + 0.001],
    [userLocation.lat + 0.004, userLocation.lng + 0.0035],
    [userLocation.lat + 0.006, userLocation.lng + 0.0055],
    [destination.lat, destination.lng],
  ];

  // Risky Shortcut: passes through unlit lane hazard zone
  const riskyShortcutWaypoints: [number, number][] = [
    [userLocation.lat, userLocation.lng],
    [userLocation.lat + 0.0035, userLocation.lng + 0.0045],
    [userLocation.lat + 0.0055, userLocation.lng + 0.0058],
    [destination.lat, destination.lng],
  ];

  // Walk simulation runner
  const handleToggleWalkSimulation = () => {
    if (isSimulatingWalk) {
      clearInterval(walkIntervalRef.current);
      setIsSimulatingWalk(false);
      addSimLog({
        type: 'SYSTEM',
        title: 'Walk Simulation Paused',
        detail: 'Citizen waypoint progression stopped.',
      });
      return;
    }

    setIsSimulatingWalk(true);
    addSimLog({
      type: 'SYSTEM',
      title: 'AI Walk Progression Started',
      detail: `Simulating transit along ${selectedRoute === 'SAFE' ? 'AI Safe Corridor (96% safety score)' : 'Unlit Hazardous Shortcut (38% score)'}.`,
    });

    const path = selectedRoute === 'SAFE' ? safeCorridorWaypoints : riskyShortcutWaypoints;
    let step = 0;

    walkIntervalRef.current = setInterval(() => {
      step += 1;
      if (step >= path.length) {
        clearInterval(walkIntervalRef.current);
        setIsSimulatingWalk(false);
        addSimLog({
          type: 'SYSTEM',
          title: 'Destination Reached Safely',
          detail: 'Citizen arrived at Metro Security Concourse.',
        });
        return;
      }
      const [nLat, nLng] = path[step];
      setUserLocation({
        lat: Number(nLat.toFixed(5)),
        lng: Number(nLng.toFixed(5)),
        address: `In Transit: Waypoint ${step}/${path.length - 1} (${selectedRoute} route)`,
        timestamp: Date.now(),
        accuracy: 10,
      });
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    };
  }, []);

  // Find nearest safe zone to user
  const nearestSafeZone = safeZones.reduce<{ zone: SafeZone | null; dist: number }>(
    (acc, zone) => {
      const d = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        zone.location.lat,
        zone.location.lng
      );
      if (d < acc.dist) return { zone, dist: d };
      return acc;
    },
    { zone: null, dist: Infinity }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-16 font-mono">
      {/* Top Header & Layer Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Spatial Telemetry & Safe Corridor Routing
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
              OPENSTREETMAP + LEAFLET
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Geospatial tracking with predictive safe route navigation and automated hazard corridor avoidance.
          </p>
        </div>

        {/* Map Layers Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold transition-all ${
              showNavigator
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/40 shadow-tactile'
                : 'bg-obsidian-950 text-slate-400 border-white/[0.06]'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-teal-400" />
            <span>AI CORRIDOR</span>
          </button>

          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
              showSafeZones
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-obsidian-950 text-slate-400 border-white/[0.06]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SHELTERS ({safeZones.length})</span>
          </button>

          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
              showRiskZones
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-obsidian-950 text-slate-400 border-white/[0.06]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>HAZARDS ({riskZones.length})</span>
          </button>

          <button
            onClick={() => setShowResponders(!showResponders)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
              showResponders
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                : 'bg-obsidian-950 text-slate-400 border-white/[0.06]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>FLEET ({responders.length})</span>
          </button>

          {/* City Preset Selector */}
          <select
            onChange={(e) => {
              const selected = CITY_PRESETS.find((c) => c.name.startsWith(e.target.value));
              if (selected) {
                setUserLocation({
                  lat: selected.lat,
                  lng: selected.lng,
                  address: selected.address,
                  timestamp: Date.now(),
                  accuracy: 8,
                });
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-obsidian-950 border border-teal-500/40 text-teal-300 text-xs font-semibold focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="Bengaluru">📍 Bengaluru (MG Road Hub)</option>
            <option value="New Delhi">📍 New Delhi (Connaught Place)</option>
            <option value="Mumbai">📍 Mumbai (Lower Parel)</option>
            <option value="Hyderabad">📍 Hyderabad (Hitec City)</option>
            <option value="Chennai">📍 Chennai (Marina)</option>
          </select>
        </div>
      </div>

      {/* AI Safe Route Comparison Bar */}
      {showNavigator && (
        <div className="p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0">
              <Route className="w-4 h-4 text-teal-400" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Dynamic Pathfinding Engine
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  TARGET: {destination.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => setSelectedRoute('SAFE')}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                    selectedRoute === 'SAFE'
                      ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold shadow-tactile'
                      : 'bg-obsidian-950 border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>ROUTE A: AI SAFE CORRIDOR (96% SAFE • 1.4 KM • 100% LED)</span>
                </button>

                <button
                  onClick={() => setSelectedRoute('RISKY')}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                    selectedRoute === 'RISKY'
                      ? 'bg-rose-500/10 border-rose-400 text-rose-300 font-bold shadow-tactile'
                      : 'bg-obsidian-950 border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>ROUTE B: UNLIT SHORTCUT (38% SAFE • 0.9 KM • 0 LM)</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleWalkSimulation}
            className={`px-4 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all flex-shrink-0 ${
              isSimulatingWalk
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse'
                : 'bg-teal-accent hover:bg-teal-400 text-obsidian-950 shadow-glow-teal'
            }`}
          >
            {isSimulatingWalk ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulatingWalk ? 'HALT SIMULATION' : 'SIMULATE REAL-TIME WALK'}</span>
          </button>
        </div>
      )}

      {/* Main Map Canvas */}
      <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-white/[0.1] shadow-tactile-lg bg-obsidian-950">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-10"
        >
          {/* Map Recenter Helper */}
          <MapRecenter lat={userLocation.lat} lng={userLocation.lng} />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* AI Route Polylines */}
          {showNavigator && (
            <>
              {/* Route A: Safe Corridor Polyline */}
              <Polyline
                positions={safeCorridorWaypoints}
                pathOptions={{
                  color: selectedRoute === 'SAFE' ? '#00F0FF' : '#059669',
                  weight: selectedRoute === 'SAFE' ? 6 : 3,
                  opacity: selectedRoute === 'SAFE' ? 0.95 : 0.45,
                  dashArray: selectedRoute === 'SAFE' ? undefined : '6, 8',
                }}
              />

              {/* Route B: High Risk Shortcut Polyline */}
              <Polyline
                positions={riskyShortcutWaypoints}
                pathOptions={{
                  color: '#EF4444',
                  weight: selectedRoute === 'RISKY' ? 6 : 3,
                  opacity: selectedRoute === 'RISKY' ? 0.95 : 0.45,
                  dashArray: '8, 8',
                }}
              />

              {/* Destination Marker */}
              <Marker
                position={[destination.lat, destination.lng]}
                icon={createDivIcon('DESTINATION')}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-extrabold text-navy-950">🎯 {destination.name}</div>
                    <div className="text-slate-600 text-[11px]">
                      24/7 Monitored Transit Sanctuary with CCTV & Private Security Desk
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* User Live Location Marker */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createDivIcon('USER')}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-xs space-y-1">
                <div className="font-extrabold text-navy-950 flex items-center gap-1">
                  <span>📍 Your Real-Time Location</span>
                </div>
                <div className="text-slate-600 font-mono text-[10px]">
                  {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                </div>
                <div className="text-slate-700 text-[11px] font-sans">
                  {userLocation.address || 'Active GPS coordinates locked'}
                </div>
                {nearestSafeZone.zone && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-emerald-800 font-medium">
                    Nearest Safe Zone: <strong>{nearestSafeZone.zone.name}</strong> ({formatDistance(nearestSafeZone.dist)})
                  </div>
                )}
              </div>
            </Popup>
          </Marker>

          {/* User Accuracy Radius */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={userLocation.accuracy || 45}
            pathOptions={{
              color: '#00F0FF',
              fillColor: '#00F0FF',
              fillOpacity: 0.15,
              weight: 1.5,
            }}
          />

          {/* Active & Past Incidents */}
          {incidents.map((incident) => {
            const iconType =
              incident.riskLevel === 'CRITICAL'
                ? 'CRITICAL'
                : incident.riskLevel === 'HIGH'
                ? 'HIGH'
                : 'MODERATE';

            return (
              <Marker
                key={incident.id}
                position={[incident.location.lat, incident.location.lng]}
                icon={createDivIcon(iconType)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs space-y-2 min-w-[210px]">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-navy-950 font-mono">{incident.id}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          incident.status === 'PENDING'
                            ? 'bg-rose-100 text-rose-700'
                            : incident.status === 'DISPATCHED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {incident.status}
                      </span>
                    </div>

                    <div className="text-slate-700">
                      <div><strong>Citizen:</strong> {incident.userName}</div>
                      <div><strong>Trigger:</strong> {incident.triggerType.replace(/_/g, ' ')}</div>
                      <div><strong>Risk Score:</strong> {incident.riskScore}/100 [{incident.riskLevel}]</div>
                      {incident.heartRate && <div><strong>Heart Rate:</strong> {incident.heartRate} BPM</div>}
                    </div>

                    {incident.status === 'PENDING' && (
                      <button
                        onClick={() => dispatchUnit(incident.id, 'resp-1')}
                        className="w-full mt-2 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow"
                      >
                        Dispatch Pink Patrol (ETA 3m)
                      </button>
                    )}

                    {incident.status === 'DISPATCHED' && (
                      <button
                        onClick={() => resolveIncident(incident.id, 'Resolved via map dispatcher')}
                        className="w-full mt-2 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow"
                      >
                        Mark Verified Safe
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Safe Zones (Police Stations, Pink Booths, Hospitals) */}
          {showSafeZones &&
            safeZones.map((sz) => (
              <Marker
                key={sz.id}
                position={[sz.location.lat, sz.location.lng]}
                icon={createDivIcon('SAFE')}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sz.name}</span>
                    </div>
                    <div className="text-slate-600 text-[11px]">{sz.address}</div>
                    <div className="text-slate-700 text-[10px]">
                      <strong>Open:</strong> {sz.isOpen24x7 ? '24/7 Active Booth' : 'Day hours'}
                    </div>
                    <div className="text-slate-700 text-[10px]">
                      <strong>Emergency Line:</strong> {sz.phone}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* High-Risk Zones (Hazard Geofences) */}
          {showRiskZones &&
            riskZones.map((rz) => (
              <Circle
                key={rz.id}
                center={[rz.center.lat, rz.center.lng]}
                radius={rz.radiusMeters}
                pathOptions={{
                  color: '#EF4444',
                  fillColor: '#EF4444',
                  fillOpacity: 0.18,
                  weight: 2,
                  dashArray: '4, 6',
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-bold text-rose-900 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{rz.name}</span>
                    </div>
                    <div className="text-[10px] text-rose-800 font-mono">
                      Risk Vulnerability Score: {rz.riskScore}/100
                    </div>
                    <div className="text-[11px] text-slate-700 italic">
                      {rz.reason}
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Active Responders */}
          {showResponders &&
            responders.map((resp) => (
              <Marker
                key={resp.id}
                position={[resp.location.lat, resp.location.lng]}
                icon={createDivIcon('RESPONDER')}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs space-y-1">
                    <div className="font-bold text-blue-900">{resp.name}</div>
                    <div className="text-slate-600 text-[11px]">
                      <strong>Status:</strong> {resp.status} (ETA: {resp.etaMinutes} mins)
                    </div>
                    <div className="text-slate-600 text-[11px]">
                      <strong>Unit Hotline:</strong> {resp.contactNumber}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Map Legend Overlay in bottom corner */}
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-navy-950/90 border border-navy-700 backdrop-blur-md shadow-xl text-[11px] space-y-1.5 text-slate-300 pointer-events-auto">
          <div className="font-bold text-white text-xs mb-1">Map Telemetry Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-400 border border-white" />
            <span>Live User Position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600 border border-white" />
            <span>Target Safe Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 bg-teal-400 rounded-full" />
            <span>AI Safe Corridor (96% Score)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-1 bg-rose-500 rounded-full border-dashed" />
            <span>Hazard Corridor (38% Score)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span>24/7 Safe Shelter / Pink Booth</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
            <span>Patrol PCR Unit</span>
          </div>
        </div>
      </div>

      {/* Nearest Safety Shelters Proximity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {safeZones.slice(0, 3).map((zone) => {
          const dist = calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            zone.location.lat,
            zone.location.lng
          );
          return (
            <div
              key={zone.id}
              className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 hover:border-emerald-500/40 transition-all flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {zone.type.replace(/_/g, ' ')}
                </span>
                <h4 className="text-xs font-bold text-white mt-1">{zone.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{zone.address}</p>
                <div className="text-[11px] text-slate-300 font-mono pt-1">
                  📞 {zone.phone}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-base font-extrabold text-teal-300 font-mono block">
                  {formatDistance(dist)}
                </span>
                <span className="text-[10px] text-slate-400">away</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
