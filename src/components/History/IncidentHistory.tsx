import React, { useState } from 'react';
import {
  History,
  Download,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { storageService } from '../../services/storage';

export const IncidentHistory: React.FC = () => {
  const { incidents, setActiveTab } = useSafety();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter((inc) => {
    const matchesFilter = filter === 'ALL' || inc.status === filter;
    const matchesSearch =
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.userName.toLowerCase().includes(search.toLowerCase()) ||
      inc.triggerType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `shield-emergency-audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['Incident ID', 'Timestamp', 'Citizen', 'Trigger', 'Risk Score', 'Risk Level', 'Status', 'Latitude', 'Longitude', 'Responder'];
    const rows = incidents.map((inc) => [
      inc.id,
      inc.timestamp,
      `"${inc.userName}"`,
      inc.triggerType,
      inc.riskScore,
      inc.riskLevel,
      inc.status,
      inc.location.lat,
      inc.location.lng,
      `"${inc.assignedResponder || 'None'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shield-incident-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset incident records and local settings back to default hackathon demo state?')) {
      storageService.resetToDemo();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      {/* Title & Action Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile font-mono">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Incident Audit Trail & Telemetry Archive
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
              IMMUTABLE RECORD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Chronological audit ledger of all distress alarms, automated IoT sensor triggers, and dispatched unit resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-tactile"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-850 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-tactile"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-3 py-1.5 rounded-lg bg-obsidian-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/40 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Reset to default demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DEMO</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-tactile font-mono">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, citizen name, trigger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {['ALL', 'PENDING', 'DISPATCHED', 'RESOLVED', 'FALSE_ALARM'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                filter === status
                  ? 'bg-teal-accent text-obsidian-950 font-bold'
                  : 'bg-obsidian-950 text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Timeline & Table */}
      <div className="space-y-3">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-tactile space-y-3 font-mono"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-black text-sm text-white">{inc.id}</span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                    inc.status === 'PENDING'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : inc.status === 'DISPATCHED'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : inc.status === 'RESOLVED'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                  }`}
                >
                  {inc.status}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(inc.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">THREAT SCORE:</span>
                <span
                  className={`font-black ${
                    inc.riskScore >= 75
                      ? 'text-rose-400'
                      : inc.riskScore >= 50
                      ? 'text-amber-400'
                      : 'text-teal-300'
                  }`}
                >
                  {inc.riskScore}/100 [{inc.riskLevel}]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">CITIZEN</span>
                <span className="font-semibold text-white mt-0.5 block font-sans">{inc.userName}</span>
                <span className="text-[11px] text-teal-300">{inc.userPhone}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">TRIGGER VECTOR</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {inc.triggerType.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-slate-400">{inc.deviceInfo || 'Mobile Client'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Assigned Unit</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {inc.assignedResponder || 'No unit assigned'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Lat: {inc.location.lat.toFixed(4)}, Lng: {inc.location.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Notes timeline preview */}
            {inc.notes && inc.notes.length > 0 && (
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800/80 space-y-1 text-xs font-mono text-slate-300">
                {inc.notes.map((note, nIdx) => (
                  <div key={nIdx} className="line-clamp-1">
                    <span className="text-teal-400">•</span> {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 rounded-2xl bg-navy-900 border border-navy-800 text-center text-slate-400 text-xs">
            No incident records match the current filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
