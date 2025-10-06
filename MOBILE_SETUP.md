# Mobile QR Code Setup

## Problem
QR codes with `localhost:3000` don't work on mobile phones because localhost only works on the same device.

## Solution
You need to use your computer's network IP address instead of localhost.

## Steps to Fix:

### 1. Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### 2. Start React with Network Access
Instead of `npm start`, use:
```bash
npm start -- --host 0.0.0.0
```

### 3. Update the IP in Dashboard.js
Open `src/components/Dashboard.js` and find line with:
```javascript
return '192.168.1.100'; // User needs to replace with their actual IP
```

Replace `192.168.1.100` with your actual IP address.

### 4. Access from Mobile
- Make sure phone and computer are on same WiFi
- QR codes will now contain your network IP
- Mobile phones can scan and access files

## Example:
- Computer IP: `192.168.1.150`
- QR code will contain: `http://192.168.1.150:3000/f/Ab3X`
- Mobile phone can access this URL

## Troubleshooting:
- Ensure both devices on same WiFi network
- Check Windows Firewall allows Node.js
- Try accessing `http://YOUR_IP:3000` directly on phone first