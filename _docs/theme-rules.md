# Theme Rules: MAP Data Visualization Tool

## Overview

This document establishes the theming foundations for both the internal web application and the parent-facing visualizations, including colors, typography, spacing, and visual styling.

---

## Color Systems

### Web Application Colors (Internal Tool)

#### Neutral Palette
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

#### Functional Colors
```css
--primary: #67BC44;        /* NextGen Green - Primary actions only */
--primary-hover: #5aa639;  /* Darker green for hover states */
--error: #ef4444;          /* Red for errors */
--warning: #f59e0b;        /* Amber for warnings */
--success: #10b981;        /* Green for success */
--info: #3b82f6;          /* Blue for information */
```

#### Application Theme
```css
--background: #ffffff;
--foreground: var(--gray-900);
--card: var(--gray-50);
--card-foreground: var(--gray-900);
--border: var(--gray-200);
--input: var(--gray-100);
--ring: var(--primary);
--selection: rgba(103, 188, 68, 0.1);
```

### Visualization Colors (Parent-Facing)

#### Brand Colors
```css
--nextgen-green: #67BC44;
--nextgen-purple: #251931;
--nextgen-green-light: #8fce6f;
--nextgen-green-dark: #4a8a2f;
--nextgen-purple-light: #3d2a4f;
```

#### Visualization Palette
```css
--viz-background: #ffffff;
--viz-text-primary: var(--nextgen-purple);
--viz-text-secondary: #4b5563;
--viz-accent: var(--nextgen-green);
--viz-grid: #e5e7eb;
--viz-highlight: #fef3c7;
--viz-improvement: var(--nextgen-green);
--viz-current: var(--nextgen-purple);
```

#### Chart-Specific Colors
```css
--chart-10-hours: #a7d89b;   /* Light green */
--chart-20-hours: #67BC44;   /* Brand green */
--chart-40-hours: #4a8a2f;   /* Dark green */
--chart-baseline: #9ca3af;   /* Gray */
--chart-target: #f59e0b;     /* Orange */
```

---

## Typography

### Web Application Typography

#### Font Stack
```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
```

#### Type Scale
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Visualization Typography

#### Font Stack
```css
--viz-font-primary: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
--viz-font-data: "Roboto", Arial, sans-serif;
```

#### Type Scale (for 300 DPI export)
```css
--viz-title: 32px;
--viz-subtitle: 24px;
--viz-heading: 20px;
--viz-body: 16px;
--viz-label: 14px;
--viz-caption: 12px;
```

#### Line Heights
```css
--viz-line-tight: 1.25;
--viz-line-normal: 1.5;
--viz-line-relaxed: 1.75;
```

---

## Spacing System

### Base Unit
```css
--space-unit: 0.25rem; /* 4px */
```

### Space Scale
```css
--space-0: 0;
--space-1: calc(var(--space-unit) * 1);   /* 4px */
--space-2: calc(var(--space-unit) * 2);   /* 8px */
--space-3: calc(var(--space-unit) * 3);   /* 12px */
--space-4: calc(var(--space-unit) * 4);   /* 16px */
--space-5: calc(var(--space-unit) * 5);   /* 20px */
--space-6: calc(var(--space-unit) * 6);   /* 24px */
--space-8: calc(var(--space-unit) * 8);   /* 32px */
--space-10: calc(var(--space-unit) * 10); /* 40px */
--space-12: calc(var(--space-unit) * 12); /* 48px */
--space-16: calc(var(--space-unit) * 16); /* 64px */
```

---

## Border & Radius

### Web Application
```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-full: 9999px;

--border-width: 1px;
--border-color: var(--gray-200);
```

### Visualizations
```css
--viz-radius: 8px;
--viz-border-width: 2px;
--viz-border-color: var(--gray-200);
```

---

## Shadows

### Web Application
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Visualizations
```css
--viz-shadow: 0 4px 12px rgba(37, 25, 49, 0.1);
--viz-shadow-hover: 0 8px 24px rgba(37, 25, 49, 0.15);
```

---

## Component Theming

### Buttons (Web App)
```css
.btn-primary {
  background: var(--primary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-medium);
}

.btn-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-600);
}
```

### Cards (Web App)
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
```

### Input Fields (Web App)
```css
.input {
  background: var(--input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.input:focus {
  border-color: var(--ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(103, 188, 68, 0.1);
}
```

---

## Visualization Styling

### Container Styles
```css
.viz-container {
  background: var(--viz-background);
  padding: 48px;
  width: 2550px;  /* 8.5" at 300 DPI */
  height: 3300px; /* 11" at 300 DPI */
}
```

### Header Styles
```css
.viz-header {
  border-bottom: 3px solid var(--nextgen-green);
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-8);
}

.viz-logo {
  height: 80px;
  width: auto;
}

.viz-title {
  color: var(--viz-text-primary);
  font-size: var(--viz-title);
  font-weight: var(--font-bold);
  line-height: var(--viz-line-tight);
}
```

### Chart Container
```css
.viz-chart-container {
  background: var(--gray-50);
  border: 2px solid var(--viz-border-color);
  border-radius: var(--viz-radius);
  padding: var(--space-8);
  margin: var(--space-6) 0;
}
```

### Data Cards
```css
.viz-metric-card {
  background: white;
  border: 2px solid var(--nextgen-green);
  border-radius: var(--viz-radius);
  padding: var(--space-6);
  text-align: center;
}

.viz-metric-value {
  color: var(--nextgen-green);
  font-size: var(--viz-heading);
  font-weight: var(--font-bold);
}

.viz-metric-label {
  color: var(--viz-text-secondary);
  font-size: var(--viz-label);
  font-weight: var(--font-medium);
}
```

### Progress Indicators
```css
.viz-progress-bar {
  height: 24px;
  background: var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
}

.viz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--nextgen-green-light), var(--nextgen-green));
  transition: width 0.3s ease;
}
```

---

## Animation & Transitions

### Web Application
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### Hover Effects
```css
.interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

---

## Dark Mode (Web App Only)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--gray-900);
    --foreground: var(--gray-50);
    --card: var(--gray-800);
    --card-foreground: var(--gray-50);
    --border: var(--gray-700);
    --input: var(--gray-800);
  }
}
```

---

## Print Styles (Visualizations)

```css
@media print {
  .viz-container {
    width: 100%;
    height: auto;
    padding: 0.5in;
  }
  
  .no-print {
    display: none !important;
  }
  
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

## Implementation Guidelines

### CSS Variable Usage
```css
/* Web App Root */
:root {
  /* All web app variables here */
}

/* Visualization Root */
.visualization-root {
  /* All visualization variables here */
  /* Isolated from web app styles */
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'nextgen-green': '#67BC44',
        'nextgen-purple': '#251931',
        gray: {
          50: '#f9fafb',
          // ... rest of gray scale
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', ...],
        viz: ['Inter', '-apple-system', ...]
      }
    }
  }
}
```

### Theme Provider Pattern
```typescript
// For dynamic theming if needed
interface Theme {
  colors: ColorScheme;
  spacing: SpacingScale;
  typography: TypographyScale;
}

const webAppTheme: Theme = {
  // Web app theme values
};

const visualizationTheme: Theme = {
  // Visualization theme values
};
``` 