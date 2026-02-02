#!/bin/bash

echo "🛑 Stopping Quizera Quiz App..."
echo ""

docker-compose down

echo ""
echo "✅ All containers stopped and removed."
echo ""
echo "To remove database data as well, run:"
echo "   docker-compose down -v"
