# UI Rules: MAP Data Visualization Tool

## Overview

This document defines the visual and interaction guidelines for both the internal web application and the parent-facing generated visualizations.

---

## Internal Application UI (Staff-Facing)

### Design Philosophy
**Clean Utilitarian** - Prioritize functionality and efficiency over visual flair. The UI should facilitate quick visualization generation without cognitive overhead.

### Core Principles

#### 1. **Efficiency First**
- Minimize clicks to generate visualizations
- Use smart defaults that can be overridden
- Implement keyboard shortcuts for power users
- Auto-save progress to prevent data loss

#### 2. **Clear Visual Hierarchy**
- Primary actions always visible and prominent
- Secondary actions accessible but not distracting
- Status indicators immediately visible
- Preview area takes center stage

#### 3. **Neutral Interface**
- Grayscale UI with minimal color
- Color reserved for:
  - Status indicators (success/error/warning)
  - Primary action buttons
  - Generated visualization previews
- Let the visualization previews provide visual interest

#### 4. **Responsive Feedback**
- Immediate visual feedback for all actions
- Clear loading states with progress indicators
- Success/error messages that don't block workflow
- Skeleton screens during data fetching

### Component Guidelines

#### Navigation
- Fixed top navigation bar with minimal height
- Logo/brand mark small and unobtrusive
- Primary actions in consistent locations
- Breadcrumbs for multi-step processes

#### Forms & Inputs
- Labels above inputs for better scanning
- Placeholder text for examples, not instructions
- Inline validation with helpful error messages
- Group related fields with subtle borders
- Search inputs with debouncing

#### Buttons
- Primary action: Filled button with brand color
- Secondary action: Outlined button
- Destructive action: Red text button
- Consistent sizing and padding
- Clear hover/active states

#### Data Display
- Tables with alternating row colors
- Sortable columns with clear indicators
- Sticky headers for long lists
- Pagination or infinite scroll for large datasets
- Quick filters above data tables

#### Preview Area
- Centered and prominent
- True-to-size representation
- Zoom controls for detailed inspection
- Side-by-side comparison capability
- Download button always visible

### Interaction Patterns

#### Student Selection
- Searchable dropdown with autocomplete
- Recent selections at top
- Multi-select with checkboxes
- Select all/none options
- Clear selection summary

#### Configuration Flow
- Step indicator for multi-step process
- Previous/Next navigation
- Ability to jump between steps
- Configuration summary before generation
- Save configuration as template

#### Error Handling
- Inline errors next to relevant fields
- Toast notifications for system errors
- Retry mechanisms for failed operations
- Graceful degradation
- Help text for common issues

### Accessibility Requirements
- WCAG 2.1 AA compliance minimum
- All interactive elements keyboard accessible
- Focus indicators clearly visible
- Screen reader announcements for dynamic content
- Color not sole indicator of meaning

---

## Generated Visualizations (Parent-Facing)

### Design Philosophy
**Professional & Persuasive** - Create compelling visualizations that build trust and clearly communicate the value of tutoring services.

### Core Principles

#### 1. **Brand-First Design**
- NextGen Academy logo prominently placed
- Consistent use of brand colors
- Professional typography
- Cohesive visual language

#### 2. **Data Clarity**
- Information hierarchy guides the eye
- Complex data made simple
- Context provided for all metrics
- Visual metaphors where appropriate

#### 3. **Emotional Intelligence**
- Focus on growth and potential
- Positive framing of current performance
- Clear path to improvement
- Encouraging visual language

#### 4. **Call-to-Action Focus**
- Tutoring benefits clearly highlighted
- Package recommendations prominent
- Contact information visible
- Next steps obvious

### Visual Components

#### Layout Structure
```
┌─────────────────────────────────────┐
│ NextGen Academy Logo    Date        │
├─────────────────────────────────────┤
│                                     │
│     Student Name & Grade            │
│     Subject Area                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     Main Visualization              │
│     (Chart/Graph Area)              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     Improvement Projections         │
│     (Package Comparisons)           │
│                                     │
├─────────────────────────────────────┤
│ Recommended Package                 │
│ Contact Information                 │
└─────────────────────────────────────┘
```

#### Color Usage
- **Primary Green (#67BC44)**: Positive metrics, improvements, recommendations
- **Primary Purple (#251931)**: Headers, important text, current performance
- **Neutral Grays**: Supporting text, grid lines, backgrounds
- **Accent Blue**: Hyperlinks, interactive elements (if any)
- **Warning Orange**: Areas needing attention (used sparingly)

#### Typography
- **Headers**: Bold sans-serif, larger size
- **Body Text**: Regular sans-serif, readable size
- **Data Labels**: Medium weight, slightly smaller
- **Captions**: Light weight, smallest size
- Consistent line heights and spacing

#### Chart Guidelines
- Start Y-axis at meaningful minimum (not always zero)
- Use color coding consistently
- Include data labels on important points
- Grid lines subtle but present
- Legend clearly labeled
- Trend lines for projections

#### Visual Elements
- **Progress Bars**: Show current vs. grade level
- **Growth Arrows**: Indicate improvement potential
- **Milestone Markers**: Grade level, 90th percentile
- **Package Badges**: Visually distinct options
- **Icons**: Simple, universally understood

### Content Guidelines

#### Language Tone
- Professional but warm
- Encouraging and forward-looking
- Specific rather than vague
- Action-oriented
- Parent-friendly (no jargon)

#### Data Presentation
- Round numbers appropriately
- Provide context for all metrics
- Use relative comparisons
- Highlight most important insights
- Balance detail with clarity

#### Recommended Phrases
- "Current Performance" not "Deficiency"
- "Growth Opportunity" not "Below Grade Level"
- "Projected Progress" not "Potential Improvement"
- "Recommended Hours" not "Required Hours"
- "Achievement Goals" not "Catch-up Targets"

### Export Specifications

#### Image Properties
- **Format**: PNG with transparency support
- **Resolution**: 300 DPI for print quality
- **Dimensions**: 8.5" x 11" (standard letter)
- **Color Space**: sRGB
- **File Size**: Optimized under 2MB

#### Quality Assurance
- Text remains crisp at all zoom levels
- Colors consistent across devices
- No pixelation in logos or icons
- Proper margins for printing
- Test on multiple email clients

---

## Responsive Considerations

### Web Application
- **Desktop First**: Primary use case
- **Tablet Support**: Full functionality maintained
- **Mobile**: View-only with limited actions
- Breakpoints: 1200px, 768px, 480px

### Generated Visualizations
- Fixed dimensions optimized for:
  - Email attachment viewing
  - Standard paper printing
  - Mobile device viewing (when zoomed)
- No responsive scaling needed

---

## Implementation Notes

### Component Library Usage
- Leverage Shadcn/ui components as base
- Customize minimally for brand alignment
- Maintain accessibility features
- Document any modifications

### Performance Optimization
- Lazy load visualization components
- Virtualize long student lists
- Debounce search inputs
- Cache generated previews
- Progressive image loading

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- No IE11 support required 