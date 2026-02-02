#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "🔄 Network Configuration Toggle"
echo "================================"
echo ""

if grep -q "localhost" quiz-app/.env; then
    # Switch to network IP
    sed -i '' 's/localhost:3000/192.168.68.57:3000/g' quiz-app/.env
    echo -e "${GREEN}✅ Switched to Network IP (LAN access)${NC}"
    echo ""
    echo "📱 Access from your phone:"
    echo "   ${BLUE}http://192.168.68.57:5173${NC}"
    echo ""
    echo "⚠️  Make sure your phone is on the same WiFi network!"
else
    # Switch to localhost
    sed -i '' 's/192.168.68.57:3000/localhost:3000/g' quiz-app/.env
    echo -e "${GREEN}✅ Switched to Localhost (Mac only)${NC}"
    echo ""
    echo "💻 Access from your Mac:"
    echo "   ${BLUE}http://localhost:5173${NC}"
fi

echo ""
echo "🔄 Restarting frontend..."
docker-compose restart frontend > /dev/null 2>&1

echo -e "${GREEN}✅ Done!${NC}"
echo ""
