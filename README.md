# DropBeam - File Sharing Platform

A secure file sharing platform with QR codes, PIN protection, and real-time analytics.

## 🚀 Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd dropbeam_project
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

### 3. Firebase Configuration
You have two options:

#### Option A: Use Demo Mode (No Firebase needed)
```env
REACT_APP_USE_DEMO_MODE=true
```

#### Option B: Use Your Own Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Add a web app to your project
4. Copy the config values to `.env`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Project
```bash
npm start
```

## 🔧 Features
- ✅ File upload with drag & drop
- ✅ QR code generation for mobile sharing
- ✅ PIN protection for secure files
- ✅ Real-time analytics dashboard
- ✅ Cross-browser file sharing
- ✅ Support for PDFs and images up to 50MB

## 🛡️ Security
- Environment variables for sensitive data
- PIN protection for files
- Secure Firebase rules
- No hardcoded secrets

## 📱 Usage
1. Upload files via drag & drop or file picker
2. Set optional PIN protection
3. Generate QR codes for mobile sharing
4. Share via short links
5. Track analytics and downloads

## 🔗 Demo
Visit the live demo: [Your Demo URL]

---
Created by Shashikant - College Project