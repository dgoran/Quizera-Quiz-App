# Network Access Guide

Access your Quizera Quiz App from phones, tablets, and other devices.

## Your Current Network Configuration

**Mac Local IP:** `192.168.68.53`

The app has been configured to use this IP address for network access.

---

## Option 1: Local Network (LAN) Access

Access from any device on the same WiFi network as your Mac.

### Access URLs

Once Docker is running, access from your phone/tablet:

**Frontend:** http://192.168.68.53:5173
**Backend API:** http://192.168.68.53:3000

### Setup Steps

1. **Make sure both devices are on the same WiFi**
   - Your Mac and phone/tablet must be connected to the same WiFi network

2. **Start the Docker containers**
   ```bash
   docker-compose up -d
   ```

3. **Open on your phone/tablet**
   - Open browser and go to: http://192.168.68.53:5173

4. **Allow firewall access** (if prompted)
   - macOS may ask to allow incoming connections
   - Click "Allow" for Docker and Node

### Troubleshooting LAN Access

**Can't connect from phone?**

1. **Check Mac firewall:**
   ```bash
   # Check firewall status
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

   # If blocked, allow Docker
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Docker.app
   ```

2. **Verify containers are running:**
   ```bash
   docker-compose ps
   ```

3. **Test from Mac first:**
   - Open http://192.168.68.53:5173 on your Mac
   - If it works on Mac but not phone, it's a firewall issue

4. **Check if ports are accessible:**
   ```bash
   lsof -i :5173
   lsof -i :3000
   ```

---

## Option 2: Internet (WAN) Access

Access from anywhere on the internet using ngrok (free tunnel service).

### Install ngrok

```bash
# Install via Homebrew
brew install ngrok

# Or download from https://ngrok.com/download
```

### Setup ngrok Account

1. Sign up at https://dashboard.ngrok.com/signup (free)
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure ngrok:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### Start ngrok Tunnels

Open **two terminal windows**:

**Terminal 1 - Backend Tunnel:**
```bash
ngrok http 3000
```

**Terminal 2 - Frontend Tunnel:**
```bash
ngrok http 5173
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### Update Frontend Configuration

1. Copy the backend ngrok URL (e.g., `https://abc123.ngrok.io`)
2. Update `quiz-app/.env`:
   ```bash
   VITE_API_URL=https://abc123.ngrok.io
   VITE_WS_URL=wss://abc123.ngrok.io
   ```
3. Restart frontend:
   ```bash
   docker-compose restart frontend
   ```

### Access from Anywhere

Use the **frontend ngrok URL** from your phone, anywhere in the world:
```
https://xyz456.ngrok.io
```

### Important ngrok Notes

- **Free tier limitations:**
  - URLs change every time you restart ngrok
  - 2-hour session timeout (need to restart)
  - Shows ngrok branding page first time

- **Paid ngrok ($8/month):**
  - Custom domains (e.g., yourapp.ngrok.io)
  - No timeout
  - No branding page

---

## Option 3: Alternative Tunnel Services

### LocalTunnel (Free, No Signup)

```bash
# Install
npm install -g localtunnel

# Start backend tunnel
lt --port 3000 --subdomain quizera-api

# Start frontend tunnel
lt --port 5173 --subdomain quizera-app
```

Access at: https://quizera-app.loca.lt

### Expose.dev (Free)

```bash
# Install
npm install -g expose-cli

# Start tunnels
expose 3000
expose 5173
```

---

## Configuration Management

### Switch Back to Localhost

To use localhost again (for local development only):

```bash
# Edit quiz-app/.env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Restart frontend
docker-compose restart frontend
```

### Script to Toggle Configuration

Create a helper script:

```bash
# Save as toggle-network.sh
chmod +x toggle-network.sh
```

```bash
#!/bin/bash

if grep -q "localhost" quiz-app/.env; then
    # Switch to network IP
    sed -i '' 's/localhost:3000/192.168.68.53:3000/g' quiz-app/.env
    echo "✅ Switched to network IP (192.168.68.53)"
else
    # Switch to localhost
    sed -i '' 's/192.168.68.53:3000/localhost:3000/g' quiz-app/.env
    echo "✅ Switched to localhost"
fi

docker-compose restart frontend
```

---

## Security Considerations

### Local Network (LAN)

- ✅ Safe for home WiFi
- ✅ No data leaves your network
- ⚠️ Anyone on your WiFi can access
- ⚠️ No HTTPS (unencrypted)

### Public Internet (WAN)

- ⚠️ Anyone with the URL can access
- ⚠️ ngrok free tier shows your tunnel URL on their status page
- ✅ ngrok provides HTTPS automatically
- ⚠️ Consider adding authentication before exposing publicly

### Recommendations

1. **For testing with friends/family:** Use ngrok with short sessions
2. **For local testing only:** Use LAN access
3. **For production:** Deploy to proper hosting (Vercel, Railway, AWS, etc.)

---

## Production Deployment

For permanent public access, deploy to:

### Frontend Options
- **Vercel** (recommended for React/Vite)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Backend Options
- **Railway** (easiest, includes PostgreSQL)
- **Render**
- **Heroku**
- **AWS Elastic Beanstalk**
- **DigitalOcean App Platform**

See deployment documentation in each platform's docs.

---

## Quick Reference

| Scenario | URL to Use | Configuration |
|----------|-----------|---------------|
| **Mac only** | http://localhost:5173 | Use localhost in .env |
| **Same WiFi** | http://192.168.68.53:5173 | Use 192.168.68.53 in .env |
| **Internet** | https://xyz.ngrok.io | Use ngrok URL in .env |

---

## Testing Checklist

- [ ] Containers are running (`docker-compose ps`)
- [ ] Firewall allows connections
- [ ] Both devices on same WiFi (for LAN)
- [ ] URLs match in frontend .env
- [ ] Frontend restarted after .env changes
- [ ] Can access from Mac first
- [ ] Then test from phone

**Current Status:** ✅ Configured for LAN access on 192.168.68.53

**To access from your phone:** http://192.168.68.53:5173
