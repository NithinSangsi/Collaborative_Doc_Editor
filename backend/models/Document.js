const mongoose = require('mongoose');

// Document Schema - Stores document content and metadata
const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a document name'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    collaborators: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    versions: [
      {
        content: String,
        savedBy: String,
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastModifiedBy: {
      type: String,
      default: '',
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
