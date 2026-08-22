import React from 'react';

interface ShopIllustrationProps {
  variant?: 'card' | 'hero' | 'success';
  className?: string;
}

export const ShopIllustration: React.FC<ShopIllustrationProps> = ({
  variant = 'hero',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Soft lavender back glow */}
      <div className="absolute inset-0 bg-indigo-100/60 rounded-3xl blur-xl -z-10 scale-95" />

      <svg
        viewBox="0 0 280 200"
        className="w-full h-auto max-w-[260px] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft clouds / background accents */}
        <circle cx="50" cy="40" r="18" fill="#EEF2FF" />
        <circle cx="70" cy="35" r="22" fill="#EEF2FF" />
        <circle cx="90" cy="42" r="16" fill="#EEF2FF" />
        <circle cx="210" cy="40" r="18" fill="#EEF2FF" />
        <circle cx="230" cy="35" r="22" fill="#EEF2FF" />

        {/* Shop Building Main Body */}
        <rect x="50" y="80" width="180" height="100" rx="8" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="2" />

        {/* Shop Door */}
        <rect x="75" y="110" width="45" height="70" rx="4" fill="#4338CA" />
        <circle cx="85" cy="145" r="2.5" fill="#E0E7FF" />
        <rect x="80" y="116" width="35" height="24" rx="2" fill="#4F46E5" />

        {/* Shop Window */}
        <rect x="135" y="110" width="75" height="50" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
        <line x1="172.5" y1="110" x2="172.5" y2="160" stroke="#C7D2FE" strokeWidth="2" />
        <line x1="135" y1="135" x2="210" y2="135" stroke="#C7D2FE" strokeWidth="2" />

        {/* Awning Roof */}
        <path
          d="M38 78 C38 74 42 70 46 70 L234 70 C238 70 242 74 242 78 L248 95 C248 100 244 105 238 105 L42 105 C36 105 32 100 32 95 Z"
          fill="#4338CA"
        />

        {/* Awning Stripes */}
        {/* Stripe 1 */}
        <path d="M42 70 L65 70 L60 105 L37 105 C35 105 34 103 34 100 L42 70 Z" fill="#4F46E5" />
        {/* Stripe 2 */}
        <path d="M65 70 L90 70 L85 105 L60 105 Z" fill="#EEF2FF" />
        {/* Stripe 3 */}
        <path d="M90 70 L115 70 L110 105 L85 105 Z" fill="#4F46E5" />
        {/* Stripe 4 */}
        <path d="M115 70 L140 70 L135 105 L110 105 Z" fill="#EEF2FF" />
        {/* Stripe 5 */}
        <path d="M140 70 L165 70 L160 105 L135 105 Z" fill="#4F46E5" />
        {/* Stripe 6 */}
        <path d="M165 70 L190 70 L185 105 L160 105 Z" fill="#EEF2FF" />
        {/* Stripe 7 */}
        <path d="M190 70 L215 70 L210 105 L185 105 Z" fill="#4F46E5" />
        {/* Stripe 8 */}
        <path d="M215 70 L238 70 L246 100 C246 103 245 105 243 105 L210 105 Z" fill="#EEF2FF" />

        {/* Awning Scallops bottom */}
        <circle cx="48.5" cy="105" r="11.5" fill="#4F46E5" />
        <circle cx="72.5" cy="105" r="11.5" fill="#EEF2FF" />
        <circle cx="97.5" cy="105" r="11.5" fill="#4F46E5" />
        <circle cx="122.5" cy="105" r="11.5" fill="#EEF2FF" />
        <circle cx="147.5" cy="105" r="11.5" fill="#4F46E5" />
        <circle cx="172.5" cy="105" r="11.5" fill="#EEF2FF" />
        <circle cx="197.5" cy="105" r="11.5" fill="#4F46E5" />
        <circle cx="222.5" cy="105" r="11.5" fill="#EEF2FF" />
        <circle cx="236" cy="105" r="7" fill="#4F46E5" />

        {/* Potted Plants on ground */}
        {/* Left Plant */}
        <rect x="25" y="165" width="18" height="15" rx="3" fill="#A5B4FC" />
        <path d="M34 165 C26 150 20 152 24 140 C30 148 34 155 34 165 Z" fill="#10B981" />
        <path d="M34 165 C42 150 48 152 44 140 C38 148 34 155 34 165 Z" fill="#059669" />
        <path d="M34 165 C34 146 32 142 34 135 C36 142 34 146 34 165 Z" fill="#34D399" />

        {/* Right Plant */}
        <rect x="237" y="165" width="18" height="15" rx="3" fill="#A5B4FC" />
        <path d="M246 165 C238 150 232 152 236 140 C242 148 246 155 246 165 Z" fill="#10B981" />
        <path d="M246 165 C254 150 260 152 256 140 C250 148 246 155 246 165 Z" fill="#059669" />
        <path d="M246 165 C246 146 244 142 246 135 C248 142 246 146 246 165 Z" fill="#34D399" />

        {/* Ground line */}
        <line x1="15" y1="180" x2="265" y2="180" stroke="#E0E7FF" strokeWidth="3" strokeLinecap="round" />

        {/* Success badge for success variant */}
        {variant === 'success' && (
          <g>
            <circle cx="215" cy="65" r="20" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
            <path
              d="M208 65 L213 70 L223 60"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkles */}
            <circle cx="160" cy="40" r="3" fill="#F59E0B" />
            <circle cx="180" cy="25" r="2" fill="#6366F1" />
            <circle cx="240" cy="50" r="2.5" fill="#EC4899" />
            <circle cx="45" cy="55" r="2.5" fill="#8B5CF6" />
          </g>
        )}
      </svg>
    </div>
  );
};
