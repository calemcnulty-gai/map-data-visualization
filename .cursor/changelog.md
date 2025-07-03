# MAP Data Visualization Tool - Changelog

## 2024-12-19
### Initial Setup
- Created project overview document defining scope and requirements
- Established project plan with phased approach
- Initialized project management structure

### Key Decisions
- Tool will pull data directly from Google Sheets via API
- Authentication limited to @esports.school and @superbuilders.school domains
- Focus on PNG export for email integration
- NextGen Academy branding colors: #67BC44 and #251931

### Next Steps
- Create user flow document
- Define technical stack
- Establish UI/theme guidelines

## 2024-12-31
### Phase 1: Setup Started
- Initialized Next.js 14 project with TypeScript and Tailwind CSS
- Configured App Router and import alias (@/*)
- Preserved existing documentation structure
- Beginning configuration of NextGen theme and colors

### Technical Stack
- Next.js 14 with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- React 18

### Core Dependencies Installed
- next-auth for authentication
- @prisma/client and prisma for database
- zustand for state management
- zod for validation
- d3 and canvas for visualizations
- Shadcn/ui components (button, card)
- ESLint and Prettier configured

### Configuration Updates
- TypeScript strict mode with ES2022 target
- Tailwind CSS v3 with NextGen brand colors (#67BC44, #251931)
- Custom CSS variables for theming
- ESLint and Prettier rules established
- Comprehensive .gitignore file

### Next Steps
- Set up NextAuth.js with Google OAuth
- Create environment variables structure
- Build landing page with authentication

### Phase 1 Progress Summary
- ✅ Next.js 14 project initialized with TypeScript
- ✅ Tailwind CSS configured with NextGen brand colors
- ✅ All core dependencies installed (NextAuth, Prisma, D3, etc.)
- ✅ Authentication infrastructure set up with domain restrictions
- ✅ Beautiful landing page with Google sign-in
- ✅ Basic dashboard page with auth protection
- ✅ Project documentation updated (README, .env.example)
- ✅ ESLint and Prettier configured
- ✅ Comprehensive .gitignore file

### Remaining Phase 1 Tasks
- Database schema setup (requires PostgreSQL)
- Development tools setup (Husky pre-commit hooks)
- Authentication flow verification (requires Google OAuth credentials)

### Ready for Phase 2
The foundation is solid and ready for core functionality implementation once database and OAuth credentials are configured.

## 2024-12-31 (Continued)
### Google Cloud Project Setup
- Created new Google Cloud project: `nextgen-map-viz`
- Enabled Google Sheets API and Google Drive API
- Created service account for server-side access
- Service account key saved to: `~/Workspaces/perms/nextgen-map-viz-service-account.json`
- Created comprehensive OAuth setup guide (GOOGLE_OAUTH_SETUP.md)

### Next Steps for Authentication
1. Configure OAuth consent screen in Google Cloud Console
2. Create OAuth 2.0 Web Application credentials
3. Add redirect URIs for localhost and production
4. Update .env.local with credentials
5. Test authentication flow

### Resources Created
- Project ID: `nextgen-map-viz`
- Service Account: `map-viz-service@nextgen-map-viz.iam.gserviceaccount.com`
- APIs Enabled: Sheets API, Drive API

### Package Updates
- Installed missing dependencies: `class-variance-authority`, `lucide-react`
- Fixed TypeScript error (removed unused variable)
- All type checks now passing
- Note: Editor may show false positive errors - restart TypeScript server if needed

### CSS Build Error Fix
- Fixed "border-border class does not exist" error
- Updated Tailwind configuration to include all CSS variable-based colors
- Added proper color definitions for border, input, ring, and all theme colors
- Development server now runs successfully

## 2024-12-31 (Continued)
### Next Steps for Authentication
1. Configure OAuth consent screen in Google Cloud Console
2. Create OAuth 2.0 Web Application credentials
3. Add redirect URIs for localhost and production
4. Update .env.local with credentials
5. Test authentication flow

## 2025-01-02
### Initial Setup
- Created new repository: https://github.com/calemcnulty-gai/map-data-visualization
- Pushed initial commit with all project files
- Project disconnected from template repository

### Deployment Configuration
- Created nginx configuration for visualizations.nextgenafter.school subdomain
- Created PM2 ecosystem configuration for process management
- Created deployment script (deploy.sh) for automated deployment
- Created server setup script (setup-server.sh) to install PM2 and prepare environment
- Configured reverse proxy setup to run Next.js app on port 3000

### Next Steps
- Run setup-server.sh to prepare the server
- Deploy application using deploy.sh
- Configure environment variables on server
- Set up SSL certificate with Certbot

### Phase 2: MVP Started
- Began implementation of core MVP functionality
- Focus on Google Sheets integration and student data visualization

### Google Sheets Integration
- Created TypeScript interfaces for student data (`lib/types/student.ts`)
- Created visualization configuration types (`lib/types/visualization.ts`)
- Implemented Google Sheets client service (`services/google-sheets/client.ts`)
- Built data parser for converting sheet rows to student objects
- Created API endpoint for syncing data (`/api/sheets/sync`)
- Added googleapis dependency for Sheets API access

### Student Data Management
- Implemented Zustand store for student state management
- Added filtering capabilities (search, grade, subject)
- Created selection management for single/multiple students
- Built sync functionality with error handling

### User Interface Components
- Created comprehensive student data table component
- Implemented search and filter functionality
- Added selection UI with visual feedback
- Built sync status indicators
- Installed Shadcn Input component
- Created dashboard layout with header and auth

### RIT Score Calculations
- Implemented core calculation functions based on provided formulas
- Created improvement projection algorithms
- Built grade-level conversion utilities
- Added percentile estimation functions
- Implemented package recommendation logic

### Project Structure Updates
- Created services directory for external integrations
- Established calculations library structure
- Added stores directory for Zustand stores
- Updated environment template with Google Sheets config

### Next Steps
- Create D3.js visualization component
- Implement PNG generation service
- Build visualization preview interface
- Add file storage system
- Create visualization history tracking

## 2025-01-02 (Continued)
### Visualization Implementation
- Created visualization constants for design and layout
- Built custom useD3 hook for React-D3 integration
- Implemented StudentPerformanceChart component with bar charts
- Created complete MapVisualization component with header/footer
- Added support for grade level and percentile targets
- Implemented dynamic color scheme based on performance

### PNG Generation
- Created PNG generation service using html2canvas
- Implemented high-DPI support for print quality
- Built download functionality with proper filename generation
- Added support for both portrait and landscape layouts

### Visualization Flow
- Created visualization generation page (`/dashboard/visualize`)
- Built configuration panel for subject and layout selection
- Implemented live preview of visualizations
- Added navigation flow from student selection to visualization
- Created loading states for PNG generation

### UI/UX Improvements
- Added back navigation to student list
- Implemented radio buttons for subject selection
- Added checkboxes for including/excluding visualization elements
- Built responsive preview container
- Added proper error handling for missing data

### Dependencies Added
- html2canvas for reliable DOM to PNG conversion

### Next Steps
- Create API endpoint for saving generated visualizations
- Implement server-side file storage
- Add visualization history page
- Build batch processing for multiple students
- Add more chart types (line charts, peer comparison)
- Test with real Google Sheets data

## 2025-01-02 (Phase 2 Completed)
### File Storage Implementation
- Created file storage service (`services/storage/file-storage.ts`)
- Implemented storage directories for visualizations and temp files
- Built file management utilities (save, get, delete, cleanup)
- Added file metadata tracking

### Database Integration
- Set up Prisma with PostgreSQL schema
- Created Visualization and BatchVisualization models
- Implemented database relationships and indexes
- Created Prisma client singleton

### API Endpoints
- Created POST `/api/visualizations` for saving visualizations
- Created GET `/api/visualizations` for fetching history
- Created GET `/api/visualizations/[id]/download` for file downloads
- Implemented proper authentication and error handling
- Added request validation with Zod

### Visualization History
- Built history page (`/dashboard/history`)
- Implemented search by student name
- Added subject filtering
- Created download functionality for previous visualizations
- Added file size display and metadata

### Error Handling Framework
- Created comprehensive error handling system
- Built custom error classes (AppError, ValidationError, etc.)
- Implemented error logging functionality
- Created global ErrorBoundary component
- Added client-side error handling utilities

### UI/UX Enhancements
- Added navigation links in dashboard header
- Updated visualization page to auto-save to server
- Improved error messages and user feedback
- Added loading states throughout the application
- Implemented proper file download handling

### Dependencies Added
- date-fns for date formatting

### Phase 2 Summary
The MVP is now complete with all core functionality:
- ✅ Google Sheets integration ready (requires credentials)
- ✅ Student data management with search/filter
- ✅ Professional visualizations with D3.js
- ✅ High-quality PNG export (2x scale)
- ✅ Server-side file storage
- ✅ Visualization history with search
- ✅ Comprehensive error handling
- ✅ Clean, intuitive user interface

### Ready for Testing
The application is ready for testing once:
1. PostgreSQL database is set up
2. Google OAuth credentials are configured
3. Google Sheets service account key is added
4. Environment variables are properly configured

### Next Phase (Enhancement)
Phase 3 will focus on:
- Multi-student batch processing
- Additional visualization templates
- Advanced customization options
- Performance optimizations
- Email integration

## 2025-01-02 (Phase 3 Started)
### Phase 3: Enhancement Begins
- Updated project plan with detailed Phase 3 tasks from enhancement phase document
- Starting with multi-student selection and batch processing features
- Focus on improving efficiency and adding advanced features

### Multi-Student Selection (In Progress)
- Existing checkboxes in student table already support multi-select
- Need to add "Select All" functionality
- Need to improve batch action toolbar
- Need to add selection limit validation (max 50 students)

### Multi-Student Selection (Completed)
- Enhanced student data table with selection limit validation (max 50 students)
- Added visual indicators when selection limit is reached
- Improved batch action toolbar with dynamic button text ("Generate Visualization" vs "Generate Batch")
- Added selection error messages for better user feedback
- "Select All" functionality now respects the 50-student limit

### Batch Processing Engine (Completed)
- Created batch visualization page at `/dashboard/visualize/batch`
- Implemented sequential processing of multiple students (for reliability)
- Added real-time progress tracking with percentage and current student
- Built error handling with detailed error reporting per student
- Created batch download API endpoint at `/api/visualizations/batch/download`
- Implemented ZIP archive generation using JSZip library
- Added folder structure in ZIP (StudentName/filename.png)
- Support for generating both subjects or single subject for all students
- Progress bar with visual feedback during generation
- Download all visualizations as ZIP after generation

### Technical Improvements
- Added onRenderComplete callback to MapVisualization component
- Implemented off-screen rendering for batch processing
- Created temporary DOM containers for visualization generation
- Proper cleanup of React roots after each visualization

### Next Steps
- Create visualization templates (Performance Overview, Improvement Focus, Comparative Analysis)
- Add template selection interface
- Implement customization options panel
- Add advanced visualization types

### Visualization Templates (Completed)
- Created three visualization templates with distinct purposes:
  - **Performance Overview**: Complete view with current performance and all projections
  - **Improvement Focus**: Emphasizes growth potential with tutoring
  - **Comparative Analysis**: Side-by-side package comparison
- Built template selector component with visual previews
- Each template auto-configures visualization settings
- Added template icons and feature descriptions
- Integrated template selection into both single and batch visualization pages
- Templates now control which data points are shown by default

### UI/UX Enhancements
- Reorganized visualization configuration panels
- Added "Advanced Options" section for fine-tuning
- Improved layout with responsive grid system
- Added disabled states during generation
- Better visual hierarchy with template selection at top

### Technical Implementation
- Extended VisualizationConfig type with template property
- Created VISUALIZATION_TEMPLATES constant with template definitions
- Template features control default visibility of chart elements
- Automatic config updates when switching templates

## Recent Changes

### 2025-01-02
- Fixed Google Sheets parser to properly handle sheet format where each row represents one student-subject combination
- Added support for science scores in addition to math and reading
- Refactored client to aggregate multiple subject rows per student into a single Student object
- Updated types to include science in SubjectScores and StudentWithProjections interfaces
- Parser now correctly identifies that current data only contains math scores 

### 2025-01-03
- Fixed database connection issues
- Started PostgreSQL service using Homebrew
- Created map_visualization database
- Updated DATABASE_URL to use correct username (calemcnulty instead of postgres)
- Generated Prisma client with correct output path (lib/generated/prisma)
- Ran initial database migration successfully
- Updated Prisma client import to use generated client path
- Database is now fully configured and ready for use
- Fixed Prisma client initialization error by:
  - Clearing Next.js build cache
  - Updating Prisma singleton pattern with proper initialization
  - Adding logging for development environment
  - Restarting development server with fresh build
- Fixed "User was denied access on the database" error by:
  - Removed `?schema=public` parameter from DATABASE_URL
  - PostgreSQL connection strings don't support schema parameter in URI format
  - Regenerated Prisma client with corrected connection string
  - Restarted server to apply changes
- Fixed persistent database connection error:
  - Issue was .env.local had old DATABASE_URL with wrong username (postgres:password)
  - Next.js loads both .env and .env.local, with .env.local taking precedence
  - Updated .env.local to use correct username (calemcnulty)
  - Regenerated Prisma client and restarted server
  - Database connection now working successfully

### Dynamic Routing for Visualizations
- Implemented dynamic routing for visualization pages using student ID
- Created `/dashboard/visualize/[studentId]` route structure
- Updated navigation to include student ID in URL: `/dashboard/visualize/${studentId}`
- Added automatic data loading when accessing visualization page directly
- Page now fetches student data from store or syncs from Google Sheets if needed
- Added loading state while fetching student data
- Created redirect page at `/dashboard/visualize` for backward compatibility
- Visualization pages are now shareable and can be reloaded without losing context

### Fixed Visualization Calculations and Display
- Fixed "+undefined" label issue in bar charts by properly mapping `improvementPoints` to `improvement`
- Implemented proper RIT score calculations based on lookup tables from RIT Score Calculations document
- Added R50 (Knows Half of Curriculum) lookup table with values from 187-285 RIT scores
- Implemented accurate hours to 90th percentile calculation using:
  - Percentile lookup tables for grades 1-12
  - R50 grade level conversion
  - Proper hour calculation based on grade improvement (10hr = 0.2, 20hr = 0.5, 40hr = 1.0 grade levels)
- Fixed interpolation for RIT scores and percentiles not in lookup tables
- Calculations now properly show non-zero hours for students below 90th percentile

### Enhanced Chart Visualization
- Made all chart labels darker and more readable (using gray[700] and gray[800])
- Added dynamic bar generation based on hours needed:
  - Shows standard 10/20/40 hour intervals for students needing ≤40 hours
  - Adds 60 hour bar for students needing ≤60 hours
  - Uses 20/40/60/80 for students needing ≤80 hours
  - Generates custom intervals for students needing more hours
- Centered chart on 50th percentile (grade level) regardless of student position
- Added full percentile scale (0-100) with colored background bands:
  - 0-10%: Red zone
  - 10-25%: Orange zone
  - 25-50%: Yellow zone
  - 50-75%: Light green zone
  - 75-90%: Green zone
  - 90-100%: Bright green zone
- Added percentile axis on right side showing key percentiles (1, 10, 25, 50, 75, 90, 99)
- Added percentile labels below each bar showing projected percentile
- Made target lines more prominent (thicker, better positioned labels)
- Used gradient coloring for projection bars (lighter to darker green)

## 2025-01-07
- Fixed database connection error by updating DATABASE_URL in .env.local with correct username
- Regenerated Prisma client and verified database connection through test endpoint
- Created dynamic routing structure for visualization pages to enable URL-based access
- Updated navigation to use dynamic routes, allowing visualization pages to be reloaded and shared
- Fixed overlapping labels on chart by:
  - Increasing chart height from 400px to 420px
  - Increasing bottom margin from 40px to 80px
  - Adding rotation for percentile labels when more than 4 bars
  - Adjusting label positioning and font sizes
  - Making x-axis labels more prominent
- Added effective grade level calculation and display:
  - Created getEffectiveGradeLevel function using R50 values
  - Added new info box showing student's effective grade level
  - Changed grid from 4 to 5 columns to accommodate new metric
  - Color-coded effective grade (red if below actual grade, green if at/above)
- Optimized visualization spacing:
  - Reduced top padding from 40px to 20px
  - Reduced chart height from 420px to 380px to prevent footer overlap
  - Reduced bottom margin from 80px to 70px
  - Reduced gaps between info boxes for better space utilization 