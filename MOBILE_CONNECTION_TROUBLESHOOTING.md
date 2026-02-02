# Mobile Phone Connection Troubleshooting

Quick guide to fix connection issues when participants try to join from mobile phones.

## 🔍 Quick Diagnosis

### Is the mobile phone on the same WiFi?

**Same WiFi (LAN)** ✅
- Should work with current setup
- Use: http://192.168.68.53:5173

**Different network/Mobile data** ❌
- Won't work with current setup
- Need ngrok or VPN (see solutions below)

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot connect to room" or stuck loading

**Cause:** Mobile phone is not on the same WiFi network as your Mac

**Solution A: Connect to Same WiFi (Easiest)**
```
1. On mobile phone:
   - Open WiFi settings
   - Connect to the SAME WiFi as your Mac
   - Try again: http://192.168.68.53:5173
```

**Solution B: Use ngrok for Remote Access**
```bash
# Terminal 1: Backend tunnel
ngrok http 3000

# Terminal 2: Frontend tunnel
ngrok http 5173
```

Then update quiz-app/.env with ngrok URLs and share the frontend ngrok URL.

---

### Issue 2: Page loads but "Joining room..." stuck

**Cause:** WebSocket connection failing

**Check:**
1. Open browser console on mobile (Safari/Chrome DevTools)
2. Look for WebSocket errors

**Solution:** Restart backend
```bash
docker-compose restart backend
```

---

### Issue 3: Mac firewall blocking connections

**Cause:** macOS firewall blocking incoming connections

**Solution:**
```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Temporarily disable (not recommended for public WiFi)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Or allow Docker specifically
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Docker.app
```

---

### Issue 4: HTTPS/Mixed Content Error

