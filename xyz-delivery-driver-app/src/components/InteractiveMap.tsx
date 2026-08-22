import React, { useState, useEffect } from 'react';
import { DeliveryOrder } from '../types';
import { 
  Navigation, 
  MapPin, 
  Store, 
  User, 
  Compass, 
  LocateFixed, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX,
  Clock,
  Route
} from 'lucide-react';

interface InteractiveMapProps {
  order: DeliveryOrder;
  currentPhase: 'pickup' | 'dropoff';
  onArrived?: () => void;
  compact?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  order,
  currentPhase,
  compact = false,
}) => {
  const [driverProgress, setDriverProgress] = useState(currentPhase === 'pickup' ? 0.35 : 0.65);
  const [isNavigating, setIsNavigating] = useState(true);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Shop & customer coords or fallback defaults
  const startX = currentPhase === 'pickup' ? 18 : (order.shop_coordinates?.x ?? 30);
  const startY = currentPhase === 'pickup' ? 22 : (order.shop_coordinates?.y ?? 35);
  const destX = currentPhase === 'pickup' ? (order.shop_coordinates?.x ?? 30) : (order.customer_coordinates?.x ?? 75);
  const destY = currentPhase === 'pickup' ? (order.shop_coordinates?.y ?? 35) : (order.customer_coordinates?.y ?? 78);

  // Interpolated driver position along the route
  const currentDriverX = startX + (destX - startX) * driverProgress;
  const currentDriverY = startY + (destY - startY) * driverProgress;

  // Waypoints for curved realistic road routing
  const midWayX = (startX + destX) / 2 + 10;
  const midWayY = (startY + destY) / 2 - 8;
  const routePath = `M ${startX} ${startY} Q ${midWayX} ${midWayY} ${destX} ${destY}`;

  // Simulated live movement
  useEffect(() => {
    if (!isNavigating) return;
    const interval = setInterval(() => {
      setDriverProgress(prev => {
        if (prev >= 0.95) return 0.95;
        return prev + 0.015;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isNavigating]);

  const targetName = currentPhase === 'pickup' ? order.shop_name : order.customer_name;
  const targetAddress = currentPhase === 'pickup' ? order.shop_address : order.customer_address;
  const etaText = currentPhase === 'pickup' ? '4 min (450m)' : `${order.estimated_time} (${order.distance})`;

  return (
    <div className={`relative w-full ${compact ? 'h-48' : 'h-72 sm:h-84'} bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none`}>
      {/* Background Stylized Map Grid & Roads */}
      <svg 
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Map Terrain */}
        <rect width="100" height="100" fill="url(#mapBg)" />

        {/* Land Parcels & Parks */}
        <rect x="5" y="10" width="25" height="20" rx="3" fill="#14243b" opacity="0.7" />
        <rect x="35" y="5" width="40" height="18" rx="3" fill="#132c2a" opacity="0.6" />
        <rect x="60" y="30" width="32" height="25" rx="3" fill="#14243b" opacity="0.7" />
        <rect x="10" y="60" width="30" height="30" rx="3" fill="#132c2a" opacity="0.5" />
        <rect x="50" y="65" width="42" height="28" rx="3" fill="#14243b" opacity="0.7" />

        {/* City Road Network Grid */}
        <path d="M 0 25 L 100 25" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 0 55 L 100 55" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 0 85 L 100 85" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 25 0 L 25 100" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 55 0 L 55 100" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 80 0 L 80 100" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />

        {/* Diagonal Arterial Road */}
        <path d="M 0 90 Q 45 45 100 10" stroke="#475569" strokeWidth="3" fill="none" opacity="0.7" />

        {/* Active Route Glow & Polyline */}
        <path
          d={routePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#glow)"
        />
        <path
          d={routePath}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="3.5"
          strokeDasharray="4 1"
          strokeLinecap="round"
        />

        {/* Start / Origin Point */}
        <circle cx={startX} cy={startY} r="3" fill="#3b82f6" />
        <circle cx={startX} cy={startY} r="5" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Destination Target Marker */}
        <circle cx={destX} cy={destY} r="4" fill="#10b981" />
        <circle cx={destX} cy={destY} r="7" stroke="#34d399" strokeWidth="1.2" fill="none" className="pulse-ring-animation" />
      </svg>

      {/* Driver Moving Vehicle Icon Pin */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out pointer-events-none z-20"
        style={{ left: `${currentDriverX}%`, top: `${currentDriverY}%` }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <Navigation className="w-4 h-4 transform rotate-45" />
          </div>
          <div className="absolute -inset-1 rounded-full bg-blue-400 opacity-40 pulse-ring-animation"></div>
        </div>
      </div>

      {/* Target Marker HTML Overlay */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none z-10"
        style={{ left: `${destX}%`, top: `${destY}%` }}
      >
        <div className="flex flex-col items-center">
          <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-0.5">
            {currentPhase === 'pickup' ? 'Shop' : 'Customer'}
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow">
            {currentPhase === 'pickup' ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
          </div>
        </div>
      </div>

      {/* Top Turn-by-Turn Nav HUD Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-400">
              {currentPhase === 'pickup' ? 'Navigating to Pickup' : 'Navigating to Customer'}
            </p>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {targetName}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setVoiceMuted(!voiceMuted)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={voiceMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
          >
            {voiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
          </button>
          <div className="bg-slate-800 px-2 py-1 rounded-lg flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <Clock className="w-3 h-3" />
            <span>{etaText}</span>
          </div>
        </div>
      </div>

      {/* Bottom Map Controls (Recenter, Zoom, Simulate Step) */}
      <div className="absolute bottom-2 right-2 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 1.8))}
          className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center text-xs shadow-md"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
          className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center text-xs shadow-md"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setDriverProgress(prev => (prev < 0.9 ? prev + 0.2 : 0.95));
          }}
          className="w-7 h-7 rounded-lg bg-blue-600 border border-blue-500 text-white flex items-center justify-center text-xs shadow-md"
          title="Recenter & Fast Forward GPS"
        >
          <LocateFixed className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Address pill at bottom-left */}
      <div className="absolute bottom-2 left-2 z-20 max-w-[70%] bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 truncate shadow">
        <span className="text-slate-400 font-medium mr-1">Destination:</span>
        <span className="text-white font-semibold">{targetAddress}</span>
      </div>
    </div>
  );
};
