import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Send,
  Terminal,
  Trash2,
  Search,
  Filter,
  Check,
  Compass,
  Navigation,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { Incident } from '../../types';

export const IncidentCommand: React.FC = () => {
  const {
    incidents,
    responders,
    dispatchUnit,
    updateIncidentState,
    resolveIncident,
    simLogs,
    clearSimLogs,
    setActiveTab,
    activeIncident,
    setUserLocation,
  } = useSafety();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    incidents.length > 0 ? incidents[0].id : null
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

  // Auto-select latest active incident if one was triggered
  useEffect(() => {
    if (activeIncident) {
      setSelectedIncidentId(activeIncident.id);
    }
  }, [activeIncident]);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter((inc) => {
    const matchesStatus = filterStatus === 'ALL' || inc.status === filterStatus;
    const matchesSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.triggerType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = incidents.filter((i) => i.status === 'PENDING').length;
  const dispatchedCount = incidents.filter((i) => i.status === 'DISPATCHED' || i.status === 'ON_SCENE').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const availableResponders = responders.filter((r) => r.status === 'AVAILABLE');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedIncident) return;
    updateIncidentState(selectedIncident.id, selectedIncident.status, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Precision CAD Header */}
      <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              Municipal CAD Emergency Dispatch Terminal (112 CAD MESH)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
              STATION: BLR-CENTRAL-01
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Computer-Aided Dispatch operations console for women's emergency services, Pink Patrol fleets, and campus quick response units.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('map')}
            className="px-3.5 py-2 rounded-xl bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-tactile"
          >
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>OPEN SPATIAL MAP</span>
          </button>
        </div>
      </div>

      {/* KPI CAD Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-obsidian-900 border border-rose-500/30 shadow-tactile">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-rose-300 font-bold uppercase">P1 PENDING TRIAGE</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{pendingCount}</div>
          <span className="text-[10px] font-mono text-slate-400">UNITS UNASSIGNED</span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-900 border border-blue-500/30 shadow-tactile">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-blue-300 font-bold uppercase">UNITS EN ROUTE</span>
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{dispatchedCount}</div>
          <span className="text-[10px] font-mono text-slate-400">PINK PATROLS MOBILIZED</span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-900 border border-emerald-500/30 shadow-tactile">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-emerald-300 font-bold uppercase">RESOLVED PASSAGES</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">{resolvedCount}</div>
          <span className="text-[10px] font-mono text-slate-400">ESCORT VERIFIED</span>
        </div>

        <div className="p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-teal-300 font-bold uppercase">PATROL READINESS</span>
            <Activity className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {availableResponders.length} / {responders.length}
          </div>
          <span className="text-[10px] font-mono text-slate-400">AVG SECTOR ETA: 3.4M</span>
        </div>
      </div>

      {/* Main Two-Column Incident Queue & Dispatch Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incident Queue & Filters (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/[0.08] space-y-3 shadow-tactile">
            {/* Filter buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono font-bold">
                {['ALL', 'PENDING', 'DISPATCHED', 'RESOLVED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      filterStatus === status
                        ? 'bg-teal-accent text-obsidian-950 font-bold'
                        : 'bg-obsidian-950 text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                {filteredIncidents.length} RECORDS
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket ID, citizen, trigger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Incident Cards Queue */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-left font-mono ${
                      isSelected
                        ? 'bg-obsidian-800 border-teal-500/50 shadow-tactile'
                        : 'bg-obsidian-950 border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{inc.id}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                            inc.status === 'PENDING'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : inc.status === 'DISPATCHED'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate font-sans">{inc.userName}</span>
                      <span className="font-bold text-rose-400">
                        SCORE: {inc.riskScore} [{inc.riskLevel}]
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                      TRIGGER: {inc.triggerType.replace(/_/g, ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Incident Detail & Dispatcher Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedIncident ? (
            <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4">
              {/* Selected header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-base font-black text-white">{selectedIncident.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        selectedIncident.status === 'PENDING'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : selectedIncident.status === 'DISPATCHED'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {selectedIncident.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    TIMESTAMP: {new Date(selectedIncident.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setUserLocation({
                        lat: selectedIncident.location.lat,
                        lng: selectedIncident.location.lng,
                        address: selectedIncident.location.address || 'Incident Scene',
                        timestamp: Date.now(),
                        accuracy: 10,
                      });
                      setActiveTab('map');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-400" />
                    <span>TRACK ON MAP</span>
                  </button>

                  {selectedIncident.status === 'DISPATCHED' && (
                    <button
                      onClick={() =>
                        updateIncidentState(
                          selectedIncident.id,
                          'ON_SCENE',
                          'Patrol unit arrived at incident scene. Visual contact established with citizen.'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-tactile"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>UNIT ON SCENE</span>
                    </button>
                  )}

                  {selectedIncident.status !== 'RESOLVED' && (
                    <button
                      onClick={() => resolveIncident(selectedIncident.id, 'Citizen escorted to safe zone by responder team')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-tactile"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MARK RESOLVED</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Citizen & Location Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block">CITIZEN IDENTITY</span>
                  <span className="font-bold text-white mt-0.5 block truncate font-sans">{selectedIncident.userName}</span>
                  <span className="text-[11px] text-teal-300">{selectedIncident.userPhone}</span>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block">THREAT SCORING</span>
                  <span className="text-base font-black text-rose-400 mt-0.5 block">
                    {selectedIncident.riskScore} / 100
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedIncident.riskLevel}</span>
                </div>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block">GPS COORDINATES</span>
                  <span className="text-teal-300 text-[11px] block truncate">
                    {selectedIncident.location.lat.toFixed(5)}, {selectedIncident.location.lng.toFixed(5)}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                    {selectedIncident.location.address || 'Urban Sector'}
                  </span>
                </div>
              </div>

              {/* Assigned Responder Unit */}
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/[0.06] space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-teal-300">
                    CAD Rapid Responder Fleet
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ASSIGNED: <strong className="text-white">{selectedIncident.assignedResponder || 'UNASSIGNED'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {responders.map((resp) => {
                    const isAssigned = selectedIncident.assignedResponder === resp.name;
                    return (
                      <button
                        key={resp.id}
                        onClick={() => dispatchUnit(selectedIncident.id, resp.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start justify-between ${
                          isAssigned
                            ? 'bg-blue-600/10 border-blue-500/50 text-white'
                            : 'bg-obsidian-900 border-white/[0.06] hover:border-teal-500/40 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white truncate font-sans">{resp.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            STATUS: <strong>{resp.status}</strong> • ETA: {resp.etaMinutes}M
                          </div>
                        </div>
                        {isAssigned ? (
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        ) : (
                          <span className="text-[9px] font-bold text-teal-300 uppercase px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                            DISPATCH
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Responder Notes Log & Append Form */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                  Incident Action Log & Notes
                </span>

                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/[0.06] space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedIncident.notes && selectedIncident.notes.length > 0 ? (
                    selectedIncident.notes.map((note, nIdx) => (
                      <div key={nIdx} className="text-xs text-slate-300 font-mono">
                        <span className="text-teal-400">&gt;</span> {note}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic font-mono">No operational notes recorded yet.</div>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter dispatcher log or patrol update..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-mono font-bold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>LOG</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-obsidian-900 border border-white/[0.08] text-center text-slate-400 text-xs font-mono">
              Awaiting incident ticket selection.
            </div>
          )}
        </div>
      </div>

      {/* Real-time CAD Broadcast Terminal for Hackathon Evaluation */}
      <div className="p-4 rounded-2xl bg-obsidian-950 border border-white/[0.08] shadow-tactile space-y-2.5 font-mono">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
          <div className="flex items-center gap-2 text-teal-400 font-bold uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulated Emergency Network Telemetry Stream (CAD Event Bus)</span>
          </div>
          <button
            onClick={clearSimLogs}
            className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>CLEAR STREAM</span>
          </button>
        </div>

        <div className="space-y-1 max-h-40 overflow-y-auto text-xs text-slate-300">
          {simLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-obsidian-900 p-1 rounded">
              <span className="text-slate-500 text-[10px] whitespace-nowrap">{log.time}</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                  log.type === 'SMS'
                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                    : log.type === 'DISPATCH'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    : log.type === 'IOT'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                }`}
              >
                {log.type}
              </span>
              <span className="font-semibold text-white">{log.title}:</span>
              <span className="text-slate-400 line-clamp-1">{log.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