**Cause:** Some browsers block WebSocket (ws://) on HTTPS pages

**Solution:** Use ngrok which provides HTTPS automatically

---

## 📱 Step-by-Step: Testing Mobile Connection

### Step 1: Verify WiFi Connection

**On Mac:**
```bash
# Check your Mac's IP
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Mobile Phone:**
- Settings → WiFi → Check network name
- **Must match** your Mac's WiFi

### Step 2: Test Network Connectivity

**On Mobile Phone browser:**
```
http://192.168.68.53:3000
```

**Expected:** Should see some response (even if error)
**If fails:** Not on same network or firewall blocking

### Step 3: Test Frontend

**On Mobile Phone browser:**
```
http://192.168.68.53:5173
```

**Expected:** Should see Quizera landing page
**If fails:** Frontend not accessible

### Step 4: Test Room Join

1. Create quiz as ADMIN on Mac
2. Start session, get room code
3. On mobile: Click "Join Quiz Anonymously"
4. Enter name and room code
5. Click "Join Quiz"

**Expected:** Should join room successfully
**If stuck:** WebSocket issue (see solutions below)

---

## 🔧 Advanced Troubleshooting

### Check WebSocket Connection (Browser Console)

**On Mobile Phone:**

**Safari:**
1. Settings → Safari → Advanced → Web Inspector: ON
2. On Mac: Safari → Develop → [Your iPhone] → [Page]

**Chrome:**
1. chrome://inspect on desktop Chrome
2. Connect phone via USB
3. Click "inspect"

**Look for errors like:**
```
WebSocket connection to 'ws://192.168.68.53:3000' failed
Mixed Content: The page was loaded over HTTPS, but attempted to connect to insecure WebSocket endpoint
```

### Check Backend Logs

```bash
docker-compose logs -f backend
```

**Look for:**
- "new webSocket client added" ✅ (good)
- "WebSocket error" ❌ (problem)
- Connection errors ❌ (problem)

### Check Network Ports

```bash
# On Mac: Check if ports are accessible
lsof -i :3000
lsof -i :5173

# Should show Docker processes
```

---

## 🌐 Remote Access Solutions (Different WiFi/Mobile Data)

### Option 1: ngrok (Recommended)

**Install:**
```bash
brew install ngrok

# Sign up: https://dashboard.ngrok.com/signup
ngrok config add-authtoken YOUR_TOKEN
```

**Setup:**
```bash
# Terminal 1: Backend
ngrok http 3000
# Copy URL: https://abc123.ngrok.io

# Terminal 2: Frontend
ngrok http 5173
# Copy URL: https://xyz456.ngrok.io
```

**Update Environment:**
```bash
# Edit quiz-app/.env
VITE_API_URL=https://abc123.ngrok.io
VITE_WS_URL=wss://abc123.ngrok.io

# Restart frontend
docker-compose restart frontend
```

**Share with participants:**
```
https://xyz456.ngrok.io
```

### Option 2: LocalTunnel (No signup)

```bash
# Install
npm install -g localtunnel

# Terminal 1: Backend
lt --port 3000 --subdomain quizera-api

# Terminal 2: Frontend
lt --port 5173 --subdomain quizera-app
```

Use: https://quizera-app.loca.lt

### Option 3: Tailscale VPN (Best for private use)

```bash
# Install Tailscale on Mac and mobile
# All devices will be on same "network"
# Use Tailscale IP instead of 192.168.68.53
```

---

## 🛡️ Firewall Configuration

### macOS Firewall Settings

**Via GUI:**
1. System Settings → Network → Firewall
2. Options → Add → /Applications/Docker.app
3. Allow incoming connections

**Via Terminal:**
```bash
# Allow Docker
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Docker.app --unblock

# Check status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

### Router Firewall (For LAN)

Most home routers allow devices on same WiFi to communicate.
If issues persist, check router settings for "Client Isolation" and disable it.

---

## 📊 Diagnostic Checklist

Run through this checklist:

**Network:**
- [ ] Mobile phone on same WiFi as Mac
- [ ] Mac IP is 192.168.68.53 (verify with `ifconfig`)
- [ ] Can access http://192.168.68.53:5173 on mobile
- [ ] Can access http://192.168.68.53:3000 on mobile

**Services:**
- [ ] Docker containers running (`docker-compose ps`)
- [ ] Backend accessible (`curl http://192.168.68.53:3000`)
- [ ] Frontend accessible (`curl http://192.168.68.53:5173`)

**Configuration:**
- [ ] quiz-app/.env has correct IP (192.168.68.53)
- [ ] VITE_API_URL = http://192.168.68.53:3000
- [ ] VITE_WS_URL = ws://192.168.68.53:3000

**Firewall:**
- [ ] Mac firewall allows Docker
- [ ] No "Connection refused" errors in browser console
- [ ] No "Mixed content" warnings

**WebSocket:**
- [ ] Backend logs show "new webSocket client added"
- [ ] No WebSocket errors in browser console
- [ ] Connection established in Network tab

---

## 🎯 Quick Fixes to Try Right Now

### Fix 1: Restart Everything
```bash
docker-compose down
docker-compose up -d
```

### Fix 2: Verify Environment
```bash
cat quiz-app/.env
# Should show: 192.168.68.53
```

### Fix 3: Test Backend API
```bash
# On Mac
curl http://192.168.68.53:3000

# Should return something (even 404 is OK)
```

### Fix 4: Check Mobile Browser
- Clear browser cache
- Try incognito/private mode
- Try different browser (Chrome vs Safari)

### Fix 5: Temporarily Disable Firewall
```bash
# On Mac (for testing only!)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Test connection from mobile

# Re-enable after testing
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

---

## 💡 Most Common Solutions

**80% of issues are:**

1. **Not on same WiFi** → Connect mobile to same WiFi
2. **Firewall blocking** → Allow Docker in firewall
3. **Wrong IP in .env** → Verify 192.168.68.53 is correct
4. **Containers not running** → `docker-compose up -d`
5. **Trying from mobile data** → Use ngrok instead

---

## 📞 Getting More Help

If still stuck, gather this info:

**On Mac:**
```bash
# 1. Container status
docker-compose ps

# 2. Backend logs
docker-compose logs backend | tail -50

# 3. Frontend logs
docker-compose logs frontend | tail -20

# 4. Network config
ifconfig | grep "inet "
cat quiz-app/.env
```

**On Mobile:**
```
1. Screenshot of error message
2. Browser console errors (if accessible)
3. Network name (WiFi or mobile data)
4. URL you're trying to access
```

---

**Quick Test Command:**
```bash
# Run this on Mac to verify setup
echo "Testing setup..."
echo "Mac IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')"
echo "Containers:" && docker-compose ps --format "table {{.Name}}\t{{.Status}}"
echo "Environment:" && cat quiz-app/.env
echo "Backend responsive:" && curl -s -o /dev/null -w "%{http_code}" http://192.168.68.53:3000
echo "Frontend responsive:" && curl -s -o /dev/null -w "%{http_code}" http://192.168.68.53:5173
```
