# Project Rules: MAP Data Visualization Tool

## Overview

This document establishes the organizational structure, naming conventions, and development standards for the MAP Data Visualization Tool. These rules ensure our codebase remains modular, scalable, and AI-friendly.

---

## Directory Structure

### Root Structure
```
map-data-visualization/
├── .cursor/                    # Cursor-specific files
│   ├── project_plan.md        # Task checklist and progress
│   └── changelog.md           # Development history
├── _docs/                     # Project documentation
│   ├── phases/               # Development phase documents
│   ├── project-overview.md
│   ├── user-flow.md
│   ├── tech-stack.md
│   ├── ui-rules.md
│   ├── theme-rules.md
│   └── project-rules.md
├── app/                       # Next.js App Router
│   ├── (auth)/               # Authentication routes group
│   ├── api/                  # API routes
│   ├── dashboard/            # Main application pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/                # React components
│   ├── ui/                   # Shadcn/ui components
│   ├── visualizations/       # Chart components
│   ├── forms/                # Form components
│   └── layouts/              # Layout components
├── lib/                      # Utility functions and libraries
│   ├── auth/                 # Authentication utilities
│   ├── api/                  # API client functions
│   ├── calculations/         # RIT score calculations
│   ├── constants/            # App-wide constants
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   └── utils/                # General utilities
├── services/                 # External service integrations
│   ├── database/             # Database service layer
│   ├── import/               # Data import services (CSV, Google Sheets)
│   ├── image-generation/     # PNG generation service
│   └── storage/              # File storage service
├── stores/                   # Zustand state stores
├── styles/                   # Additional style files
│   ├── themes/               # Theme configurations
│   └── visualizations/       # Visualization-specific styles
├── public/                   # Static assets
│   ├── images/              # Images and logos
│   └── fonts/               # Custom fonts (if any)
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── storage/                  # Local file storage (gitignored)
│   ├── visualizations/      # Generated PNG files
│   └── temp/                # Temporary files
├── scripts/                  # Build and deployment scripts
├── tests/                    # Test files (if requested)
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── config/                   # Configuration files
    ├── constants.ts          # Environment-agnostic constants
    └── visualization.ts      # Visualization configurations
```

---

## File Naming Conventions

### General Rules
- **Use kebab-case** for all file and directory names
- **Be descriptive** but concise
- **Group related files** in directories
- **Avoid abbreviations** unless widely understood

### Specific Conventions

#### Components
```
components/
├── student-form.tsx           # Component file
├── student-form.test.tsx      # Test file (if any)
└── student-form.module.css    # Component-specific styles
```

#### API Routes
```
app/api/
├── auth/[...nextauth]/route.ts    # NextAuth handler
├── students/[id]/route.ts          # RESTful student endpoints
└── visualizations/generate/route.ts # Clear action naming
```

#### Utilities and Libraries
```
lib/
├── calculate-rit-improvement.ts    # Single-purpose function
├── format-student-data.ts          # Data transformation
└── validate-student-input.ts       # Validation utility
```

#### Types
```
lib/types/
├── student.ts                      # Domain types
├── visualization.ts                # Feature types
├── api-responses.ts                # API-specific types
└── index.ts                        # Barrel export
```

---

## Code Organization Standards

### File Structure Template

#### React Components
```typescript
/**
 * @fileoverview Student form component for creating and editing student records
 * @module components/student-form
 */

import { useState, useCallback } from 'react';
import { Student } from '@/lib/types';

interface StudentFormProps {
  /** Existing student data for editing */
  student?: Student;
  /** Callback when form is submitted */
  onSubmit: (data: Student) => void;
  /** Callback when form is cancelled */
  onCancel: () => void;
}

/**
 * Form component for creating and editing student records
 * @param {StudentFormProps} props - Component properties
 * @returns {JSX.Element} Rendered student form
 */
export function StudentForm({ 
  student, 
  onSubmit,
  onCancel 
}: StudentFormProps) {
  // Component implementation
}
```

#### Utility Functions
```typescript
/**
 * @fileoverview Calculations for RIT score improvements based on tutoring hours
 * @module lib/calculations/rit-improvement
 */

/**
 * Calculate projected RIT score improvement
 * @param {number} currentScore - Student's current RIT score
 * @param {number} tutoringHours - Number of tutoring hours
 * @param {string} subject - Academic subject (math/reading)
 * @returns {number} Projected new RIT score
 */
export function calculateRitImprovement(
  currentScore: number,
  tutoringHours: number,
  subject: 'math' | 'reading'
): number {
  // Implementation
}
```

### Import Organization
```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { format } from 'date-fns';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { StudentCard } from '@/components/student-card';

// 4. Utilities and types
import { calculateImprovement } from '@/lib/calculations';
import type { Student, VisualizationConfig } from '@/lib/types';

// 5. Styles (if any)
import styles from './component.module.css';
```

### File Size Limits
- **Maximum 500 lines** per file
- If approaching limit, split into:
  - Separate hook files
  - Utility modules
  - Sub-components
  - Type definition files

### Component Organization
```typescript
// 1. Type definitions/interfaces
// 2. Constants
// 3. Helper functions (outside component)
// 4. Component definition
// 5. Custom hooks (if component-specific)
// 6. Exports
```

