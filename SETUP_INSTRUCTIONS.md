
# 🚀 DOCEDIT - COMPLETE SETUP GUIDE (Step by Step)

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (v16 or higher) - Check: `node -v`
- ✅ npm installed (v7 or higher) - Check: `npm -v`
- ✅ MongoDB installed or Atlas account - Check: `mongod --version` or create Atlas account

---

## 📖 COMPLETE SETUP INSTRUCTIONS

### PART 1: MongoDB Setup (Choose One Option)

#### Option A: Local MongoDB (Recommended for Development)

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. During setup, check "Install MongoD as a Service"
4. Complete installation
5. MongoDB will automatically start as a service
6. Verify: Open PowerShell and run: `mongosh`
   - You should see MongoDB shell prompt

**Mac:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect to MongoDB
mongosh
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project
4. Create a cluster (free tier available)
5. Set up authentication (create database user)
6. Get connection string:
   - Click "Connect"
   - Choose "Connect to your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
7. Update connection string in `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/docedit
   ```

---

### PART 2: Backend Setup

```bash
# Step 1: Navigate to backend directory
cd backend

# Step 2: Install all dependencies
npm install

# Expected output: 
# added XXX packages in X.XXs
```

**The backend should already have `.env` file. Verify it contains:**
```env
MONGODB_URI=mongodb://localhost:27017/docedit
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

If not, create/update it with above content.

```bash
# Step 3: Start backend server
npm run dev

# Expected output:
# ✓ MongoDB connected
# 🚀 DocEdit Server Running
# Port: 5000
# Environment: development
```

**✅ Backend is ready when you see the above messages!**

Keep this terminal open and open a NEW terminal for frontend setup.

---

### PART 3: Frontend Setup

```bash
# Step 1: Open NEW terminal/command prompt
# Step 2: Navigate to frontend directory
cd frontend

# Step 3: Install all dependencies
npm install

# Expected output:
# added XXX packages in X.XXs
```

```bash
# Step 4: Start frontend development server
npm run dev

# Expected output:
#   VITE v5.0.8  ready in XXX ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  press h + enter to show help
```

**The browser should automatically open at `http://localhost:5173`**

---

### PART 4: Verify Everything is Working

1. **Backend Running?**
   - Terminal shows: "✓ MongoDB connected"
   - Terminal shows: "🚀 DocEdit Server Running"

2. **Frontend Running?**
   - Browser opens at `http://localhost:5173`
   - You see DocEdit login page

3. **Create a Test Account:**
   - Click "Sign Up" tab
   - Enter:
     - Name: Test User
     - Email: test@example.com
     - Password: Test@123
     - Confirm Password: Test@123
   - Click "Sign Up"
   - You should be redirected to Dashboard

4. **Create a Test Document:**
   - Click "+ Create New Document"
   - Enter document name: "My First Document"
   - Click "Create Document"
   - You should see the editor

5. **Test Real-time Sync:**
   - Type some content
   - Wait 3 seconds (auto-save activates)
   - You should see "Auto-saved" message

✅ **Everything is working!**

---

## 🎯 PROJECT STRUCTURE OVERVIEW

```
CDEditor/
├── backend/                    # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js            # User data model
│   │   └── Document.js        # Document data model
│   ├── routes/
│   │   ├── auth.js            # Login/Register API
│   │   └── documents.js       # Document CRUD API
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── server.js              # Main server entry point
│   ├── .env                   # Configuration (SECRET!)
│   └── package.json
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── TextEditor.jsx        # Main document editor
    │   │   ├── TextEditorToolbar.jsx # Text formatting tools
    │   │   ├── DocumentCard.jsx      # Document preview card
    │   │   └── ProtectedRoute.jsx    # Auth protection
    │   ├── pages/
    │   │   ├── Login.jsx             # Login/Register page
    │   │   ├── Dashboard.jsx         # Document list page
    │   │   └── CreateDocument.jsx    # Create new document
    │   ├── context/
    │   │   └── AuthContext.jsx       # Auth state
    │   ├── utils/
    │   │   ├── api.js                # API calls
    │   │   └── socket.js             # Real-time connection
    │   ├── App.jsx                   # Main app with routing
    │   ├── main.jsx                  # App entry point
    │   └── index.css                 # Global styles
    └── index.html
```

---

## 🔧 COMMON COMMANDS

