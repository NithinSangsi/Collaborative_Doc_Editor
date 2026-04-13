# DocEdit - Collaborative Document Editor

A full-stack real-time collaborative document editor built with the MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Features

- ✅ **Real-time Collaboration** - Multiple users can edit the same document simultaneously
- ✅ **User Authentication** - Secure login/registration system with JWT tokens
- ✅ **Document Management** - Create, edit, rename, and delete documents
- ✅ **Live Syncing** - WebSocket-based real-time updates via Socket.IO
- ✅ **Auto-save** - Automatic saving with debounce to prevent server overload
- ✅ **User Presence** - See who is currently editing and typing indicators
- ✅ **Document Versioning** - Save multiple versions of documents
- ✅ **Professional UI** - Modern, clean design inspired by Google Docs
- ✅ **Responsive Design** - Works on desktop and tablet devices
- ✅ **Rich Text Editing** - Basic formatting (bold, italic, underline, lists)

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time connection
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (running locally or Atlas connection)

## 🚀 Installation & Setup

### Step 1: Install MongoDB

**Option A: Local MongoDB**
```bash
# Download from https://www.mongodb.com/try/download/community
# Follow installation instructions for your OS
```

**Option B: MongoDB Atlas (Cloud)**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update MONGODB_URI in backend/.env
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with following variables (already created):
# MONGODB_URI=mongodb://localhost:27017/docedit
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# PORT=5000
# NODE_ENV=development

# Start the backend server
npm run dev
# OR for production
npm start
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will automatically open at `http://localhost:5173`

## 📖 How to Use

### 1. Register/Login
- Open the application at `http://localhost:5173`
- Create a new account or login with existing credentials
- Fill in name, email, and password (min 6 characters)

### 2. Dashboard
- View all your created documents
- Click "Create New Document" to create a new document
- Click on any document to open and edit

### 3. Document Creation
- Enter a document name
- Click "Create Document"
- You'll be taken directly to the editor

### 4. Document Editor
- Type and edit your document
- Use toolbar for text formatting (bold, italic, underline, lists)
- See real-time updates from other users
- Notice the "typing" indicator when others are typing
- Click "Save" to manually save document version
- Auto-save occurs every 3 seconds during inactivity

### 5. Document Management
- Rename document by clicking on the title
- Delete document using "Delete" button
- View last modified info and user
- See who else is editing (active users list)

## 🔧 Configuration

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/docedit

# Auth
JWT_SECRET=your_super_secret_jwt_key_change_this

# Server
PORT=5000
NODE_ENV=development
```

### Frontend (socket connection)

Edit `src/utils/socket.js` to change server URL:
```javascript
const socket = io('http://localhost:5000');
```

## 📁 Project Structure

```
DocEdit/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Document.js       # Document schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── documents.js      # Document CRUD routes
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── server.js             # Main server file
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TextEditor.jsx        # Main editor
    │   │   ├── TextEditorToolbar.jsx # Formatting toolbar
    │   │   ├── DocumentCard.jsx      # Document card component
    │   │   └── ProtectedRoute.jsx    # Auth guard
    │   ├── pages/
    │   │   ├── Login.jsx             # Login/Register page
    │   │   ├── Dashboard.jsx         # Documents list
    │   │   └── CreateDocument.jsx    # Document creation
    │   ├── context/
    │   │   └── AuthContext.jsx       # Auth state management
    │   ├── utils/
    │   │   ├── api.js                # Axios instance
    │   │   └── socket.js             # Socket.IO client
    │   ├── App.jsx                   # Main app with routing
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .gitignore
```

## 🔐 Security Features

- ✅ **Password Hashing** - bcryptjs with salt
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Protected Routes** - Client-side route protection
- ✅ **Authorization Checks** - Server validates user access to documents
- ✅ **CORS Enabled** - Secure cross-origin requests
- ✅ **Input Validation** - Email and password validation

## ⚡ Performance Optimizations

- ✅ **Debounced Updates** - 3-second auto-save to reduce database writes
- ✅ **Lazy Loading** - Load documents on demand
- ✅ **WebSocket Optimization** - Efficient real-time updates
- ✅ **Vite Build** - Fast development and production builds

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running
- Mac: brew services start mongodb-community
- Windows: Use MongoDB Compass or Service
- Cloud: Check Atlas connection string in .env
```

### WebSocket Connection Error
```
Solution: Check socket URL in frontend/src/utils/socket.js
Ensure backend is running on port 5000
```

### Port Already in Use
```bash
# Backend (change PORT in .env)
# Frontend (change port in vite.config.js)
```

### CORS Error
```
Solution: Check backend server.js CORS configuration
Ensure frontend URL matches origin in server.js
```

## 🚀 Deployment

### Backend (Heroku)
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Frontend (Vercel)
```bash
# Update API URL in frontend/.env.production
VITE_API_URL=https://your-backend.herokuapp.com

# Deploy
npm run build
# Use Vercel CLI: vercel
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Documents
- `POST /api/documents/create` - Create document (protected)
- `GET /api/documents/all` - Get user's documents (protected)
- `GET /api/documents/:documentId` - Get specific document (protected)
- `PUT /api/documents/:documentId/save` - Save document (protected)
- `PUT /api/documents/:documentId/rename` - Rename document (protected)
- `DELETE /api/documents/:documentId` - Delete document (protected)

## 🎯 Future Enhancements

- [ ] Rich text editor with Quill.js
- [ ] Document sharing and permissions
- [ ] Export to PDF/Word
- [ ] Comments and suggestions mode
- [ ] Dark theme
- [ ] Mobile app
- [ ] Document history/revision tracking
- [ ] Real-time cursor position indicator

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes

## 👤 Author

Created with ❤️ for collaborative document editing

---

this README is being generated from the LLM so if interested to know inmore detail go through it or just skip it off .
