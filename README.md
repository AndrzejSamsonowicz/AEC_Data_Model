# AEC Data Model Viewer

A web application for viewing Autodesk APS (Platform Services) AEC Data Models with automated OAuth 3-legged authentication.

## Features

- ✅ **Automated OAuth 3-Legged Flow** - Secure authentication with Autodesk APS
- ✅ **Hub & Project Browser** - Navigate through your Autodesk hubs and projects
- ✅ **AEC Data Model Viewer** - View and explore element groups from Revit models
- ✅ **GraphQL Integration** - Queries Autodesk Data Exchange API
- ✅ **Session Management** - Automatic token refresh and session persistence
- ✅ **Multi-Region Support** - Works with all APS regions (US, EMEA, CAN, etc.)
- ✅ **Auto-Logging** - All console output automatically saved to `debug.log`

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Autodesk APS account with an app configured

## Setup Instructions

### 1. Create Autodesk APS App

1. Go to [Autodesk Platform Services Console](https://aps.autodesk.com/myapps)
2. Click **Create Application**
3. Fill in the details:
   - **App Name**: AEC Data Model Viewer
   - **App Type**: Web Application
   - **Callback URL**: `http://localhost:3000/api/callback`
4. Enable the following APIs:
   - Data Management API
   - Model Derivative API
5. Note your **Client ID** and **Client Secret**

### 2. Install Dependencies

```bash
cd "c:\MCPServer\AEC Data Model"
npm install
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Configure the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Click the **Settings** button in the top-left corner
3. Enter your:
   - **Client ID** (from step 1)
   - **Client Secret** (from step 1)
   - **Callback URL** (should be `http://localhost:3000/api/callback`)
   - **Region** (select your region)
4. Click **Save**

### 5. Login and Use

1. Click **Login With Autodesk**
2. You'll be redirected to Autodesk's login page
3. Authorize the application
4. You'll be redirected back to the app
5. Browse your hubs, projects, and AEC data models!

## Project Structure

```
AEC Data Model/
├── index.html           # Frontend application
├── server.js            # Backend Node.js server
├── package.json         # NPM dependencies
├── server-settings.json # Server configuration (auto-generated)
└── README.md           # This file
```

## How It Works

### OAuth 3-Legged Flow

1. **Initiate Login**: User clicks "Login With Autodesk"
2. **Authorization Request**: Frontend requests auth URL from backend
3. **User Authorization**: User is redirected to Autodesk's login page
4. **Callback**: Autodesk redirects back with authorization code
5. **Token Exchange**: Backend exchanges code for access token
6. **Session Creation**: Backend creates a session and returns session ID
7. **Authenticated Requests**: Frontend uses session ID for API calls

### Security Features

- ✅ Client secret never exposed to frontend
- ✅ CSRF protection with state parameter
- ✅ Automatic token refresh
- ✅ Session-based authentication
- ✅ CORS protection

## API Endpoints

### Backend API

- `GET /api/settings` - Get current settings (without secret)
- `POST /api/settings` - Update settings
- `GET /api/login` - Initiate OAuth flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/token/:sessionId` - Get access token for session
- `POST /api/logout/:sessionId` - Logout and clear session
- `POST /api/graphql` - Proxy for GraphQL requests

## GraphQL Queries

The application uses the following queries from the Autodesk Data Exchange API:

1. **Get Hubs** - List all accessible hubs
2. **Get Projects** - List projects within a hub
3. **Get Element Groups** - List AEC data models in a project
4. **Get Elements** - Query specific elements (extensible)

## Configuration

Settings are stored in `server-settings.json` and include:

```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "callbackUrl": "http://localhost:3000/api/callback",
  "region": "US"
}
```

## Supported Regions

- `US` - United States (US-East)
- `EMEA` - Europe (Ireland)
- `CAN` - Canada (Central)
- `GBR` - United Kingdom (London)
- `DEU` - Germany (Frankfurt)
- `IND` - India (Mumbai)
- `JPN` - Japan (Tokyo)
- `AUS` - Australia (Sydney)

## Debugging

All browser console output (logs, errors, warnings) is automatically captured and written to `debug.log` in real-time. This includes:

- `console.log()`, `console.error()`, `console.warn()`, etc.
- Uncaught JavaScript errors
- Unhandled promise rejections

To view the debug log:

```bash
# View the entire log
cat debug.log

# View in real-time (follow mode)
Get-Content debug.log -Wait -Tail 50

# Clear the log
Remove-Item debug.log
```

The log file uses ISO timestamps and includes the log level for easy filtering.

## Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## Troubleshooting

### "Authentication error" message

- Verify your Client ID and Client Secret are correct
- Ensure the callback URL matches exactly: `http://localhost:3000/api/callback`
- Check that the callback URL is registered in your APS app

### "Session expired" message

- Click logout and login again
- The app will automatically refresh tokens when possible

### Cannot access hubs/projects

- Ensure your Autodesk account has access to the hubs
- Verify the Data Management API is enabled in your APS app
- Check the browser console for detailed error messages

### Port already in use

If port 3000 is already in use, you can change it:

```bash
PORT=3001 npm start
```

Then update your callback URL and APS app settings accordingly.

## Production Deployment

For production deployment:

1. Use environment variables for sensitive data
2. Set up HTTPS with SSL certificates
3. Use a proper database for session storage (Redis recommended)
4. Implement rate limiting
5. Add logging and monitoring
6. Update callback URL to your production domain

## License

MIT

## Links

- [Autodesk Platform Services](https://aps.autodesk.com/)
- [Data Exchange API Documentation](https://aps.autodesk.com/en/docs/data/v2/reference/http/graphql-POST/)
- [APS Developer Portal](https://aps.autodesk.com/developer/overview)

## Support

For issues or questions:
- Check the Autodesk APS documentation
- Review the browser console for error messages
- Ensure your APS app has the correct permissions and callback URL
