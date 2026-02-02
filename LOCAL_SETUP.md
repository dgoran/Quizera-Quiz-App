# Local Setup Guide for Mac

## What I've Done So Far

1. Created [backend/.env](backend/.env) with database and JWT configuration
2. Created [quiz-app/.env](quiz-app/.env) with API and WebSocket URLs
3. Added start scripts to [backend/package.json](backend/package.json)
4. Started installing dependencies (currently in progress)

## Prerequisites You Need

### 1. Install PostgreSQL (Required)

Since PostgreSQL is not currently installed on your Mac, you need to install it first:

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create the database
createdb quizera
```

**Alternative: Using Postgres.app**
- Download from https://postgresapp.com/
- Drag to Applications folder
- Open Postgres.app and initialize
- Add to PATH: `sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp`

### 2. Node.js (Already Installed ✓)
- You have Node.js v22.15.0 installed

## Complete Setup Steps

### Step 1: Install PostgreSQL (if not done yet)
Follow the PostgreSQL installation steps above.

### Step 2: Configure Database Connection

The [backend/.env](backend/.env) file has been created with this default configuration:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/quizera"
```

**Important:** Update the database credentials if needed:
- `postgres` - your PostgreSQL username (default is usually `postgres` or your Mac username)
- `password` - your PostgreSQL password (might be empty for local dev)
- `localhost:5432` - database host and port
- `quizera` - database name

### Step 3: Install Dependencies

The dependencies are currently installing. If they complete successfully, skip this step. Otherwise run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../quiz-app
npm install
```

### Step 4: Setup Database with Prisma

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### Step 5: Start the Application

You'll need TWO terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
This starts the backend server at http://localhost:3000

**Terminal 2 - Frontend Dev Server:**
```bash
cd quiz-app
npm run dev
```
This starts the frontend at http://localhost:5173 (Vite default port)

## Verify Everything Works

1. Open your browser to the URL shown by Vite (usually http://localhost:5173)
2. You should see the Quizera landing page
3. Try creating an account and logging in

## Project Structure

```
Quizera-Quiz-App/
├── backend/               # Node.js + Express + WebSocket server
│   ├── .env              # Database & JWT config (created)
│   ├── logic.js          # Main server entry point
│   ├── prisma/           # Database schema and migrations
│   ├── routes/           # API endpoints
│   ├── ws/               # WebSocket handlers
│   └── middleware/       # Auth middleware
│
└── quiz-app/             # React + Vite frontend
    ├── .env              # API URLs (created)
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── Contexts/     # Socket & Auth contexts
    │   └── hooks/        # Custom React hooks
    └── package.json
```

## Troubleshooting

### PostgreSQL Connection Errors

If you see `ECONNREFUSED` or connection errors:

1. Check if PostgreSQL is running:
```bash
brew services list | grep postgresql
```

2. Try connecting manually:
```bash
psql -U postgres
# or
psql -U $(whoami)
```

3. Create the database if it doesn't exist:
```bash
createdb quizera
```

### Port Already in Use

If port 3000 or 5173 is already in use:

**For backend (port 3000):**
- Edit [backend/.env](backend/.env) and change `PORT=3000` to another port
- Update [quiz-app/.env](quiz-app/.env) to match: `VITE_API_URL=http://localhost:YOUR_NEW_PORT`

**For frontend:**
- Vite will automatically try the next available port (5174, 5175, etc.)

### Prisma Migration Errors

If migrations fail:
```bash
cd backend
npx prisma db push  # Force sync schema without migrations
npx prisma generate
```

## Environment Variables Reference

### Backend ([backend/.env](backend/.env))
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Frontend ([quiz-app/.env](quiz-app/.env))
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket server URL

## Next Steps After Setup

1. Create a user account (signup)
2. Create a quiz with questions
3. Start a quiz session
4. Join as a participant in another browser/incognito window
5. Experience the real-time quiz functionality!

## Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express, Native WebSockets
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT with bcrypt
