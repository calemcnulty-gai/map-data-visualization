# Project Overview: MAP Data Visualization Tool

## Executive Summary

A web-based visualization tool that transforms MAP (Measures of Academic Progress) test data into compelling, parent-friendly visualizations. The tool enables NextGen Academy staff to manage student data directly within the platform and generate professional PNG images showing student performance metrics and projected improvements with tutoring packages, designed to effectively communicate the value of tutoring services to parents.

---

## Core Purpose

Create data-driven visualizations that:
- Show students' current academic standing relative to peers
- Illustrate potential improvement with different tutoring packages
- Provide clear, actionable insights for parents
- Support NextGen Academy's enrollment efforts

---

## Key Features

### Data Management
- **Student Database**: Create, update, and delete student records directly in the platform
- **Data Entry Forms**: User-friendly interfaces for entering MAP test scores and student information
- **Data Validation**: Ensure data accuracy with built-in validation rules
- **Import/Export Options**: Bulk import capabilities and data export for backups

### Visualization Components
- **Current Performance Chart**: Student's RIT score vs. grade-level benchmarks
- **Peer Comparison**: Percentile ranking visualization
- **Improvement Projections**: Visual representation of expected progress with:
  - 10-hour tutoring package
  - 20-hour tutoring package
  - 40-hour tutoring package
  - Hours needed to reach grade level
  - Hours needed to reach 90th percentile

### User Management
- **Google Authentication**: Secure login via Google OAuth
- **Access Control**: Limited to @esports.school and @superbuilders.school domains
- **Multi-user Support**: Tutors and staff can manage students and generate visualizations

### Output Generation
- **High-quality PNG Export**: Email-ready visualizations
- **Consistent Branding**: NextGen Academy colors (#67BC44 and #251931)
- **Professional Design**: Clean, modern layouts that communicate effectively

---

## Technical Requirements

### Data Storage
- **Primary Database**: PostgreSQL for persistent student data storage
- **Data Fields**: Student name, age/grade, subject, RIT scores, percentiles, improvement projections
- **Audit Trail**: Track changes to student records with timestamps and user information

### Calculation Logic
- **RIT Score Improvements**: Based on established formulas (see RIT Score Calculations document)
- **Grade Level Conversions**: Map RIT scores to grade-level equivalents
- **Percentile Rankings**: Compare student performance to national norms

### Design Specifications
- **Brand Colors**: 
  - Primary: #67BC44 (NextGen Green)
  - Secondary: #251931 (NextGen Purple)
- **Visual Style**: Professional, clean, modern
- **Key Metrics Display**:
  - Current grade level per subject
  - Hours needed to reach grade level
  - Hours needed to reach 90th percentile
  - Recommended tutoring package

---

## User Workflow

1. **Authentication**: Staff member logs in with authorized Google account
2. **Student Management**: 
   - Add new students with their MAP test data
   - Update existing student records
   - Search and filter student database
3. **Visualization Generation**: System creates customized charts showing:
   - Current performance status
   - Improvement projections for each tutoring package
   - Time investment required for specific goals
4. **Export**: Download PNG files optimized for email attachment
5. **Parent Communication**: Include visualizations in outreach emails

---

## Success Metrics

- **Clarity**: Parents immediately understand their child's current standing
- **Compelling**: Visualizations effectively communicate tutoring value
- **Efficiency**: Staff can generate visualizations in under 2 minutes
- **Accuracy**: All calculations align with MAP scoring methodology
- **Professional**: Output quality reflects NextGen Academy's standards
- **Data Integrity**: Reliable student data management with validation

---

## Phase Overview

### Phase 1: Foundation
- Basic authentication system
- Database schema design
- Core data models and validation

### Phase 2: MVP
- Student CRUD operations
- Essential visualization generation
- PNG export functionality
- Basic UI for data management

### Phase 3: Enhancement
- Advanced visualization options

- Performance optimizations
- Additional chart types
- Data import/export features

---

## Constraints & Considerations

- **Data Privacy**: Secure storage of student data with proper access controls
- **Performance**: Handle database with 1000+ student records efficiently
- **Scalability**: Support multiple concurrent users
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Responsive design for tablet use (phone support not required)
- **Data Backup**: Regular automated backups of student database

---

## Expected Outcomes

A professional tool that empowers NextGen Academy staff to:
- Efficiently manage student MAP test data
- Quickly generate compelling visualizations
- Communicate student progress effectively
- Demonstrate tutoring value proposition
- Increase enrollment through data-driven conversations
- Maintain accurate, up-to-date student records 