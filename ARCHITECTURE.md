# 🏗️ ARCHITECTURE & DATA FLOW DOCUMENTATION

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  React Application (localhost:5173)                            │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │ Pages: Login, Dashboard, CreateDocument, TextEditor      │  │ │
│  │  │ Components: DocumentCard, TextEditorToolbar, Protector   │  │ │
│  │  │ Context: AuthContext (User State)                        │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  │                                                                  │ │
│  │  Utilities:                                                     │ │
│  │  ├─ api.js (Axios with JWT + API calls)                       │ │
│  │  └─ socket.js (Socket.IO client)                              │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                             ↕️ (HTTP + WebSocket)
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (localhost:5000)                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Express.js Server + Socket.IO                                  │ │
│  │                                                                 │ │
│  │ REST API Endpoints:                                            │ │
│  │ ├─ POST   /api/auth/register                                   │ │
│  │ ├─ POST   /api/auth/login                                      │ │
│  │ ├─ GET    /api/auth/me                                         │ │
│  │ ├─ POST   /api/documents/create                                │ │
│  │ ├─ GET    /api/documents/all                                   │ │
│  │ ├─ GET    /api/documents/:id                                   │ │
│  │ ├─ PUT    /api/documents/:id/save                              │ │
│  │ ├─ PUT    /api/documents/:id/rename                            │ │
│  │ └─ DELETE /api/documents/:id                                   │ │
│  │                                                                 │ │
│  │ Socket.IO Events:                                              │ │
│  │ ├─ join-document                                               │ │
│  │ ├─ document-update                                             │ │
│  │ ├─ user-typing                                                 │ │
│  │ ├─ user-stop-typing                                            │ │
│  │ └─ document-saved                                              │ │
│  │                                                                 │ │
│  │ Middleware:                                                    │ │
│  │ └─ JWT Authentication (authMiddleware)                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                             ↕️ (Database Queries)                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Mongoose Models                                                │ │
│  │ ├─ User (name, email, password_hash)                           │ │
│  │ └─ Document (content, collaborators, versions)                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                             ↕️ (TCP/IP)
┌─────────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Database: docedit                                              │ │
│  │                                                                 │ │
│  │ Collections:                                                   │ │
│  │ ├─ users (store user credentials)                              │ │
│  │ └─ documents (store document content & metadata)               │ │
│  │                                                                 │ │
│  │ Indexes:                                                       │ │
│  │ ├─ users._id                                                   │ │
│  │ ├─ users.email (unique)                                        │ │
│  │ ├─ documents._id                                               │ │
│  │ └─ documents.ownerId                                           │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ USER BROWSER                                                    │
└─────────────────────────────────────────────────────────────────┘
  │
  │ 1. User fills registration form
  │
  ├──→ onClick(Register) →──────────────────┐
  │                                         ↓
  │    ┌──────────────────────────────┐
  │    │ Login.jsx component          │
  │    │ Calls: register()            │
  │    └──────────────────────────────┘
  │
  │ 2. POST request with credentials
  │
  ├──→ POST /api/auth/register ──────────────────┐
  {                                              ↓
    "name": "John Doe",        ┌──────────────────────────────┐
    "email": "john@test.com",  │ Backend: routes/auth.js      │
    "password": "pass123"      │                              │
  }                            │ 1. Validate input            │
                               │ 2. Check if email exists     │
                               │ 3. Hash password             │
                               │ 4. Save to MongoDB           │
                               │ 5. Generate JWT token        │
                               └──────────────────────────────┘
  │                                        │
  │ 3. Response with JWT token              ↓
  │← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ←─────────┤
  {                                         │
    "message": "User registered",          │
    "token": "eyJhbGci...",                │
    "user": {...}                          │
  }                                         │
  ├──→ Store in localStorage                │
  │    localStorage.setItem('token', token) │
  │                                         │
  │ 4. Redirect to Dashboard
  │
  ├──→ navigate('/dashboard')
  │
  └─ GET /api/documents/all (with JWT token in header)
     Returns: User's documents
```

---

## Real-time Collaboration Flow

```
┌──────────────────────┐      ┌──────────────────────┐
│   User A Browser     │      │   User B Browser     │
│  (localhost:5173)    │      │  (localhost:5173)    │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
           │ 1. Opens document          │ 1. Opens document
           │    (Same ID)               │    (Same ID)
           │                             │
           │ socket.emit('join-         │ socket.emit('join-
           │ document',                 │ document',
           │ {docId, userName})         │ {docId, userName})
           │      │                     │      │
           └──────┼─────────────────────┼──────┘
                  ↓
        ┌──────────────────────────┐
        │  Backend Socket.IO       │
        │                          │
        │ Events:                  │
        │ - join-document          │
        │ - document-update        │
        │ - user-typing            │
        │ - user-stop-typing       │
        │ - document-saved         │
        └──────────────────────────┘
                  ↑
     ┌────────────┴────────────┐
     │                         │
