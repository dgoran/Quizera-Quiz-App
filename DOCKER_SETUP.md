# Docker Setup Guide

Run the entire Quizera Quiz App with a single command using Docker!

## Prerequisites

Only **Docker Desktop** is required:
- **Mac**: Download from https://www.docker.com/products/docker-desktop/
- Or install via Homebrew: `brew install --cask docker`

That's it! No need to install Node.js, PostgreSQL, or any other dependencies.

## Quick Start

### 1. Start Everything

From the project root directory, run:

```bash
docker-compose up
```

This single command will:
- Start PostgreSQL database (port 5432)
- Build and start the backend server (port 3000)
- Build and start the frontend app (port 5173)
- Automatically run database migrations
- Set up all networking between services

### 2. Access the Application

Once you see "server running at port 3000" in the logs:

**Frontend:** http://localhost:5173
**Backend API:** http://localhost:3000
**Database:** localhost:5432

### 3. Stop Everything

Press `Ctrl+C` in the terminal, then run:

```bash
docker-compose down
```

To also remove the database data:

```bash
docker-compose down -v
```

## Docker Commands Reference

### Start in Background (Detached Mode)
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart a Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up --build

# Rebuild specific service
docker-compose up --build backend
```

### Stop All Services
```bash
docker-compose down
```

### Remove Everything (including volumes)
```bash
docker-compose down -v
```

## Container Details

### Services Running

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| **postgres** | quizera-db | 5432 | PostgreSQL 15 database |
| **backend** | quizera-backend | 3000 | Node.js API + WebSocket server |
| **frontend** | quizera-frontend | 5173 | React + Vite dev server |

### File Structure

```
Quizera-Quiz-App/
├── docker-compose.yml          # Orchestrates all services
├── .env.example               # Environment variables reference
│
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── .dockerignore          # Files to exclude from build
│   └── .env                   # Backend environment (auto-used)
│
└── quiz-app/
    ├── Dockerfile             # Frontend container config
    ├── .dockerignore          # Files to exclude from build
    └── .env                   # Frontend environment (auto-used)
```

## Development Workflow

### Hot Reloading

Both frontend and backend support hot reloading:
- **Frontend**: Vite will automatically reload on file changes
- **Backend**: Currently requires restart (see "Add Nodemon" below)

### Database Management

Access the database:

```bash
# Connect to PostgreSQL
docker exec -it quizera-db psql -U postgres -d quizera

# View all tables
\dt

# Exit
\q
```

Run Prisma commands:

```bash
# Generate Prisma Client
docker exec -it quizera-backend npx prisma generate

# Create a new migration
docker exec -it quizera-backend npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (database GUI)
docker exec -it quizera-backend npx prisma studio
```

### Debugging

Enter a running container:

```bash
# Backend shell
docker exec -it quizera-backend sh

# Frontend shell
docker exec -it quizera-frontend sh

# Database shell
docker exec -it quizera-db sh
```

## Configuration

### Environment Variables

The [docker-compose.yml](docker-compose.yml) file contains all environment variables. To customize:

1. **Database credentials**: Edit the `postgres` service environment
2. **JWT secret**: Edit the `backend` service environment
3. **API URLs**: Edit the `frontend` service environment

### Ports

To change ports, edit [docker-compose.yml](docker-compose.yml):

```yaml
services:
  backend:
    ports:
      - "YOUR_PORT:3000"  # Change YOUR_PORT

  frontend:
    ports:
      - "YOUR_PORT:5173"  # Change YOUR_PORT
```

Remember to update `VITE_API_URL` and `VITE_WS_URL` in the frontend service if you change the backend port.

## Troubleshooting

### Port Already in Use

If you get "port is already allocated" errors:

1. **Check what's using the port:**
   ```bash
   lsof -i :3000   # Backend
   lsof -i :5173   # Frontend
   lsof -i :5432   # Database
   ```

2. **Stop the conflicting service** or change the port in [docker-compose.yml](docker-compose.yml)

### Database Connection Errors

If the backend can't connect to the database:

1. **Check if PostgreSQL is healthy:**
   ```bash
   docker-compose ps
   ```
   Status should show "healthy" for postgres

2. **View database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Restart the database:**
   ```bash
   docker-compose restart postgres
   ```

### Backend Won't Start

1. **Check logs:**
   ```bash
   docker-compose logs backend
   ```

2. **Rebuild the container:**
   ```bash
   docker-compose up --build backend
   ```

3. **Check Prisma migrations:**
   ```bash
   docker exec -it quizera-backend npx prisma migrate status
   ```

### Frontend Build Errors

1. **Clear node_modules and rebuild:**
   ```bash
   docker-compose down
   docker-compose up --build frontend
   ```

2. **Check logs for specific errors:**
   ```bash
   docker-compose logs frontend
   ```

### Containers Keep Restarting

Check logs for error messages:
```bash
docker-compose logs -f
```

Common issues:
- Database connection string incorrect
- Port conflicts
- Missing environment variables

## Production Considerations

For production deployment:

1. **Change JWT_SECRET** to a strong random value
2. **Use production builds** (add production Dockerfiles)
3. **Add nginx** for serving frontend and reverse proxy
4. **Use secrets management** instead of environment variables
5. **Enable HTTPS** with SSL certificates
6. **Set NODE_ENV=production**

## Advantages of Docker Setup

- **No local installations** required (except Docker)
- **Consistent environment** across all machines
- **Easy cleanup** - just remove containers
- **Isolated services** - won't conflict with other projects
- **Quick setup** - one command to start everything
- **Version controlled** - entire infrastructure as code

## Optional Enhancements

### Add Nodemon for Backend Hot Reload

Edit [backend/Dockerfile](backend/Dockerfile):

```dockerfile
# Install nodemon globally
RUN npm install -g nodemon

# Change CMD to use nodemon
CMD ["sh", "-c", "npx prisma migrate deploy && nodemon logic.js"]
```

### Add Production Build for Frontend

Create `quiz-app/Dockerfile.prod`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Getting Help

- **View all containers:** `docker ps -a`
- **View logs:** `docker-compose logs -f [service]`
- **Clean everything:** `docker system prune -a` (removes all Docker data)

## Next Steps

1. Start the application: `docker-compose up`
2. Open http://localhost:5173
3. Create a user account
4. Create a quiz
5. Start a quiz session
6. Join in another browser/tab to test real-time features!

---

**Ready to go!** Just run `docker-compose up` and everything will be set up automatically.
