# Tech Stack: MAP Data Visualization Tool

## Overview

This document outlines the technology stack chosen for the MAP Data Visualization Tool, including best practices, limitations, and conventions for each technology.

---

## Core Technologies

### TypeScript
**Role**: Primary programming language

**Best Practices**:
- Use strict mode (`"strict": true` in tsconfig.json)
- Define explicit types for all function parameters and return values
- Leverage type inference where it improves readability
- Use interfaces for object shapes, types for unions/primitives
- Avoid `any` type; use `unknown` when type is genuinely unknown

**Common Pitfalls**:
- Over-typing (let TypeScript infer when obvious)
- Using `as` for type assertions instead of proper type guards
- Not configuring `paths` in tsconfig for clean imports
- Forgetting to handle `null` and `undefined` in strict mode

**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "skipLibCheck": true
  }
}
```

### React
**Role**: UI library for building component-based interfaces

**Best Practices**:
- Use functional components exclusively
- Leverage hooks for state and side effects
- Keep components small and focused (single responsibility)
- Use React.memo() for expensive pure components
- Implement error boundaries for graceful error handling

**Common Pitfalls**:
- Unnecessary re-renders (use React DevTools Profiler)
- Missing dependency arrays in useEffect
- Mutating state directly
- Using array index as key in dynamic lists
- Not cleaning up side effects

**Key Patterns**:
```typescript
// Custom hook pattern
function useStudentData(studentId: string) {
  const [data, setData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  // ... implementation
  return { data, loading };
}
```

### Tailwind CSS
**Role**: Utility-first CSS framework

**Best Practices**:
- Use Tailwind's design system (spacing, colors, etc.)
- Create custom utilities for repeated patterns
- Leverage @apply for complex, reusable styles
- Use CSS variables for dynamic theming
- Configure brand colors in tailwind.config.js

**Common Pitfalls**:
- Overly long className strings (extract to components)
- Not purging unused styles in production
- Fighting Tailwind instead of configuring it
- Inline arbitrary values instead of extending config

**Configuration**:
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nextgen-green': '#67BC44',
        'nextgen-purple': '#251931',
      }
    }
  }
}
```

---

## Framework & Libraries

### Next.js
**Role**: Full-stack React framework

**Best Practices**:
- Use App Router (Next.js 13+) for better layouts
- Implement API routes for server-side logic
- Leverage static generation where possible
- Use Image component for optimized images
- Implement proper error and loading states

**Common Pitfalls**:
- Mixing client and server components incorrectly
- Not understanding data fetching patterns
- Forgetting to mark client components with 'use client'
- Poor API route organization
- Not leveraging middleware for auth

**Project Structure**:
```
app/
├── (auth)/
│   ├── login/
│   └── layout.tsx
├── dashboard/
│   ├── page.tsx
│   └── layout.tsx
├── api/
│   ├── auth/[...nextauth]/
│   ├── sheets/
│   └── visualizations/
└── layout.tsx
```

### Shadcn/ui
**Role**: Component library built on Radix UI

**Best Practices**:
- Customize components to match brand
- Use CSS variables for theming
- Maintain accessibility features
- Extend rather than override base styles
- Keep component files organized

**Common Pitfalls**:
- Not updating CSS variables for theming
- Breaking accessibility by overriding ARIA
- Installing unnecessary components
- Not customizing to match brand

**Installation Pattern**:
```bash
npx shadcn-ui@latest add button dialog form
```

### D3.js
**Role**: Data visualization library

**Best Practices**:
- Use D3 for data manipulation, React for DOM
- Create reusable chart components
- Implement responsive SVGs
- Use scales for consistent data mapping
- Separate data processing from rendering

**Common Pitfalls**:
- Fighting React's virtual DOM
- Memory leaks from not cleaning up
- Not making visualizations responsive
- Over-complicating simple charts

**React + D3 Pattern**:
```typescript
function useD3(renderFn: (svg: d3.Selection<SVGSVGElement>) => void, deps: any[]) {
  const ref = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      renderFn(svg);
    }
  }, deps);
  
  return ref;
}
```

---

## Authentication & Security

### NextAuth.js
**Role**: Authentication solution for Next.js

**Best Practices**:
- Use JWT strategy for stateless auth
- Implement proper session callbacks
- Validate email domains in signIn callback
- Set secure cookie settings in production
- Use NEXTAUTH_SECRET environment variable

**Common Pitfalls**:
- Not setting secure cookies in production
- Forgetting to handle auth errors
- Not protecting API routes
- Incorrect callback URLs

**Configuration**:
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedDomains = ['@esports.school', '@superbuilders.school'];
      return allowedDomains.some(domain => user.email?.endsWith(domain));
    }
  }
}
```

---

## Data Management

### PostgreSQL
**Role**: Relational database for persistent storage

**Best Practices**:
- Use appropriate indexes for query performance
- Implement proper migrations strategy
- Use connection pooling
- Regular backups
- Monitor query performance

**Common Pitfalls**:
- Not using indexes on foreign keys
- N+1 query problems
- Not handling connection limits
- Poor schema design

### Prisma
**Role**: TypeScript ORM for database access

**Best Practices**:
- Use Prisma Client for type-safe queries
- Implement proper error handling
- Use transactions for related operations
- Leverage Prisma Studio for development
- Keep schema.prisma organized

**Common Pitfalls**:
- Not running migrations in production
- Forgetting to regenerate client after schema changes
- Not using select to limit data fetched
- Creating too many database connections

**Schema Example**:
```prisma
model Visualization {
  id          String   @id @default(cuid())
  studentName String
  subject     String
  imageData   Bytes    // Store PNG as binary
  metadata    Json
  createdAt   DateTime @default(now())
  createdBy   String
  
  @@index([studentName, subject])
  @@index([createdAt])
}
```

### Local File Storage
**Role**: Store generated PNG files and temporary data

**Best Practices**:
- Use dedicated directory structure
- Implement file naming conventions
- Regular cleanup of old files
- Set appropriate file permissions
- Use streams for large files

**Common Pitfalls**:
- Not handling file system errors
- Poor directory organization
- Not cleaning up temporary files
- Security issues with file paths

**Implementation Pattern**:
```typescript
const STORAGE_DIR = process.env.STORAGE_PATH || './storage';
const VISUALIZATIONS_DIR = path.join(STORAGE_DIR, 'visualizations');
const TEMP_DIR = path.join(STORAGE_DIR, 'temp');

