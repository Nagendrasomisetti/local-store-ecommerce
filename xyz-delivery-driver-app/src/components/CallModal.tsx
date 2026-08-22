import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Store, ShieldCheck } from 'lucide-react';

interface CallModalProps {
  contact: { name: string; phone: string; role: 'Shop' | 'Customer' } | null;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ contact, onClose }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isCalling, setIsCalling] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  useEffect(() => {
    if (!contact) return;
    setIsCalling(true);
    setCallDuration(0);
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [contact]);

  if (!contact) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          {contact.role === 'Shop' ? <Store className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          <span>Calling {contact.role}</span>
        </div>

        {/* Contact Avatar */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 shadow-lg">
            {contact.role === 'Shop' ? <Store className="w-10 h-10 text-blue-400" /> : <User className="w-10 h-10 text-emerald-400" />}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
            <Phone className="w-3 h-3" />
          </div>
        </div>

        {/* Contact Details */}
        <h3 className="text-xl font-bold text-white mb-1">{contact.name}</h3>
        <p className="text-sm font-medium text-slate-400 mb-2">{contact.phone}</p>
        
        {/* Masked Number / Security Notice */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>XYZ Number Masking is Active for privacy</span>
        </div>

        {/* Call Timer */}
        <div className="text-sm font-mono text-emerald-400 font-bold mb-8">
          {callDuration > 2 ? `Connected • ${formatTime(callDuration - 2)}` : 'Ringing...'}
        </div>

        {/* Call Controls */}
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-colors ${
              isMuted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          <button 
            onClick={() => setSpeakerOn(!speakerOn)}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-colors ${
              speakerOn ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-[11px] font-medium">{speakerOn ? 'Speaker On' : 'Speaker'}</span>
          </button>

          <a 
            href={`tel:${contact.phone}`}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex flex-col items-center gap-1.5 transition-colors"
          >
            <Phone className="w-5 h-5 text-blue-400" />
            <span className="text-[11px] font-medium">Native App</span>
          </a>
        </div>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};
