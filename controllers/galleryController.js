// controllers/galleryController.js
import GalleryItem from '../models/Gallery.js';
import cache from '../cache.js';
import cloudinary from '../utils/cloudinary.js';
import multer from "multer"
import dotenv from "dotenv"

dotenv.config()
const GALLERY_LIST_KEY = 'gallery:all';



// Multer setup – memory storage (no disk write)
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // auto-detect image/video
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: 'gallery', // optional: organize in folder
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

// Export as array so multer middleware runs first
export const createGalleryItem = [
  // Accept multiple files under field name "media" (up to 10)
  upload.array('media', 10),

  async (req, res) => {
    try {
      const { type, caption } = req.body;

      // Handle media uploads
      let mediaUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            public_id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          });
          return url;
        });

        mediaUrls = await Promise.all(uploadPromises);
      }

      // Create gallery item
      const item = new GalleryItem({
        type,           // e.g. 'image', 'video', 'mixed' — your choice
        media: mediaUrls, // array of Cloudinary URLs
        caption,
        // user: req.user._id,   ← add this if you want to track who uploaded
      });

      await item.save();

      // Clear cache
      cache.del(GALLERY_LIST_KEY);

      res.status(201).json({
        message: 'Gallery item created successfully',
        item,
      });
    } catch (error) {
      console.error('Gallery creation error:', error);
      res.status(500).json({
        message: 'Error creating gallery item',
        error: error.message,
      });
    }
  },
];
// export const createGalleryItem = async (req, res) => {
//   try {
//     const { type, media, caption } = req.body;

//     const item = new GalleryItem({ type, media, caption });
//     await item.save();

//     cache.del(GALLERY_LIST_KEY);

//     res.status(201).json({ message: 'Gallery item created', item });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Error creating gallery item', error: error.message });
//   }
// };

export const getAllGalleryItems = async (req, res) => {
  try {
    let items = cache.get(GALLERY_LIST_KEY);

    if (items) {
      console.log('📦 Cache HIT: gallery list');
      return res.json(items);
    }

    console.log('💾 Cache MISS: fetching gallery');
    items = await GalleryItem.find().sort({ updatedAt: -1 }).lean();

    cache.set(GALLERY_LIST_KEY, items);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery items', error: error.message });
  }
};

export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `gallery:${id}`;

    let item = cache.get(cacheKey);

    if (item) {
      console.log(`📦 Cache HIT: ${cacheKey}`);
      return res.json(item);
    }

    console.log(`💾 Cache MISS: ${cacheKey}`);
    item = await GalleryItem.findById(id).lean();

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    cache.set(cacheKey, item, 3600);

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery item', error: error.message });
  }
};

// export const updateGalleryItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const item = await GalleryItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

//     if (!item) {
//       return res.status(404).json({ message: 'Gallery item not found' });
//     }

//     cache.del(`gallery:${id}`);
//     cache.del(GALLERY_LIST_KEY);

//     res.json({ message: 'Gallery item updated', item });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating gallery item', error: error.message });
//   }
// };


export const updateGalleryItem = [
  // Parse multipart/form-data — allow up to 10 new files under field "media"
  upload.array('media', 10),

  async (req, res) => {
    try {
      const { id } = req.params;

      // Optional: restrict update to owner only (recommended)
      const userId = req.user?._id;
      const item = await GalleryItem.findOne({ _id: id, user: userId });
      if (!item) {
        return res.status(404).json({ 
          message: 'Gallery item not found or you do not have permission to update it' 
        });
      }

      // ── 1. Handle text fields from req.body ─────────────────────────────
      const allowedUpdates = ['type', 'caption', "caption"]; // add any other allowed fields

      const updates = {};

      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // ── 2. Handle new media files (if uploaded) ─────────────────────────
      let newMediaUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            public_id: `gallery-${id}-${Date.now()}`,
          });
          return url;
        });

        newMediaUrls = await Promise.all(uploadPromises);
      }

      // ── 3. Decide how to handle media field ─────────────────────────────
      // Option A: REPLACE all media with new ones (recommended for most cases)
      if (newMediaUrls.length > 0) {
        updates.media = newMediaUrls;
      }

      // Option B: APPEND new media (keep old ones) — uncomment if preferred
      // else if (newMediaUrls.length > 0) {
      //   updates.media = [...(item.media || []), ...newMediaUrls];
      // }

      // Optional: if frontend sends empty media → clear all images
      if (req.body.media === '' || (Array.isArray(req.body.media) && req.body.media.length === 0)) {
        updates.media = [];
      }

      // ── 4. Perform the update ───────────────────────────────────────────
      const updatedItem = await GalleryItem.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Invalidate caches
      cache.del(`gallery:${id}`);
      cache.del(GALLERY_LIST_KEY);

      return res.status(200).json({
        message: 'Gallery item updated successfully',
        item: updatedItem,
      });
    } catch (error) {
      console.error('Update gallery item error:', error);
      return res.status(400).json({
        message: 'Error updating gallery item',
        error: error.message,
      });
    }
  },
];


export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await GalleryItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    cache.del(`gallery:${id}`);
    cache.del(GALLERY_LIST_KEY);

    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery item', error: error.message });
  }
};

























