import React from 'react';

export const OrderReadyIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => {
  return (
    <div className={`relative flex items-center justify-center mx-auto ${className}`}>
      {/* Soft background radial glow */}
      <div className="absolute inset-0 bg-purple-100 rounded-full filter blur-xl opacity-70 transform scale-90" />
      
      {/* Takeout Bag SVG artwork tailored to reference */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        {/* Bag Base Back Shadow */}
        <ellipse cx="100" cy="175" rx="55" ry="12" fill="#E2D9F3" />

        {/* Bag Left / Shadow Side */}
        <path
          d="M60 70 L72 165 L105 170 L102 65 Z"
          fill="#6B4BA3"
        />

        {/* Bag Right / Front Highlight Side */}
        <path
          d="M102 65 L105 170 L140 162 L132 70 Z"
          fill="#8A67C8"
        />

        {/* Bag Top Fold / Flap */}
        <polygon
          points="60,70 102,65 132,70 96,75"
          fill="#7C56BC"
        />
        <polygon
          points="60,70 96,75 92,85 58,78"
          fill="#5E3F92"
        />
        <polygon
          points="96,75 132,70 130,78 92,85"
          fill="#9775D4"
        />

        {/* Fold crease details */}
        <path
          d="M85 73 L88 167"
          stroke="#5B3E8E"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M118 70 L122 164"
          stroke="#A485DE"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Small sauce / side item box */}
        <rect
          x="126"
          y="145"
          width="26"
          height="20"
          rx="4"
          fill="#523683"
          transform="rotate(6 126 145)"
        />
        <rect
          x="126"
          y="142"
          width="26"
          height="8"
          rx="3"
          fill="#7A57B9"
          transform="rotate(6 126 142)"
        />

        {/* Ready Badge with White Checkmark attached to bag */}
        <g transform="translate(100, 108)">
          <circle cx="0" cy="0" r="16" fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
          <circle cx="0" cy="0" r="13" fill="#6C38CC" />
          <path
            d="M-4.5 0 L-1.5 3.5 L5 -3"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
