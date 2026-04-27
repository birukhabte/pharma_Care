'use client';

import React from 'react';

// Comprehensive icon set with fallback SVGs
const createIcon = (paths: string[], viewBox = "0 0 24 24") => 
  ({ size = 24, className = '', ...props }: any) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );

export const AlertTriangle = createIcon([
  "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
  "M12 9v4",
  "m12 17 .01 0"
]);

export const Trash2 = createIcon([
  "M3 6h18",
  "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
  "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
]);

export const X = createIcon([
  "M18 6 6 18",
  "m6 6 12 12"
]);

export const Search = createIcon([
  "m21 21-4.35-4.35"
]);

export const Plus = createIcon([
  "M5 12h14",
  "M12 5v14"
]);

export const Eye = createIcon([
  "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
]);

export const Pencil = createIcon([
  "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",
  "m15 5 4 4"
]);

export const Check = createIcon([
  "M20 6 9 17l-5-5"
]);

export const ChevronUp = createIcon([
  "m18 15-6-6-6 6"
]);

export const ChevronDown = createIcon([
  "m6 9 6 6 6-6"
]);

export const ChevronLeft = createIcon([
  "m15 18-6-6 6-6"
]);

export const ChevronRight = createIcon([
  "m9 18 6-6-6-6"
]);

export const Filter = createIcon([
  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
]);

export const Package = createIcon([
  "m7.5 4.27 9 5.15",
  "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
  "m3.3 7 8.7 5 8.7-5",
  "M12 22V12"
]);

export const Users = createIcon([
  "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
  "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "M22 21v-2a4 4 0 0 0-3-3.87",
  "M16 3.13a4 4 0 0 1 0 7.75"
]);

export const Bell = createIcon([
  "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",
  "M13.73 21a2 2 0 0 1-3.46 0"
]);

export const Menu = createIcon([
  "M4 12h16",
  "M4 6h16",
  "M4 18h16"
]);

export const Home = createIcon([
  "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  "M9 22V12h6v10"
]);

export const Settings = createIcon([
  "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
]);

export const DollarSign = createIcon([
  "M12 2v20",
  "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
]);

export const TrendingUp = createIcon([
  "m22 7-8.5 8.5-5-5L2 17"
]);

export const Activity = createIcon([
  "M22 12h-4l-3 9L9 3l-3 9H2"
]);

export const Calendar = createIcon([
  "M8 2v4",
  "M16 2v4",
  "M3 10h18",
  "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
]);

export const Clock = createIcon([
  "M12 6v6l4 2"
]);

export const FileText = createIcon([
  "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",
  "M14 2v4a2 2 0 0 0 2 2h4",
  "M10 9H8",
  "M16 13H8",
  "M16 17H8"
]);

export const ShoppingCart = createIcon([
  "m1 1 6 6m0 0L4 8v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-3-1M7 7h10l-1 9H8l-1-9z"
]);

export const Building = createIcon([
  "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
  "M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"
]);

export const Clipboard = createIcon([
  "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
  "M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"
]);

export const LogOut = createIcon([
  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
  "m16 17 5-5-5-5",
  "m21 12H9"
]);

export const User = createIcon([
  "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
]);

export const Lock = createIcon([
  "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z",
  "M7 11V7a5 5 0 0 1 10 0v4"
]);

export const Loader2 = createIcon([
  "M21 12a9 9 0 1 1-6.219-8.56"
]);

export const ExternalLink = createIcon([
  "M15 3h6v6",
  "M10 14 21 3",
  "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
]);

export const Receipt = createIcon([
  "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z",
  "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
  "M12 18V6"
]);

export const Ban = createIcon([
  "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z",
  "m9 9 6 6",
  "m15 9-6 6"
]);

export const Columns = createIcon([
  "M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"
]);

export const ChevronsUpDown = createIcon([
  "m7 15 5 5 5-5",
  "m7 9 5-5 5 5"
]);

// Add circle and line elements for icons that need them
export const SearchIcon = ({ size = 24, className = '', ...props }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export const EyeIcon = ({ size = 24, className = '', ...props }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const Trash2Icon = ({ size = 24, className = '', ...props }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" x2="10" y1="11" y2="17"/>
    <line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
);