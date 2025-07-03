const { google } = require('googleapis');
const path = require('path');

async function testAuth() {
  try {
    console.log('Testing Google Sheets authentication...\n');
    
    // Check environment variables
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || '/Users/calemcnulty/Workspaces/perms/nextgen-map-viz-service-account.json';
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1ACqYKCG6wYELruWp-vppRll-4lnvVmgP9RbevVA9V8U';
    
    console.log('Service Account Key Path:', keyPath);
    console.log('Spreadsheet ID:', spreadsheetId);
    console.log('\n');

    // Initialize auth
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Get client
    const authClient = await auth.getClient();
    console.log('Auth client created successfully');
    console.log('Client email:', authClient.email);
    console.log('\n');

    // Initialize sheets
    const sheets = google.sheets({ version: 'v4', auth });

    // Test connection
    console.log('Testing spreadsheet access...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
      fields: 'properties.title',
    });

    console.log('✅ Success! Connected to spreadsheet:', response.data.properties.title);
    
    // Try to get values
    console.log('\nTesting data read...');
    const valuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'A1:B2',
    });
    
    console.log('✅ Successfully read data. First few cells:', valuesResponse.data.values);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAuth(); 