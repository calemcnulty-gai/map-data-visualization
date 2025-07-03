# User Flow: MAP Data Visualization Tool

## Overview

This document outlines the complete user journey through the MAP Data Visualization Tool, from initial access to final visualization export. The flow is designed for NextGen Academy staff members who need to generate compelling visualizations for parent communications.

---

## User Personas

### Primary User: NextGen Academy Staff
- **Role**: Tutors, enrollment specialists, academic advisors
- **Goal**: Generate professional visualizations to demonstrate tutoring value to parents
- **Technical Level**: Basic to intermediate computer skills
- **Access**: Authorized @esports.school or @superbuilders.school email accounts

---

## Entry Points

### 1. Direct URL Access
- User navigates directly to the application URL
- Redirected to authentication if not logged in

### 2. Email Link
- User clicks link from internal communication
- Directed to specific functionality if authenticated

### 3. Bookmark/Saved Link
- Returning users access via saved bookmark
- Session persistence maintains authentication state

---

## Authentication Flow

### Initial Login
1. **Landing Page**
   - Brief application description
   - "Sign in with Google" button prominently displayed
   - NextGen Academy branding

2. **Google OAuth Flow**
   - Click "Sign in with Google"
   - Redirect to Google authentication
   - Select authorized account (@esports.school or @superbuilders.school)
   - Grant necessary permissions (Google Sheets access)

3. **Authentication Validation**
   - System verifies email domain
   - If unauthorized: Display error message with contact information
   - If authorized: Redirect to main dashboard

### Session Management
- **Active Session**: Direct access to dashboard
- **Session Duration**: Extended (1 year or maximum configurable)
- **Persistent Login**: No automatic timeouts for internal use
- **Logout**: Manual logout clears session and returns to landing page

---

## Main Dashboard

### Initial View
1. **Welcome Header**
   - User name display
   - Logout option
   - NextGen Academy logo

2. **Data Status Indicator**
   - Connection status to Google Sheets
   - Last sync timestamp
   - Refresh data button

3. **Student Selection Interface**
   - Search/filter functionality
   - Student list with key metrics preview
   - Multi-select capability for batch processing

### Navigation Elements
- **Generate Visualization** (primary action)
- **Visualization History** (access all previous generations)
- **Logout** (end session)

---

## Visualization Generation Flow

### Step 1: Student Selection
1. **Search Options**
   - Search by student name
   - Filter by grade level
   - Filter by subject
   - Filter by performance range

2. **Selection Methods**
   - Single student selection
   - Multiple student selection (batch mode)
   - Select all in filtered results

3. **Selection Confirmation**
   - Display selected student(s) summary
   - Show available data completeness
   - Option to modify selection

### Step 2: Visualization Configuration
1. **Template Selection**
   - Standard performance overview
   - Improvement projection focus
   - Comparative analysis
   - Custom configuration

2. **Data Points Selection**
   - Current performance metrics (default: on)
   - Peer comparison (default: on)
   - Improvement projections (default: all packages)
   - Grade level targets (default: on)
   - 90th percentile targets (default: on)

3. **Customization Options**
   - Include/exclude specific tutoring packages
   - Add custom messaging
   - Select color scheme variant
   - Choose layout orientation

### Step 3: Preview & Generate
1. **Live Preview**
   - Real-time visualization preview
   - Responsive preview size adjustment
   - Data accuracy verification
   - Visual quality check

2. **Adjustments**
   - Modify included data points
   - Adjust visual emphasis
   - Update student information if needed
   - Return to previous steps

3. **Final Generation**
   - Click "Generate PNG"
   - Processing indicator
   - Quality selection (email-optimized vs. print quality)

### Step 4: Export & Distribution
1. **Download Options**
   - Individual PNG files (single student)
   - ZIP archive (multiple students)
   - Copy shareable link

2. **File Naming**
   - Automatic: StudentName_Subject_Date.png
   - Custom naming option available

3. **Next Actions**
   - Generate for another student
   - Return to dashboard
   - View in visualization history
   
4. **Automatic History Storage**
   - All generated visualizations saved automatically
   - Accessible from Visualization History
   - Organized by date and student name

---

## Additional Workflows

### Visualization History Flow
1. **Access History**
   - Click "Visualization History" from main navigation
   - View chronologically ordered list of all generated visualizations

2. **History Interface**
   - Search by student name
   - Filter by date range
   - Filter by subject
   - Sort by date (newest/oldest)

3. **History Item Details**
   - Student name and subject
   - Generation date and time
   - Thumbnail preview
   - Download original PNG
   - Regenerate with current data

4. **History Actions**
   - Download individual visualization
   - Download multiple (select and batch download)
   - Delete old visualizations (if needed)
   - Duplicate and modify settings

### Data Refresh Flow
1. User notices outdated data indicator
2. Click "Refresh Data" button
3. System syncs with Google Sheets
4. Progress indicator shows sync status
5. Confirmation of successful update
6. Student list refreshes automatically

### Batch Processing Flow (Secondary Feature)
1. Select multiple students from list
2. Choose "Batch Generate" option
3. Select common visualization settings
4. System generates all visualizations
5. Download as ZIP archive
6. All visualizations saved to history

### Error Handling Flow
1. **Data Sync Errors**
   - Clear error message
   - Retry option
   - Contact support link

2. **Generation Errors**
   - Specific error details
   - Partial success handling
   - Recovery suggestions

3. **Authentication Errors**
   - Session timeout notification
   - Quick re-authentication
   - Preserve work state when possible

---

## Exit Points

### Successful Completion
1. Download completed visualizations
2. Optional: Email confirmation
3. Return to dashboard or logout

### Manual Logout
1. Confirm logout action
2. Clear session data
3. Return to landing page

---

## Mobile/Tablet Considerations

### Responsive Behaviors
- **Tablet (Primary Mobile Target)**
  - Full functionality maintained
  - Touch-optimized controls
  - Adjusted layout for portrait/landscape

- **Phone (Limited Support)**
  - View-only capabilities
  - Download pre-generated visualizations
  - Redirect to desktop for full features

---

## Accessibility Features

- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast Mode**: Alternative color schemes
- **Text Scaling**: Responsive to browser zoom
- **Clear Error Messages**: Descriptive, actionable feedback

---

## Performance Optimizations

### Loading States
- Progressive data loading
- Skeleton screens during fetch
- Cached student lists
- Lazy loading for large datasets

### User Feedback
- Clear progress indicators
- Estimated time for operations
- Cancel options for long processes
- Background processing notifications 