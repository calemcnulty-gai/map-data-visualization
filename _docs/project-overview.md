# Project Overview: MAP Data Visualization Tool

## Executive Summary

A web-based visualization tool that transforms MAP (Measures of Academic Progress) test data from Google Sheets into compelling, parent-friendly visualizations. The tool will generate professional PNG images showing student performance metrics and projected improvements with NextGen Academy tutoring packages, designed to effectively communicate the value of tutoring services to parents.

---

## Core Purpose

Create data-driven visualizations that:
- Show students' current academic standing relative to peers
- Illustrate potential improvement with different tutoring packages
- Provide clear, actionable insights for parents
- Support NextGen Academy's enrollment efforts

---

## Key Features

### Data Integration
- **Google Sheets API Integration**: Direct connection to live MAP data spreadsheet
- **Automated Data Processing**: Parse student scores, percentiles, and grade levels
- **Real-time Updates**: Reflect changes in source data immediately

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
- **Multi-user Support**: Tutors and staff can generate visualizations for any student

### Output Generation
- **High-quality PNG Export**: Email-ready visualizations
- **Consistent Branding**: NextGen Academy colors (#67BC44 and #251931)
- **Professional Design**: Clean, modern layouts that communicate effectively

---

## Technical Requirements

### Data Source
- **Primary Source**: Google Sheets via API
- **Sheet URL**: https://docs.google.com/spreadsheets/d/1ACqYKCG6wYELruWp-vppRll-4lnvVmgP9RbevVA9V8U/
- **Data Fields**: Student name, age/grade, subject, RIT scores, percentiles, improvement projections

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
2. **Data Selection**: Choose student(s) from synchronized Google Sheet data
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

---

## Phase Overview

### Phase 1: Foundation
- Basic authentication system
- Google Sheets integration
- Core data processing

### Phase 2: MVP
- Essential visualization generation
- PNG export functionality
- Basic UI for data selection

### Phase 3: Enhancement
- Advanced visualization options
- Batch processing capabilities
- Performance optimizations
- Additional chart types

---

## Constraints & Considerations

- **Data Privacy**: No persistent storage of student data
- **Performance**: Handle sheets with 500+ student records efficiently
- **Scalability**: Support multiple concurrent users
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Responsive design for tablet use (phone support not required)

---

## Expected Outcomes

A professional tool that empowers NextGen Academy staff to:
- Quickly generate compelling visualizations
- Communicate student progress effectively
- Demonstrate tutoring value proposition
- Increase enrollment through data-driven conversations 