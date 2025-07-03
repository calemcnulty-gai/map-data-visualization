# Phase 2: MVP - MAP Data Visualization Tool

## Overview
Build the minimal viable product that enables staff to generate basic visualizations from Google Sheets data. This phase delivers core functionality: data integration, student selection, and PNG generation with essential metrics.

## Goals
- Integrate with Google Sheets API to fetch MAP data
- Create student selection interface
- Build basic visualization engine with D3.js
- Generate downloadable PNG files
- Implement core RIT score calculations

## Tasks

### 1. Google Sheets Integration
**Steps:**
1. Set up Google Cloud project and enable Sheets API
2. Create service account credentials for server-side access
3. Implement Google Sheets client service (services/google-sheets/)
4. Create data sync API endpoint (/api/sheets/sync)
5. Add error handling for API limits and network issues

### 2. Data Model and Storage
**Steps:**
1. Define TypeScript interfaces for MAP data (lib/types/student.ts)
2. Create Prisma models for temporary data caching
3. Implement data validation with Zod schemas
4. Build data transformation utilities for sheet → app format
5. Create data refresh mechanism with status indicators

### 3. Student List Interface
**Steps:**
1. Create dashboard layout with navigation
2. Build student data table component with Shadcn/ui
3. Implement search/filter functionality
4. Add loading states and skeleton screens
5. Display sync status and last update time

### 4. Student Selection Flow
**Steps:**
1. Create single-select mode with radio buttons
2. Add student details preview panel
3. Implement selection state management with Zustand
4. Build "Generate Visualization" call-to-action
5. Add selection validation and error states

### 5. RIT Score Calculations
**Steps:**
1. Implement core calculation functions (lib/calculations/)
2. Create grade-level conversion utilities
3. Build improvement projection algorithms
4. Add percentile ranking calculations
5. Write calculation documentation with examples

### 6. Basic Visualization Component
**Steps:**
1. Create visualization container with fixed dimensions
2. Build current performance chart with D3.js
3. Implement NextGen branding header/footer
4. Add student info section with key metrics
5. Style according to theme-rules.md specifications

### 7. Visualization Data Pipeline
**Steps:**
1. Create visualization configuration types
2. Build data preparation utilities
3. Implement chart data generators
4. Add metric calculation services
5. Create visualization preview component

### 8. PNG Generation Service
**Steps:**
1. Set up HTML5 Canvas rendering pipeline
2. Implement high-DPI scaling for print quality
3. Create server-side generation endpoint
4. Build client-side download functionality
5. Add progress indicators for generation

### 9. File Storage System
**Steps:**
1. Create local storage directory structure
2. Implement file naming conventions
3. Build file cleanup utilities
4. Add temporary file management
5. Create file retrieval services

### 10. Basic Visualization History
**Steps:**
1. Store generation metadata in database
2. Create history list view component
3. Implement download previous generations
4. Add basic search by student name
5. Build auto-cleanup for old files

### 11. Error Handling Framework
**Steps:**
1. Create global error boundary component
2. Implement API error response standards
3. Add user-friendly error messages
4. Build retry mechanisms for failed operations
5. Create error logging system

### 12. Performance Optimization
**Steps:**
1. Implement data caching strategies
2. Add request debouncing for search
3. Optimize bundle size with dynamic imports
4. Create loading performance metrics
5. Add basic monitoring hooks

## Success Criteria
- Successfully sync data from Google Sheets
- Generate accurate visualizations for any student
- Export high-quality PNG files (300 DPI)
- Complete workflow in under 2 minutes
- All calculations match expected formulas
- Clean, professional visualization output

## Deliverables
- Working Google Sheets integration
- Student selection interface
- Basic visualization generator
- PNG export functionality
- Calculation engine
- Simple history tracking

## UI Components Needed
- Student data table
- Search/filter controls
- Selection summary card
- Visualization preview
- Download button
- Status indicators
- Error messages

## API Endpoints
- GET /api/sheets/sync
- GET /api/students
- POST /api/visualizations/generate
- GET /api/visualizations/[id]
- GET /api/visualizations/history

## Notes
- Focus on single student visualizations only
- Use fixed visualization template (no customization yet)
- Prioritize accuracy over features
- Ensure calculations are correct before proceeding
- Keep UI simple but functional 