User A types:         User B sees update:
"Hello"            socket.on('content-
                   changed', ...)
emit('document-    → Sets content
update', {        → UI rerenders
content: "Hello", → Shows "User A typing"
userName: "A"
})
     │                         │
     └────────────┬────────────┘
                  ↓
        ┌──────────────────────────┐
        │  MongoDB Database        │
        │                          │
        │ Auto-save every 3 secs:  │
        │ PUT /documents/:id/save  │
        │ {content, isManualSave}  │
        └──────────────────────────┘
```

---

## Document Creation Flow

```
┌─────────────────────────────────────┐
│ Dashboard Page                      │
│ (User clicks "Create New Document")│
└──────────────────┬──────────────────┘
                   │
                   ↓
          ┌─────────────────┐
          │ CreateDocument  │
          │ Page loads      │
          └────────┬────────┘
                   │
        User enters name
        "My Project"
                   │
                   ↓
        ┌──────────────────────────┐
        │ Clicks "Create Document" │
        │ handleCreateDocument()   │
        └────────┬─────────────────┘
                 │
                 ↓
    ┌────────────────────────────┐
    │ POST /api/documents/create │
    │ {name: "My Project"}       │
    │ (with JWT token)           │
    └────────┬───────────────────┘
             │
             ↓
    ┌─────────────────────────┐
    │ Backend: routes/docs.js │
    │ - Validate input        │
    │ - Create document       │
    │ - Save to MongoDB       │
    │ - Return doc ID         │
    └────────┬────────────────┘
             │
             ↓
    ┌──────────────────────────┐
    │ Response:                │
    │ {_id: "507f191...",      │
    │  name: "My Project",     │
    │  content: ""}            │
    └────────┬─────────────────┘
             │
             ↓
    ┌──────────────────────────┐
    │ Frontend receives _id    │
    │ navigate('/editor/:_id') │
    └────────┬─────────────────┘
             │
             ↓
    ┌──────────────────────────┐
    │ TextEditor opens         │
    │ - Connects Socket.IO     │
    │ - Loads document         │
    │ - Ready to edit          │
    └──────────────────────────┘
```

---

## Document Editing & Saving Flow

```
User types in editor:
        │
        ↓
    ┌──────────────────────┐
    │ TextEditor.jsx       │
    │ handleContentChange()│
    └────────┬─────────────┘
             │
    ┌────────┴─────────────┐
    │                      │
    ↓                      ↓
