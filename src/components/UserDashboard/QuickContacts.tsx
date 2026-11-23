import React, { useState } from 'react';
import { Users, Phone, Star, Plus, Trash2, Send, MessageSquare, ExternalLink } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { EmergencyContact } from '../../types';

export const QuickContacts: React.FC = () => {
  const { contacts, addContact, deleteContact, togglePrimaryContact, userProfile, userLocation, addSimLog } =
    useSafety();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [previewContact, setPreviewContact] = useState<EmergencyContact | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addContact({
      name: name.trim(),
      phone: phone.trim(),
      relation,
      isPrimary: contacts.length === 0,
    });
    setName('');
    setPhone('');
    setIsAdding(false);
  };

  const handleTestSms = (contact: EmergencyContact) => {
    setPreviewContact(contact);
    addSimLog({
      type: 'SMS',
      title: `Simulated SOS SMS to ${contact.name}`,
      detail: `[SIMULATED SMS] "SHIELD EMERGENCY: ${userProfile.name} needs help! Live GPS: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}"`,
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-obsidian-900 border border-white/[0.08] shadow-tactile space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Trusted Guardians & SMS Broadcast Matrix
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Instantly notified with live coordinates on SOS trigger
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1 rounded-md bg-obsidian-950 hover:bg-obsidian-850 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD GUARDIAN</span>
        </button>
      </div>

      {/* Add Contact Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-3.5 rounded-xl bg-obsidian-950 border border-white/[0.08] space-y-3 font-mono">
          <div className="text-xs font-bold text-teal-300">REGISTER NEW EMERGENCY GUARDIAN</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-teal-400"
              required
            />
            <input
              type="text"
              placeholder="Phone (+91 ...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-teal-400"
              required
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs text-white focus:outline-none focus:border-teal-400"
            >
              <option value="Sister">Sister</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Partner">Partner</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded-md text-xs text-slate-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-teal-accent hover:bg-teal-400 text-obsidian-950 font-bold text-xs"
            >
              SAVE GUARDIAN
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
              contact.isPrimary
                ? 'bg-obsidian-950 border-teal-500/40 shadow-tactile'
                : 'bg-obsidian-950 border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                {contact.isPrimary ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    Primary
                  </span>
                ) : (
                  <button
                    onClick={() => togglePrimaryContact(contact.id)}
                    className="text-[10px] text-slate-400 hover:text-amber-300"
                    title="Make Primary Guardian"
                  >
                    Set Primary
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{contact.phone}</p>
              <p className="text-[10px] text-teal-400/80 uppercase font-mono">{contact.relation}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-navy-800/80 text-xs">
              <button
                onClick={() => handleTestSms(contact)}
                className="text-[11px] text-teal-300 hover:text-teal-200 flex items-center gap-1"
                title="Preview Simulated SMS Broadcast"
              >
                <Send className="w-3 h-3" />
                <span>Simulate SMS</span>
              </button>

              <button
                onClick={() => deleteContact(contact.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Remove Contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated SMS Preview Modal */}
      {previewContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade">
          <div className="w-full max-w-md rounded-2xl bg-navy-900 border border-teal-500/40 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase font-mono">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Simulated SMS Delivery Packet</span>
              </div>
              <button
                onClick={() => setPreviewContact(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Recipient: <strong className="text-white">{previewContact.name} ({previewContact.phone})</strong></span>
                <span className="text-teal-400 font-mono">[SIMULATED]</span>
              </div>
              <div className="p-3 rounded-lg bg-navy-900 border border-teal-500/20 text-slate-200 font-sans leading-relaxed">
                🚨 <strong>SHIELD EMERGENCY ALERT</strong>: {userProfile.name} has triggered an SOS alert!
                <br /><br />
                📍 <strong>Live GPS Coordinates</strong>: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                <br />
                🗺️ <a
                  href={`https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-300 underline inline-flex items-center gap-1"
                >
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
                <br />
                🔋 Battery: 42% | Heart Rate: 78 BPM | Police CAD Notified
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic text-center">
              Demonstration note: No real SMS carrier charges incurred. Logged to local state terminal.
            </div>

            <button
              onClick={() => setPreviewContact(null)}
              className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs"
            >
              Done Previewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
