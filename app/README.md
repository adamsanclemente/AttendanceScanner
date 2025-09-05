# Frontend Application

This directory contains the SvelteKit-based web application for the Attendance Scanner system.

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment setup**

   ```bash
   cp sample.env .env
   # Edit .env with your configuration
   ```

3. **Database setup**

   ```bash
   pnpm run generate  # Generate Drizzle schemas
   pnpm run migrate   # Apply database migrations
   ```

4. **Development server**

   ```bash
   pnpm run dev
   ```

5. **Open application**
   Navigate to [http://localhost:5173](http://localhost:5173)

## Features

- 🔐 **Authentication**: Email/password + Google OAuth
- 🏫 **Multi-school**: Manage multiple schools and classes
- 👥 **User Management**: Students, teachers, and administrators
- 📊 **Attendance Tracking**: Real-time status and history
- 📧 **Email Notifications**: Automated attendance alerts
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Clean interface with dark/light modes

## Technology Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS + shadcn-svelte components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia Auth
- **Forms**: Superforms with Zod validation
- **Icons**: Lucide icons
- **Email**: AWS SES / SMTP fallback

## Development Commands

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run check        # Type checking
pnpm run lint         # Lint code
pnpm run format       # Format code
pnpm run studio       # Open Drizzle Studio
```

## Project Structure

```text
src/
├── app.d.ts              # Type definitions
├── app.html              # HTML template
├── hooks.server.ts       # Server-side hooks
├── lib/
│   ├── components/       # Reusable UI components
│   ├── config/          # Configuration files
│   └── server/          # Server-side utilities
└── routes/              # Page routes and API endpoints
    ├── (protected)/     # Authenticated routes
    ├── auth/           # Authentication pages
    └── api/            # API endpoints
```

## Deployment

This application is designed for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## Environment Variables

Required variables (copy from `sample.env`):

- `DATABASE_URL`: PostgreSQL connection string
- `SCANNER_API_KEY`: API key for scanner authentication
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (optional)
- Email configuration (AWS SES or SMTP)

## API Endpoints

### Scanner Integration

- `POST /api/record` - Record student attendance
  - Query params: `studentId`, `classId`, `apikey`
  - Returns: Student name and attendance status

### Status

- `GET /api/status` - Health check endpoint

## Security Notes

⚠️ **This project was created for educational purposes and may not follow all production security best practices.**

Key security considerations:

- API key authentication for scanner
- Input validation with Zod
- Environment variable configuration
- HTTPS in production (handled by Vercel)

## Contributing

This project is archived but can serve as a learning resource. See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