// Ensure directories exist
fs.mkdirSync(VISUALIZATIONS_DIR, { recursive: true });
```

---

## External Integrations

### Google Sheets API v4
**Role**: Access student data from Google Sheets

**Best Practices**:
- Use service account for server-side auth
- Implement proper rate limiting
- Cache data appropriately
- Handle API errors gracefully
- Use batch requests when possible

**Common Pitfalls**:
- Hitting rate limits
- Not handling network errors
- Inefficient data fetching
- Not validating data structure

**Setup Pattern**:
```typescript
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
```

---

## Image Generation

### HTML5 Canvas API
**Role**: Generate PNG images from visualizations

**Best Practices**:
- Use offscreen canvas for better performance
- Implement proper DPI scaling for print
- Handle memory efficiently
- Test across browsers
- Implement progress indicators

**Common Pitfalls**:
- Memory leaks with large canvases
- Not handling high DPI displays
- Cross-origin image issues
- Poor text rendering

**Export Pattern**:
```typescript
async function exportToPNG(element: HTMLElement): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // ... rendering logic
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob!), 'image/png');
  });
}
```

---

## State Management

### Zustand
**Role**: Client-side state management

**Best Practices**:
- Keep stores focused and small
- Use TypeScript for store typing
- Implement proper selectors
- Avoid storing derived state
- Use immer for complex updates

**Common Pitfalls**:
- Storing too much in global state
- Not using selectors (causing unnecessary re-renders)
- Mutating state directly
- Poor store organization

**Store Pattern**:
```typescript
interface VisualizationStore {
  selectedStudents: Student[];
  visualizationConfig: VisualizationConfig;
  setSelectedStudents: (students: Student[]) => void;
  updateConfig: (config: Partial<VisualizationConfig>) => void;
}

const useVisualizationStore = create<VisualizationStore>((set) => ({
  // ... implementation
}));
```

---

## Deployment & Infrastructure

### EC2 Deployment
**Role**: Self-hosted deployment on AWS EC2

**Best Practices**:
- Use PM2 for process management
- Implement proper logging
- Set up SSL with Let's Encrypt
- Configure Nginx as reverse proxy
- Automate deployments with scripts
- Regular security updates

**Common Pitfalls**:
- Not setting up proper monitoring
- Poor backup strategy
- Inadequate security configuration
- Not handling process crashes
- Manual deployment processes

**Deployment Structure**:
```bash
/var/www/map-visualization/
├── current/          # Symlink to active release
├── releases/         # Versioned releases
├── shared/           # Shared files between releases
│   ├── .env
│   ├── storage/
│   └── logs/
└── scripts/          # Deployment scripts
```

**PM2 Configuration**:
```javascript
module.exports = {
  apps: [{
    name: 'map-visualization',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/map-visualization/current',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

---

## Development Tools

### ESLint
**Role**: Code quality and consistency

**Best Practices**:
- Use Next.js ESLint config as base
- Add TypeScript rules
- Configure Tailwind CSS plugin
- Set up pre-commit hooks
- Fix issues immediately

**Common Pitfalls**:
- Disabling rules instead of fixing
- Overly strict configurations
- Not running in CI/CD
- Ignoring warnings

### Prettier
**Role**: Code formatting

**Best Practices**:
- Configure for team consistency
- Use Tailwind CSS plugin
- Set up editor integration
- Format on save
- Include in pre-commit hooks

**Configuration**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Performance Considerations

- **Bundle Size**: Monitor with Next.js Bundle Analyzer
- **Image Optimization**: Use Next.js Image component
- **Data Fetching**: Implement proper caching strategies
- **Database Queries**: Use Prisma's query analysis
- **Memory Management**: Profile Canvas usage
- **API Rate Limiting**: Implement for Google Sheets API

---

## Security Best Practices

- **Environment Variables**: Never commit secrets
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Prisma prevents by default
- **XSS Prevention**: React handles by default
- **CORS**: Configure properly for API routes
- **File Upload**: Validate file types and sizes
- **Authentication**: Implement proper session management
- **Authorization**: Check permissions on every request 