1. Update           2. Broadcast
   state with       to other users
   setContent()     socket.emit(
                    'document-
                    update', {...})
    │
    ↓
3. Debounce timer
   (3 seconds)
   │
   ↓
4. Auto-save to database
   PUT /api/documents/:id/save
   {content: "...", isManualSave: false}
   │
   └──→ Saves to MongoDB
   │
   └──→ setSaveStatus("Auto-saved")
   │
   └──→ Clear after 2 seconds
   
User clicks "Save" button:
   │
   ↓
Same as above BUT:
   │
   ├─ PUT /api/documents/:id/save
   │  {content: "...", isManualSave: true}
   │
   ├─ Creates new version in MongoDB
   │  (versions array)
   │
   │- Emits 'document-saved' event
   │  to all users
   │
   └─ Shows "Saved successfully"
```

---

## JWT Authentication Flow

```
Step 1: User Registers/Logins
    ↓
    POST /api/auth/register or /api/auth/login
    ↓
Step 2: Backend verifies credentials
    ├─ Check email exists (register: no, login: yes)
    ├─ Hash password with bcryptjs
    ├─ Compare with stored hash
    ↓
Step 3: Generate JWT token
    │
    ├─ Token contains: userId, email, name, expiration
    ├─ Signed with JWT_SECRET
    ├─ Expires in 7 days
    │
    └─ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2V...
    ↓
Step 4: Send token to frontend
    │
    └─ Frontend stores in localStorage
    ↓
Step 5: Using token in requests
    │
    ├─ Axios interceptor adds to header:
    │  Authorization: Bearer eyJhbGciOi...
    │
    └─ API util file (api.js):
       api.interceptors.request.use((config) => {
         const token = localStorage.getItem('token');
         if (token) {
           config.headers.Authorization = `Bearer ${token}`;
         }
         return config;
       });
    ↓
Step 6: Backend verifies token
    │
    ├─ Extract token from header
    ├─ Verify signature with JWT_SECRET
    ├─ Check expiration
    ├─ Extract user info (userId, email, name)
    │
    └─ If valid: Attach to req.user, continue
       If invalid: Return 401 Unauthorized
    ↓
Step 7: Process request
    │
    ├─ Use req.user.userId for database queries
    ├─ Verify user owns the resource
    ├─ Return response
    │
    └─ Frontend receives data
```

---

## Socket.IO Connection Lifecycle

```
User opens document:
    │
    ├─ Browser creates Socket.IO connection
    │  socket.connect()
    │
    ├─ TCP connection to ws://localhost:5000
    │
    ├─ Three-way handshake established
    │
    ├─ connection event triggered
    │  console.log('Connected to server')
    │
    └─ User joins document room
       socket.emit('join-document', {
         documentId,
         userName
       })
                   │
                   ↓
       Backend receives event:
       1. socket.join(documentId)
       2. Add user to activeUsers[documentId]
       3. Broadcast to room:
          io.to(documentId).emit('user-joined', {...})
                   │
                   ↓
       Frontend receives:
       socket.on('user-joined', (data) => {
         setActiveUsers(data.activeUsers)
         setSaveStatus(data.message)
       })

During editing:
    │
    ├─ socket.emit('document-update', {...})
    │  └─ Backend: socket.to(documentId)
    │               .emit('content-changed', {...})
    │  └─ All users get update
    │
    ├─ socket.emit('user-typing', {...})
    │  └─ Backend: socket.to(documentId)
    │               .emit('user-typing-indicator')
    │
    └─ socket.emit('user-stop-typing', {...})

User leaves/closes tab:
    │
    ├─ disconnect event triggered
    │  socket.on('disconnect')
    │
    ├─ User removed from activeUsers
    │
    └─ WebSocket connection closed
```

---

## Error Handling Flow

```
Frontend Request:
    │
    ├─ async try-catch
    │
    └─ try {
         const response = await api.post(...)
         if (success) {
           // Update state
           // Show success message
         }
       } catch (error) {
         setError(error.response?.data?.message)
         // Show error to user
       }

Backend Error Handling:
    │
    ├─ route.post('/create', authMiddleware, async (req, res) => {
    │   try {
    │     // Validate input
    │     if (!name) {
    │       return res.status(400).json({
    │         message: 'Please provide name'
    │       })
    │     }
    │
    │     // Try operation
    │     const newDoc = await Document.create({...})
    │
    │     // Send success
    │     res.status(201).json({
    │       message: 'Success',
    │       document: newDoc
    │     })
    │   } catch (error) {
    │     res.status(500).json({
    │       message: 'Error creating document',
    │       error: error.message
    │     })
    │   }
    │ })
    │
    └─ Front end displays error to user
```

---

## Data Flow Summary

```
                    FRONTEND
                   (React)
                      │
         ┌────────────┼────────────┐
         ↓            ↓            ↓
    Pages       Components     Context
    │           │              │
    │           │              └─ AuthContext
    │           │                 (User state)
    │           │
    │           ├─ Login
    │           ├─ Dashboard
    │           ├─ CreateDocument
    │           ├─ TextEditor
    │           └─ DocumentCard
    │
    ├─ Users Data Flow:
    │   └─ Login/Register → JWT Token → localStorage
    │
    ├─ Documents Data Flow:
    │   ├─ Fetch all docs → Redux/Context
    │   ├─ Create doc → API POST
    │   ├─ Edit doc → Socket.IO broadcast
    │   ├─ Save doc → API PUT
    │   └─ Delete doc → API DELETE
    │
    └─ Real-time Data Flow:
        ├─ Content changes → Socket.IO emit
        ├─ Other users see → Socket.IO on
        ├─ Auto-save → Debounced API PUT
        └─ Manual save → API PUT + emit 'saved'
                        │
                        ↓
                    BACKEND
                  (Express)
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
    REST API      Socket.IO      Middleware
        │               │              │
        │               │              └─ JWT Auth
        │               │
        ├─ Auth routes  ├─ join-document
        ├─ Doc routes   ├─ document-update
        │               ├─ user-typing
        │               ├─ user-stop-typing
        │               └─ document-saved
        │
        └─ All routes interact with models
                        │
                        ↓
                    MONGOOSE
                  (ODM layer)
                        │
            ┌───────────┴───────────┐
            ↓                       ↓
        User Model          Document Model
            │                       │
            └───────┬───────────────┘
                    ↓
                MONGODB
              (Database)
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
    users collection    documents collection
```

---

## Performance Optimization Flow

```
User types fast:
    │
    ├─ 50 character changes in 3 seconds
    │
    ├─ Real-time updates (instant):
    │  └─ socket.emit('document-update') ← 50 times
    │  └─ All users see changes instantly
    │
    └─ Debounced auto-save (optimized):
       ├─ First keystroke → start 3-second timer
       ├─ More keystrokes → reset timer
       ├─ 3 seconds of inactivity → save to DB
       └─ Result: Only 1 database write instead of 50!

Socket.IO Optimization:
    │
    ├─ Rooms system:
    │  └─ Only users in that document get updates
    │
    ├─ Broadcast wisely:
    │  ├─ socket.emit() → Only to one user
    │  ├─ socket.broadcast.emit() → Everyone except sender
    │  └─ io.to(room).emit() → Everyone in room
    │
    └─ Active users tracking:
       └─ Update only when join/disconnect (not on every keystroke)

Frontend Optimization:
    │
    ├─ Context API for state (no prop drilling)
    │
    ├─ Axios interceptors (no manual token handling)
    │
    └─ Lazy loading (load docs only when needed)
```

---

This architecture ensures:
- ✅ Real-time collaboration
- ✅ Data persistence
- ✅ User authentication
- ✅ Scalability
- ✅ Performance
- ✅ Security