### Backend Commands
```bash
cd backend

# Development (with auto-reload)
npm run dev

# Production
npm start

# Install new package
npm install package-name
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Install new package
npm install package-name
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB is running:
   - Mac: brew services list (should show mongodb-community started)
   - Windows: Check Services (MongoDB should be running)
   - Cloud: Check Atlas connection string is correct

2. If local, verify connection string in .env:
   MONGODB_URI=mongodb://localhost:27017/docedit

3. If cloud, verify username/password in connection string
```

### Issue: "Port 5000 is already in use"
```
Solution:
1. Kill the process using the port:
   - Windows: netstat -ano | findstr :5000
   - Mac/Linux: lsof -i :5000
   
2. Or change PORT in backend/.env to 5001, 5002, etc.
```

### Issue: "Port 5173 is already in use"
```
Solution:
1. Change port in frontend/vite.config.js:
   server: {
     port: 5174,
   }
2. Access frontend at http://localhost:5174
```

### Issue: "WebSocket connection failed"
```
Solution:
1. Ensure backend is running on correct port
2. Check frontend/src/utils/socket.js has correct URL:
   const socket = io('http://localhost:5000');
3. Check backend CORS in server.js
```

### Issue: "Login button doesn't work"
```
Solution:
1. Check browser console (F12)
2. Check backend response (backend terminal)
3. Verify MongoDB is running
4. Try creating a new account instead
```

---

## 📚 FEATURES WALKTHROUGH

### 1. Login/Register
- Create account with name, email, password (min 6 chars)
- Login with existing credentials
- Password is hashed with bcryptjs (never stored in plain text)

### 2. Dashboard
- See all your created documents
- View document metadata (owner, last modified, etc.)
- Quick actions: Open, Delete

### 3. Create Document
- Separate page for document creation
- Enter document name
- Get taken to editor immediately

### 4. Document Editor
- **Editing:** Type and edit in real-time
- **Formatting:** Bold, Italic, Underline, Lists, Alignment
- **Collaboration:** See who's editing and typing indicators
- **Saving:** Manual save button + auto-save every 3 seconds
- **Renaming:** Click title to rename
- **Deletion:** Delete button removes document permanently
- **Status:** See save status and active users

### 5. Real-time Sync
- Changes broadcast to all connected users instantly
- See typing indicators when others type
- Auto-save prevents data loss
- Manual save creates version history

---

## 🎨 UI/UX FEATURES

- **Modern Design:** Inspired by Google Docs
- **Blue Color Scheme:** Professional and calming
- **Responsive Layout:** Works on different screen sizes
- **Loading States:** Shows spinners during loading
- **Error Messages:** Clear error notifications
- **Status Indicators:** Save status, typing indicators, active users
- **Hover Effects:** Interactive buttons and links
- **Smooth Transitions:** CSS animations for better UX

---

## 📊 DATA FLOW DIAGRAM

```
User Login/Register
        ↓
  JWT Token Generated
        ↓
  Stored in localStorage
        ↓
  Every API request includes JWT
        ↓
  Backend verifies JWT
        ↓
  Return user data
        ↓
  Redirect to Dashboard
        ↓
  Fetch user's documents
        ↓
  Display in grid
        ↓
  Click document → Connect to Socket.IO
        ↓
  Open editor
        ↓
  Real-time collaboration:
  - User types → Emit socket event
  - Other users receive update
  - Auto-save to MongoDB
```

---

## 🔐 SECURITY NOTES

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens expire after 7 days
- ✅ Protected routes check JWT before access
- ✅ Users can only edit their own documents
- ✅ CORS enabled only for localhost:5173
- ✅ No sensitive data in localStorage

⚠️ **For production:**
- Change JWT_SECRET to strong random string
- Use environment-specific configuration
- Enable HTTPS
- Implement rate limiting
- Add input sanitization

---

## 🎓 LEARNING RESOURCES

**If you want to learn more:**
- React Router: https://reactrouter.com/
- Socket.IO: https://socket.io/docs/
- Mongoose: https://mongoosejs.com/
- Express: https://expressjs.com/
- Tailwind CSS: https://tailwindcss.com/

---

## 📞 NEED HELP?

1. Check browser console: `F12` → Console tab
2. Check backend terminal for errors
3. Check MongoDB connection
4. Verify all ports are available
5. Ensure all dependencies installed: `npm install`

---

## ✅ SETUP CHECKLIST

- [ ] Node.js installed
- [ ] npm installed
- [ ] MongoDB installed/configured
- [ ] Backend dependencies installed
- [ ] Backend .env file configured
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 5173
- [ ] Can register new account
- [ ] Can create document
- [ ] Can edit document
- [ ] Save works
- [ ] Real-time sync works

---

**🎉 Congratulations! DocEdit is ready to use!**

