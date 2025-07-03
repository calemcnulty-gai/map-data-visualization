/**
 * @fileoverview Constants for visualization design and layout
 * @module lib/constants/visualization
 */

// NextGen Academy brand colors
export const BRAND_COLORS = {
  primary: '#67BC44', // NextGen Green
  secondary: '#251931', // NextGen Purple
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Chart colors for data visualization
export const CHART_COLORS = {
  current: BRAND_COLORS.secondary,
  projection10: '#8FD14F',
  projection20: BRAND_COLORS.primary,
  projection40: '#45A032',
  target: '#FF6B6B',
  peer: {
    p10: '#FEE2E2',
    p25: '#FECACA',
    p50: '#FCA5A5',
    p75: '#F87171',
    p90: '#EF4444',
  },
};

// Visualization dimensions (in pixels)
export const VISUALIZATION_DIMENSIONS = {
  portrait: {
    width: 800,
    height: 1000,
    padding: 40,
    headerHeight: 120,
    footerHeight: 80,
  },
  landscape: {
    width: 1200,
    height: 800,
    padding: 40,
    headerHeight: 100,
    footerHeight: 60,
  },
};

// Font settings
export const FONTS = {
  primary: 'Inter, system-ui, -apple-system, sans-serif',
  heading: 'Inter, system-ui, -apple-system, sans-serif',
  sizes: {
    title: 32,
    subtitle: 24,
    heading: 20,
    body: 16,
    small: 14,
    tiny: 12,
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Chart specific settings
export const CHART_SETTINGS = {
  barChart: {
    barWidth: 60,
    barSpacing: 20,
    cornerRadius: 4,
    labelOffset: 10,
  },
  lineChart: {
    strokeWidth: 3,
    dotRadius: 6,
    gridLines: true,
    tension: 0.4,
  },
  margins: {
    top: 20,
    right: 20,
    bottom: 70,
    left: 60,
  },
};

// Animation settings (for future use)
export const ANIMATION_SETTINGS = {
  duration: 300,
  easing: 'easeInOut',
  stagger: 50,
};

// Export quality settings
export const EXPORT_SETTINGS = {
  dpi: 300,
  scale: 2, // For retina displays
  format: 'png',
  quality: 0.95,
}; 