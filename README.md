# MAP Data Visualization Tool

A web-based visualization tool that transforms MAP (Measures of Academic Progress) test data from Google Sheets into compelling, parent-friendly visualizations for NextGen Academy.

## Overview

This tool helps NextGen Academy staff generate professional visualizations showing:
- Students' current academic standing relative to peers
- Projected improvements with different tutoring packages
- Clear, actionable insights for parent communications

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Visualizations**: D3.js
- **State Management**: Zustand
- **UI Components**: Shadcn/ui

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console project with OAuth 2.0 credentials
- Access to the MAP data Google Sheet

## Setup Instructions

### 1. Clone the Repository

```bash
git clone [repository-url]
cd map-data-visualization
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and update with your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `DATABASE_URL`: PostgreSQL connection string

### 4. Database Setup

Initialize the database with Prisma:

```bash
npx prisma generate
npx prisma db push
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Authentication

Access is restricted to users with email addresses ending in:
- `@esports.school`
- `@superbuilders.school`

## Project Structure

```
map-data-visualization/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Main application
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── providers/        # Context providers
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── prisma/               # Database schema
└── public/               # Static assets
```

## Development Workflow

1. Check `.cursor/project_plan.md` for current tasks
2. Update task status as you work
3. Document changes in `.cursor/changelog.md`
4. Follow the coding conventions in `_docs/project-rules.md`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Phase Overview

- **Phase 1**: Setup and Authentication ✅
- **Phase 2**: Core Functionality (In Progress)
- **Phase 3**: Enhancement
- **Phase 4**: Polish and Deployment

## Contributing

1. Follow the established code style and conventions
2. Write descriptive commit messages
3. Update documentation as needed
4. Test thoroughly before submitting changes

## Support

For questions or issues, contact the NextGen Academy development team.

## Deployment

The application is deployed to https://visualizations.nextgenafter.school

### Deployment Steps

1. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

2. On first deployment, set up the database:
   ```bash
   # SSH into the server
   ssh -i ~/.ssh/nextgen-academy-key.pem ubuntu@nextgenafter.school
   
   # The database is already set up with:
   # - PostgreSQL 16
   # - Database: map_data_visualization
   # - User: mapviz
   # - Connection string in .env.production
   
   # To run migrations manually if needed:
   cd /var/www/map-data-visualization
   export DATABASE_URL='postgresql://mapviz:mapviz_prod_2025@localhost:5432/map_data_visualization'
   npx prisma migrate deploy
   ```

3. Configure environment variables:
   - Edit `/var/www/map-data-visualization/.env.production`
   - Add your Google OAuth credentials
   - Add your Google Sheets API credentials
   - Generate and add NEXTAUTH_SECRET

4. Restart the application:
   ```bash
   pm2 restart map-data-visualization
   ```
