const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middleware/auth');

// Create new document
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide document name' });
    }

    // Create new document
    const document = new Document({
      name,
      ownerId: req.user.userId,
      ownerName: req.user.name,
      content: '',
      lastModifiedBy: req.user.name,
    });

    await document.save();

    res.status(201).json({
      message: 'Document created successfully',
      document: {
        _id: document._id,
        name: document.name,
        content: document.content,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating document', error: error.message });
  }
});

// Get all documents for user
router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Get documents where user is owner or collaborator
    const documents = await Document.find({
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId },
      ],
    })
      .sort({ updatedAt: -1 })
      .select('_id name ownerName lastModifiedBy updatedAt');

    res.status(200).json({
      documents,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching documents', error: error.message });
  }
});

// Get document by ID
router.get('/:documentId', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is owner or collaborator
    const isOwner = document.ownerId.toString() === req.user.userId;
    const isCollaborator = document.collaborators.some(
      (c) => c.userId.toString() === req.user.userId
    );

    if (!isOwner && !isCollaborator) {
      return res
        .status(403)
        .json({ message: 'You do not have access to this document' });
    }

    res.status(200).json({
      document,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching document', error: error.message });
  }
});

// Update document content (Auto-save)
router.put('/:documentId/save', authMiddleware, async (req, res) => {
  try {
    const { content, isManualSave } = req.body;
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update content
    document.content = content;
    document.lastModifiedBy = req.user.name;
    document.lastModifiedAt = new Date();

    // If manual save, add to versions
    if (isManualSave) {
      document.versions.push({
        content: content,
        savedBy: req.user.name,
        savedAt: new Date(),
      });
    }

    await document.save();

    res.status(200).json({
      message: isManualSave ? 'Document saved' : 'Document auto-saved',
      document: {
        _id: document._id,
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error saving document', error: error.message });
  }
});

// Delete document
router.delete('/:documentId', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is owner
    if (document.ownerId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: 'Only document owner can delete' });
    }

    await Document.findByIdAndDelete(req.params.documentId);

    res.status(200).json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting document', error: error.message });
  }
});

// Rename document
router.put('/:documentId/rename', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide new name' });
    }

    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is owner
    if (document.ownerId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: 'Only document owner can rename' });
    }

    document.name = name;
    await document.save();

    res.status(200).json({
      message: 'Document renamed successfully',
      document: {
        _id: document._id,
        name: document.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error renaming document', error: error.message });
  }
});

module.exports = router;
