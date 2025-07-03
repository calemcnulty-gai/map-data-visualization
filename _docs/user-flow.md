# User Flow: MAP Data Visualization Tool

## Overview

This document outlines the complete user journey through the MAP Data Visualization Tool, from initial access to final visualization export. The flow is designed for NextGen Academy staff members who need to manage student MAP test data and generate compelling visualizations for parent communications.

---

## User Personas

### Primary User: NextGen Academy Staff
- **Role**: Tutors, enrollment specialists, academic advisors
- **Goal**: Manage student data and generate professional visualizations to demonstrate tutoring value to parents
- **Technical Level**: Basic to intermediate computer skills
- **Access**: Authorized @esports.school or @superbuilders.school email accounts

---

## User Journey Map

### 1. Initial Access
**User Goal**: Access the MAP data visualization tool

**Steps**:
1. Navigate to the application URL
2. Sign in with Google account (NextGen email)
3. Land on main dashboard

**System Actions**:
- Authenticate via Google OAuth
- Load user permissions
- Fetch initial data from database

### 2. Student Management
**User Goal**: View and manage student data

**Steps**:
1. View student list on dashboard
2. Search/filter students by:
   - Name
   - Grade level
   - Student type (Tournament/Prospective)
3. Add new student with MAP scores
4. Edit existing student data
5. Delete students

**System Actions**:
- Display paginated student list
- Real-time search filtering
- CRUD operations on database
- Auto-calculate percentiles from RIT scores

### 3. Data Synchronization
**User Goal**: Import student data from Google Sheets

**Steps**:
1. Click "Sync from Sheets" button
2. System imports data from configured sheet
3. View sync status and results

**System Actions**:
- Connect to Google Sheets API
- Parse and validate data
- Update database with new/changed records
- Display sync progress and errors

### 4. Visualization Generation
**User Goal**: Create performance visualizations for students

**Steps**:
1. Click on a student from the list
2. Select subject from dropdown
3. View real-time preview
4. Click "Download PNG" to save

**System Actions**:
- Navigate to visualization page
- Generate chart with D3.js
- Render performance data
- Export as PNG file

---

## Key Features

### Student Data Table
- **Search**: Real-time filtering by student name
- **Filters**: Grade level and student type
- **Actions**: Edit and delete per student
- **Navigation**: Click row to generate visualization

### Visualization Options
- **Subject Selection**: Dropdown for Math, Reading, Language, Science
- **Preview**: Real-time chart preview
- **Download**: High-quality PNG export

### Data Management
- **Add Student**: Modal form with RIT score inputs
- **Edit Student**: Update existing student data
- **Delete Student**: Remove with confirmation
- **Sync**: Import from Google Sheets

---

## Technical Flow

### Authentication Flow
```
User → Google OAuth → JWT Session → Dashboard Access
```

### Data Flow
```
Google Sheets → Sync API → PostgreSQL → Dashboard → Visualizations
```

### Visualization Flow
```
Select Student → Choose Subject → Generate Chart → Download PNG
```

---

## Error Handling

### Common Error Scenarios
1. **Sync Failures**
   - Network errors
   - Invalid data format
   - Permission issues

2. **Visualization Errors**
   - Missing student data
   - Invalid scores
   - Generation failures

3. **Authentication Issues**
   - Expired sessions
   - Invalid credentials
   - Permission denied

### User Feedback
- Loading states during operations
- Error messages with clear actions
- Success confirmations
- Progress indicators for long operations

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