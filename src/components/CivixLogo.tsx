import React from 'react';

export const CivixLogo = ({ className = "h-12 w-auto", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="8 5 76 28" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      {...props}
    >
      <g id="logo-mark">
        {/* The Civic Curve (Left balance stroke / 'C') */}
        <path 
          d="M24 12C18 12 14 16 14 21C14 26 18 30 24 30" 
          stroke="var(--ink)" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        {/* The Ledger Baseline Divider */}
        <path 
          d="M12 30H32" 
          stroke="var(--ink)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        {/* The Weight Anchor Metric Line (the 'i' stem) */}
        <path 
          d="M28 14V30" 
          stroke="var(--ink)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        {/* The Seal - Data-driven alignment point (the 'i' dot) */}
        <circle 
          cx="28" 
          cy="9" 
          r="3" 
          fill="var(--seal)" 
        />
      </g>

      {/* "vix" positioned close to the mark to read as a single word */}
      <text 
        x="32" 
        y="30" 
        fill="var(--ink)" 
        style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontSize: '26px',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}
      >
        vix
      </text>
    </svg>
  );
};

export default CivixLogo;
