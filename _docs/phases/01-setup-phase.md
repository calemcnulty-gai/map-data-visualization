# Phase 1: Setup - MAP Data Visualization Tool

## Overview
Establish the foundational infrastructure for the MAP Data Visualization Tool. This phase creates a minimal running Next.js application with basic authentication, project structure, and core dependencies configured.

## Goals
- Set up Next.js 14 with App Router and TypeScript
- Configure authentication with NextAuth.js and Google OAuth
- Establish project structure following our conventions
- Set up development environment and tooling
- Create basic landing page with authentication flow

## Tasks

### 1. Initialize Next.js Project
**Steps:**
1. Create new Next.js app with TypeScript and Tailwind CSS
2. Configure TypeScript with strict mode settings from tech-stack.md
3. Set up path aliases in tsconfig.json (@/ for src imports)
4. Update project structure to match project-rules.md
5. Verify development server runs successfully

### 2. Configure Tailwind CSS and Theme
**Steps:**
1. Update tailwind.config.js with NextGen brand colors
2. Set up CSS variables for theming (from theme-rules.md)
3. Create globals.css with base styles and utilities
4. Configure font stack and typography scale
5. Test theme application with sample components

### 3. Install and Configure Core Dependencies
**Steps:**
1. Install essential packages: next-auth, @prisma/client, zustand, zod
2. Install Shadcn/ui CLI and add base components (button, card, input)
3. Install D3.js and canvas dependencies for future visualization work
4. Set up ESLint and Prettier with project conventions
5. Configure pre-commit hooks with Husky

### 4. Set Up Authentication Infrastructure
**Steps:**
1. Configure NextAuth.js with Google Provider
2. Create auth API route handler (app/api/auth/[...nextauth]/route.ts)
3. Set up environment variables structure (.env.local.example)
4. Implement session provider wrapper
5. Create auth utility functions for route protection

### 5. Create Basic Landing Page
**Steps:**
1. Design landing page layout with NextGen branding
2. Implement "Sign in with Google" button using Shadcn/ui
3. Add loading states and error handling
4. Create simple navigation header component
5. Ensure responsive design for tablet/desktop

### 6. Set Up Database Schema
**Steps:**
1. Initialize Prisma with PostgreSQL configuration
2. Create initial schema for user sessions and visualizations
3. Set up local PostgreSQL database for development
4. Run initial migration
5. Create database connection utilities

### 7. Implement Domain Restriction
**Steps:**
1. Add email domain validation in NextAuth callbacks
2. Create custom error page for unauthorized access
3. Test with authorized and unauthorized email addresses
4. Add helpful messaging for rejected users
5. Log authentication attempts for security

### 8. Create Project Documentation Structure
**Steps:**
1. Set up .cursor directory with project_plan.md and changelog.md
2. Create initial README.md with setup instructions
3. Document environment variables in .env.example
4. Add development workflow documentation
5. Initialize git repository with proper .gitignore

### 9. Configure Development Tools
**Steps:**
1. Set up VS Code/Cursor workspace settings
2. Configure debugging launch.json for Next.js
3. Install recommended extensions list
4. Set up npm scripts for common tasks
5. Create development database seed script

### 10. Verify Basic Authentication Flow
**Steps:**
1. Test complete sign-in flow with Google OAuth
2. Verify session persistence and logout functionality
3. Confirm domain restrictions work correctly
4. Check responsive behavior on tablet
5. Document any setup issues and solutions

## Success Criteria
- Next.js application runs locally with no errors
- Google authentication works for authorized domains only
- Project follows all conventions from project-rules.md
- Theme matches NextGen brand guidelines
- All core dependencies installed and configured
- Basic landing page displays correctly
- Development environment fully functional

## Deliverables
- Functional Next.js application skeleton
- Working Google OAuth authentication
- Configured development environment
- Project documentation structure
- Database schema and migrations
- Themed landing page with sign-in

## Notes
- This phase focuses on infrastructure, not features
- No visualization functionality yet
- Prioritize proper setup over speed
- Document all configuration decisions
- Ensure all team members can run locally 