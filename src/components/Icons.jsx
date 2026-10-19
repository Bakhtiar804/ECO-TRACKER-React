// Icon Components - Reusable SVG icons
import { forwardRef } from 'react';

export const LeafIcon = forwardRef(({ className = '', size = 22, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#38D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
));

export const LocationIcon = forwardRef(({ className = '', size = 18, stroke = '#0284C7', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
));

export const CarIcon = forwardRef(({ className = '', size = 22, stroke = '#2cc088', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
));

export const TreeIcon = forwardRef(({ className = '', size = 22, stroke = '#0284C7', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M8 6h8" />
    <path d="M6 10h12" />
    <path d="M12 2v20" />
  </svg>
));

export const OxygenIcon = forwardRef(({ className = '', size = 22, stroke = '#DC2626', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 19v3" />
    <path d="M12 19a7 7 0 0 1-7-7c0-1.8.7-3.4 1.8-4.6A6 6 0 0 1 12 3a6 6 0 0 1 5.2 4.4A7 7 0 0 1 12 19Z" />
  </svg>
));

export const AQIIcon = forwardRef(({ className = '', size = 22, stroke = '#0284C7', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
));

export const ClockIcon = forwardRef(({ className = '', size = 14, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
));

export const CheckIcon = forwardRef(({ className = '', size = 18, stroke = '#38D399', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
));

export const AlertIcon = forwardRef(({ className = '', size = 18, stroke = '#DC2626', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
));

export const ArrowRightIcon = forwardRef(({ className = '', size = 18, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
));

export const RefreshIcon = forwardRef(({ className = '', size = 18, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
));

export const MenuIcon = forwardRef(({ className = '', size = 24, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
));

export const ElectricIcon = forwardRef(({ className = '', size = 18, stroke = '#0284C7', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
));

export const WasteIcon = forwardRef(({ className = '', size = 18, stroke = '#0284C7', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
));

export const InfoIcon = forwardRef(({ className = '', size = 18, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
));

export const GlobeIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
));

export const BookIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
));

export const LinkIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
));

export const CheckCircleIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 8 12 12 8 10" />
  </svg>
));

export const ZapIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
));

export const RecycleIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M7 19v-6.5a2.5 2.5 0 0 1 5 0V19" />
    <path d="M17 19v-6.5a2.5 2.5 0 0 0 -5 0V19" />
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
  </svg>
));

export const PlaneIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M22 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2.05a2.5 2.5 0 0 1-1.82-2.2L15.24 2.3a.5.5 0 0 0-.95 0L10.3 5.8a2.5 2.5 0 0 1-1.82 2.2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h1.4" />
    <path d="M16 3.5a2.5 2.5 0 0 1 2.2 1.8l1.2 1.2c.8.8 1.1 2 .3 3.2" />
    <path d="M8 21h8" />
  </svg>
));

export const TrendingDownIcon = forwardRef(({ className = '', size = 16, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="23 4 13 14 9 10 5 14" />
  </svg>
));

export const ShareIcon = forwardRef(({ className = '', size = 16, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
));

export const DownloadIcon = forwardRef(({ className = '', size = 16, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
));

export const BarChartIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
));

export const CalculatorIcon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h12M10 12h8M6 16h12" strokeWidth="1.5" />
  </svg>
));

export const Leaf2Icon = forwardRef(({ className = '', size = 18, stroke = 'currentColor', ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
));