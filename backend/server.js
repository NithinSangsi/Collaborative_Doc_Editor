require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => console.log('✗ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Socket.IO - Real-time collaboration
const Document = require('./models/Document');

// Store active users in each document room
const activeUsers = {};

io.on('connection', (socket) => {
  console.log('🔌 New user connected:', socket.id);

  // When user joins a document
  socket.on('join-document', async (data) => {
    const { documentId, userName } = data;
    socket.join(documentId);

    // Initialize active users for this document if not exists
    if (!activeUsers[documentId]) {
      activeUsers[documentId] = [];
    }

    // Add user to active users
    if (!activeUsers[documentId].includes(userName)) {
      activeUsers[documentId].push(userName);
    }

    // Notify others that user joined
    io.to(documentId).emit('user-joined', {
      message: `${userName} joined the document`,
      activeUsers: activeUsers[documentId],
    });

    console.log(`👤 ${userName} joined document ${documentId}`);
  });

  // When user types (real-time update)
  socket.on('document-update', (data) => {
    const { documentId, content, userName } = data;

    // Broadcast to all users in the document room except sender
    socket.to(documentId).emit('content-changed', {
      content,
      userName,
      timestamp: new Date(),
    });
  });

  // User is typing indicator
  socket.on('user-typing', (data) => {
    const { documentId, userName } = data;

    socket.to(documentId).emit('user-typing-indicator', {
      userName,
    });
  });

  // Stop typing
  socket.on('user-stop-typing', (data) => {
    const { documentId, userName } = data;

    socket.to(documentId).emit('user-stop-typing-indicator', {
      userName,
    });
  });

  // When document is saved
  socket.on('document-saved', async (data) => {
    const { documentId, content, userName } = data;

    try {
      // Save to database
      const document = await Document.findByIdAndUpdate(
        documentId,
        {
          content,
          lastModifiedBy: userName,
          lastModifiedAt: new Date(),
        },
        { new: true }
      );

      // Notify all users
      io.to(documentId).emit('document-saved-notification', {
        message: `Document saved by ${userName}`,
        lastModifiedBy: userName,
        lastModifiedAt: document.lastModifiedAt,
      });

      console.log(`💾 Document ${documentId} saved by ${userName}`);
    } catch (error) {
      console.log('Error saving document:', error);
    }
  });

  // When user disconnects
  socket.on('disconnect', (data) => {
    // Remove user from active users
    for (const documentId in activeUsers) {
      activeUsers[documentId] = activeUsers[documentId].filter(
        (user) => user !== data?.userName
      );
    }

    console.log('❌ User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'DocEdit API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║     🚀 DocEdit Server Running        ║
║     Port: ${PORT}
║     Environment: ${process.env.NODE_ENV}
╚══════════════════════════════════════╝
  `);
});
