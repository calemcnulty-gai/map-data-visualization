# Google OAuth Setup Guide for MAP Data Visualization

## Project Information
- **Project ID**: `nextgen-map-viz`
- **Project Name**: NextGen MAP Visualization
- **APIs Enabled**: Google Sheets API, Google Drive API

## Setup Steps

### 1. Configure OAuth Consent Screen

1. Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent?project=nextgen-map-viz)
2. Choose **Internal** (if available) or **External**
3. Fill in the required information:
   - App name: `NextGen MAP Visualization`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `spreadsheets.readonly`
5. Save and continue

### 2. Create OAuth 2.0 Credentials

1. Go to [Credentials page](https://console.cloud.google.com/apis/credentials?project=nextgen-map-viz)
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - Name: `NextGen MAP Visualization Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - Your production domain (when ready)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Click **CREATE**
6. Copy the Client ID and Client Secret

### 3. Update Environment Variables

Create a `.env.local` file in the project root:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret # Generate with: openssl rand -base64 32

# Google OAuth (from step 2)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/map_visualization?schema=public"

# Google Sheets
GOOGLE_SHEETS_ID=1ACqYKCG6wYELruWp-vppRll-4lnvVmgP9RbevVA9V8U
```

### 4. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 5. Test Authentication

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Sign in with Google"
4. Verify that only @esports.school and @superbuilders.school emails can sign in

## Troubleshooting

### "Access blocked" error
- Make sure the OAuth consent screen is properly configured
- Verify all redirect URIs are correctly added

### "Invalid redirect URI" error
- Double-check that `http://localhost:3000/api/auth/callback/google` is added to authorized redirect URIs
- Ensure NEXTAUTH_URL in .env.local matches your development URL

### Domain restriction not working
- Check the NextAuth configuration in `app/api/auth/[...nextauth]/route.ts`
- Verify the email domain checking logic is correct

## Additional Resources
- [Google Cloud Console](https://console.cloud.google.com/welcome?project=nextgen-map-viz)
- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google) 