---

## TypeScript Standards

### Type Definitions
- **Prefer interfaces** for object shapes
- **Use type aliases** for unions, intersections, and primitives
- **Export shared types** from centralized location
- **Document complex types** with JSDoc

```typescript
/** Represents a student's MAP test results */
export interface Student {
  id: string;
  name: string;
  grade: number;
  age?: number;
  mathRitScore: number;
  mathPercentile: number;
  readingRitScore: number;
  readingPercentile: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Union of possible tutoring packages */
export type TutoringPackage = '10-hour' | '20-hour' | '40-hour';

/** Configuration for visualization generation */
export interface VisualizationConfig {
  includeProjections: boolean;
  packages: TutoringPackage[];
  colorScheme: 'default' | 'high-contrast';
}
```

### Strict Mode Rules
- **No `any` type** - use `unknown` when type is truly unknown
- **Explicit return types** for all functions
- **Handle null/undefined** explicitly
- **Use const assertions** for literal types

---

## API Design Standards

### Route Naming
```
GET    /api/students             # Get all students
GET    /api/students/[id]        # Get specific student
POST   /api/students             # Create new student
PUT    /api/students/[id]        # Update student
DELETE /api/students/[id]        # Delete student
POST   /api/visualizations       # Generate visualization
GET    /api/visualizations/[id]  # Get generated visualization
POST   /api/import/csv           # Import students from CSV
```

### Response Format
```typescript
// Success response
{
  success: true,
  data: T,
  metadata?: {
    timestamp: string;
    version: string;
  }
}

// Error response
{
  success: false,
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

---

## State Management Rules

### Zustand Store Organization
```typescript
// stores/student-store.ts
interface StudentStore {
  // State
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  
  // Actions (grouped by feature)
  // CRUD actions
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Selection actions
  setSelectedStudent: (student: Student | null) => void;
  clearSelection: () => void;
  
  // Data actions
  fetchStudents: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}
```

### State Principles
- **Keep stores focused** - one store per major feature
- **No derived state** - calculate in components/selectors
- **Immutable updates** - use Immer if needed
- **Clear action names** - verb + noun pattern

---

## CSS/Styling Rules

### Tailwind Usage
- **Utility-first** approach
- **Extract components** for repeated patterns
- **Use CSS variables** for dynamic values
- **Avoid arbitrary values** - extend config instead

### CSS Modules (when needed)
```css
/* component.module.css */
.container {
  /* Use CSS variables for theming */
  background: var(--background);
  
  /* Compose with Tailwind */
  @apply rounded-lg shadow-md;
}
```

---

## Documentation Standards

### Required Documentation
1. **File header** - Purpose and module name
2. **Function documentation** - JSDoc with parameters and return
3. **Complex logic** - Inline comments explaining why
4. **Type definitions** - Document non-obvious types
5. **Component props** - Document all props with purpose

### README Updates
- Update when adding new features
- Document new environment variables
- Add setup steps for new dependencies
- Include examples for new APIs

---

## Git Conventions

### Branch Naming
```
feature/student-management
fix/calculation-error
chore/update-dependencies
docs/api-documentation
```

### Commit Messages
```
feat: add student CRUD operations
fix: correct RIT score calculation for edge cases
chore: update Next.js to version 14.1
docs: add student API endpoint documentation
refactor: split student form into smaller components
```

---

## Environment Variables

### Naming Convention
```
# Public variables (exposed to client)
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MAX_FILE_SIZE=

# Server-only variables
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
DATABASE_URL=
STORAGE_PATH=
```

### Organization
- Group related variables
- Document each variable in `.env.example`
- Validate required variables on startup

---

## Testing Conventions (if implemented)

### File Naming
- `*.test.ts(x)` for unit tests
- `*.integration.test.ts` for integration tests
- `*.e2e.test.ts` for end-to-end tests

### Test Organization
```typescript
describe('StudentForm', () => {
  describe('creation mode', () => {
    it('should validate required fields', () => {
      // Test implementation
    });
  });
  
  describe('edit mode', () => {
    it('should populate fields with existing data', () => {
      // Test implementation
    });
  });
});
```

---

## Performance Guidelines

### Code Splitting
- Lazy load heavy components
- Dynamic imports for large libraries
- Route-based code splitting (automatic with Next.js)

### Optimization Rules
- Memoize expensive calculations
- Virtualize long lists
- Debounce user inputs
- Optimize images with Next.js Image
- Cache API responses appropriately

---

## Security Standards

### Input Validation
- Validate all user inputs
- Use Zod schemas for runtime validation
- Sanitize data before storage
- Escape output in visualizations

### Authentication Checks
- Verify auth on every API route
- Check domain restrictions
- Implement proper CORS policies
- Use HTTPS in production

---

## Deployment Preparation

### Build Checks
- No TypeScript errors
- No ESLint warnings
- All environment variables documented
- Database migrations ready
- Storage directories configured

### Production Readiness
- Error logging configured
- Performance monitoring setup
- Backup strategies defined
- SSL certificates ready
- PM2 configuration tested 