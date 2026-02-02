#!/bin/bash

echo "🎯 Starting Quizera Quiz App with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""
echo "🚀 Building and starting containers..."
echo "   - PostgreSQL database (port 5432)"
echo "   - Backend API (port 3000)"
echo "   - Frontend app (port 5173)"
echo ""

# Start all services
docker-compose up --build

echo ""
echo "🛑 Containers stopped. Run './start.sh' to start again."
