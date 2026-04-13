# ⚡ QUICK START - 5 MINUTES TO RUNNING APP

## Prerequisites
```
✅ Node.js v16+ installed
✅ npm v7+ installed  
✅ MongoDB running locally (or get Atlas connection string)
```

---

## Command-by-Command Guide

Open TWO terminals (one for backend, one for frontend)

### Terminal 1: Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Start server
npm run dev

# You should see:
# ✓ MongoDB connected
# 🚀 DocEdit Server Running
# Port: 5000
```

**Leave this running ↑↑↑**

---

### Terminal 2: Frontend

```bash
# Open NEW terminal

# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev

# You should see:
# ➜ Local: http://localhost:5173/
```

**Browser will auto-open** → http://localhost:5173

---

## First Time Usage

### Test Account (Already Created)
- Email: `admin@example.com`
- Password: `password123`

Or **Create New Account:**
1. Click "Sign Up"
2. Fill in Name, Email, Password
3. Click "Sign Up"
4. You're logged in!

### Create Your First Document
1. Click "+ Create New Document"
2. Enter document name
3. Click "Create Document"
4. Start typing!

### Real-time Test
1. Open document in two browser tabs
2. Type in one tab
3. See changes in other tab instantly

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| MongoDB connection error | Make sure `mongod` is running |
| Port 5000 in use | Change PORT in `backend/.env` |
| Port 5173 in use | Change port in `frontend/vite.config.js` |
| Page shows error | Check backend terminal for errors |
| Changes don't sync | Verify Socket.IO connection in browser DevTools |

---

## File Locations (If You Need to Change Settings)

```
Backend Configuration:
├─ backend/.env (Database, JWT, Port)
└─ backend/server.js (Socket.IO port, CORS)

Frontend Configuration:
├─ frontend/src/utils/socket.js (Backend URL)
├─ frontend/src/utils/api.js (API base URL)
└─ frontend/vite.config file (Port 5173)
```

---

## Project Structure (Overview)

```
CDEditor/
├── backend/  ← Node + Express + MongoDB
├── frontend/ ← React + Vite + Tailwind
├── README.md (Full documentation)
└── SETUP_INSTRUCTIONS.md (Detailed setup)
```

---

## Features Available Now

✅ User login/registration
✅ Create documents
✅ Edit documents in real-time
✅ Multiple users can edit same doc
✅ Auto-save (every 3 seconds)
✅ Manual save with versioning
✅ Rename documents
✅ Delete documents
✅ See who's typing
✅ See active users

---

## Next: Read Full Documentation

For detailed information about:
- Complete setup for different OS
- All API endpoints
- Deployment instructions
- Production security

👉 Check `README.md` in root directory

---

## Still Need Help?

1. **Backend won't start?**
   - Check MongoDB: `mongosh` should connect
   - Check terminal: Are there any error messages?

2. **Frontend won't connect?**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Realtime not working?**
   - Verify backend running on port 5000
   - Verify socket.js URL is correct
   - Check browser console

---

🎉 **You're all set! Start collaborating!**

