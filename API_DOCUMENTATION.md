# 📚 DocEdit API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing fields or invalid email format
- 400: Email already registered

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid credentials

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: No token provided
- 401: Invalid token

---

## Document Endpoints

### 1. Create New Document
**POST** `/documents/create`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My First Document"
}
```

**Response (201 Created):**
```json
{
  "message": "Document created successfully",
  "document": {
    "_id": "507f191e810c19729de860ea",
    "name": "My First Document",
    "content": "",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: Document name not provided
- 401: Not authenticated

---

### 2. Get All User Documents
**GET** `/documents/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "documents": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Project Proposal",
      "ownerName": "John Doe",
      "lastModifiedBy": "Jane Smith",
      "updatedAt": "2024-01-15T14:20:00Z"
    },
    {
      "_id": "607f191e810c19729de860eb",
      "name": "Meeting Notes",
      "ownerName": "John Doe",
      "lastModifiedBy": "John Doe",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Errors:**
- 401: Not authenticated

---

### 3. Get Specific Document
**GET** `/documents/:documentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "document": {
    "_id": "507f191e810c19729de860ea",
    "name": "Project Proposal",
    "content": "This is the document content...",
    "ownerId": "507f1f77bcf86cd799439011",
    "ownerName": "John Doe",
    "collaborators": [
      {
        "userId": "607f1f77bcf86cd799439012",
        "userName": "Jane Smith",
        "joinedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "versions": [
      {
        "content": "First saved version...",
        "savedBy": "John Doe",
        "savedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "lastModifiedBy": "Jane Smith",
    "lastModifiedAt": "2024-01-15T14:20:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:20:00Z"
  }
}
```

**Errors:**
- 404: Document not found
- 403: Access denied (not owner or collaborator)
- 401: Not authenticated

---

### 4. Save/Auto-save Document
**PUT** `/documents/:documentId/save`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Updated document content...",
  "isManualSave": true
}
```

**Parameters:**
- `isManualSave` (boolean): If true, creates version history entry

**Response (200 OK):**
```json
{
  "message": "Document saved",
  "document": {
    "_id": "507f191e810c19729de860ea",
    "updatedAt": "2024-01-15T14:25:00Z"
  }
}
```

**Errors:**
- 404: Document not found
- 401: Not authenticated

---

### 5. Rename Document
**PUT** `/documents/:documentId/rename`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Document Name"
}
```

**Response (200 OK):**
```json
{
  "message": "Document renamed successfully",
  "document": {
    "_id": "507f191e810c19729de860ea",
    "name": "Updated Document Name"
  }
}
```

**Errors:**
- 400: Name not provided
- 404: Document not found
- 403: Only owner can rename
- 401: Not authenticated

---

### 6. Delete Document
**DELETE** `/documents/:documentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

**Errors:**
- 404: Document not found
- 403: Only owner can delete
- 401: Not authenticated

---

## Socket.IO Events

### Real-time Collaboration Events

#### Client → Server

**join-document**
```javascript
socket.emit('join-document', {
  documentId: '507f191e810c19729de860ea',
  userName: 'John Doe'
});
```

**document-update**
```javascript
socket.emit('document-update', {
  documentId: '507f191e810c19729de860ea',
  content: 'Updated content...',
  userName: 'John Doe'
});
```

**user-typing**
```javascript
socket.emit('user-typing', {
  documentId: '507f191e810c19729de860ea',
  userName: 'John Doe'
});
```

**user-stop-typing**
```javascript
socket.emit('user-stop-typing', {
  documentId: '507f191e810c19729de860ea',
  userName: 'John Doe'
});
```

**document-saved**
```javascript
socket.emit('document-saved', {
  documentId: '507f191e810c19729de860ea',
  content: 'Saved content...',
  userName: 'John Doe'
});
```

#### Server → Client

**user-joined**
```javascript
socket.on('user-joined', (data) => {
  // data = {
  //   message: "John Doe joined the document",
  //   activeUsers: ["John Doe", "Jane Smith"]
  // }
});
```

**content-changed**
```javascript
socket.on('content-changed', (data) => {
  // data = {
  //   content: "Updated content...",
  //   userName: "Jane Smith",
  //   timestamp: 2024-01-15T14:25:00Z
  // }
});
```

**user-typing-indicator**
```javascript
socket.on('user-typing-indicator', (data) => {
  // data = {
  //   userName: "Jane Smith"
  // }
});
```

**user-stop-typing-indicator**
```javascript
socket.on('user-stop-typing-indicator', (data) => {
  // data = {
  //   userName: "Jane Smith"
  // }
});
```

**document-saved-notification**
```javascript
socket.on('document-saved-notification', (data) => {
  // data = {
  //   message: "Document saved by John Doe",
  //   lastModifiedBy: "John Doe",
  //   lastModifiedAt: 2024-01-15T14:25:00Z
  // }
});
```

---

## Error Handling

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Example Usage with Fetch

### Register
```javascript
const register = async (name, email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Get Documents
```javascript
const getDocuments = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/documents/all', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
};
```

### Create Document
```javascript
const createDocument = async (name) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/documents/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  
  return await response.json();
};
```

---

## Rate Limits

Currently no rate limiting implemented. In production, implement:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user
- 10 concurrent WebSocket connections per user

---

## CORS Configuration

Frontend: `http://localhost:5173`
Backend: Configured in `server.js`

Change in production to your frontend domain.

---

## Best Practices

1. **Always include JWT token** in Authorization header for protected routes
2. **Handle errors gracefully** - Check response status codes
3. **Validate input** before sending to API
4. **Use Socket.IO events** for real-time updates, not frequent API calls
5. **Auto-save with debounce** - Wait 3+ seconds before saving
6. **Close Socket.IO connection** when leaving document

