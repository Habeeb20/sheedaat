// controllers/serviceController.js
import Service from '../models/Services.js';
import cache from '../cache.js';
import multer from 'multer';

import cloudinary from '../utils/cloudinary.js';

const SERVICES_LIST_KEY = 'services:all';

// export const createService = async (req, res) => {
//         const user = req.user._id
//   try {
//     const { name, description, media, timeRange } = req.body;

//     const service = new Service({user, name, description, media, timeRange });
//     await service.save();

//     cache.del(SERVICES_LIST_KEY);

//     res.status(201).json({ message: 'Service created', service });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating service', error: error.message });
//   }
// };




// Multer setup – store files in memory (no disk write)
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // auto-detect image/video
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: 'services',    // optional: organize in Cloudinary
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

// Export as array → multer middleware runs first
export const createService = [
  // Accept multiple files under field name "media" (up to 10)
  upload.array('media', 10),

  async (req, res) => {
    try {
      const user = req.user._id;
      const { name, description, timeRange } = req.body;

      // Handle media uploads
      let mediaUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            public_id: `service-${user}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          });
          return url;
        });

        mediaUrls = await Promise.all(uploadPromises);
      }

      // Create service document
      const service = new Service({
        user,
        name,
        description,
        media: mediaUrls,      // ← array of Cloudinary secure URLs
        timeRange,
      });

      await service.save();

      // Invalidate cache
      cache.del(SERVICES_LIST_KEY);

      res.status(201).json({
        message: 'Service created successfully',
        service,
      });
    } catch (error) {
      console.error('Service creation error:', error);
      res.status(400).json({
        message: 'Error creating service',
        error: error.message,
      });
    }
  },
];



export const getAllServices = async (req, res) => {
  try {
    let services = cache.get(SERVICES_LIST_KEY);

    if (services) {
      console.log('📦 Cache HIT: services list');
      return res.json(services);
    }

    console.log('💾 Cache MISS: fetching services');
    services = await Service.find().sort({ updatedAt: -1 }).lean();

    cache.set(SERVICES_LIST_KEY, services);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `service:${id}`;

    let service = cache.get(cacheKey);

    if (service) {
      console.log(`📦 Cache HIT: ${cacheKey}`);
      return res.json(service);
    }

    console.log(`💾 Cache MISS: ${cacheKey}`);
    service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    cache.set(cacheKey, service, 3600);

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// export const updateService = async (req, res) => {
//         const user = req.user._id
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const service = await Service.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     cache.del(`service:${id}`);
//     cache.del(SERVICES_LIST_KEY);

//     res.json({ message: 'Service updated', service });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating service', error: error.message });
//   }
// };




export const updateService = [
  // Parse multipart/form-data — allow up to 10 new files under field "media"
  upload.array('media', 10),

  async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      // Find the service and ensure it belongs to the authenticated user
      const service = await Service.findOne({ _id: id, user: userId });
      if (!service) {
        return res.status(404).json({ message: 'Service not found or not owned by you' });
      }

      // ── 1. Handle text fields from req.body ─────────────────────────────
      const allowedUpdates = [
        'name',
        'description',
        'timeRange',
        // add any other fields you allow updating (e.g. price, category, etc.)
      ];

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
            public_id: `service-${id}-${Date.now()}`,
          });
          return url;
        });

        newMediaUrls = await Promise.all(uploadPromises);
      }

      // ── 3. Decide how to handle media field ─────────────────────────────
      // Option A: REPLACE all media with new ones (recommended for simplicity)
      if (newMediaUrls.length > 0) {
        updates.media = newMediaUrls;
      }

      // Option B: APPEND new images (keep old ones) — uncomment if preferred
      // else if (newMediaUrls.length > 0) {
      //   updates.media = [...(service.media || []), ...newMediaUrls];
      // }

      // Optional: if frontend sends empty media array → clear images
      if (req.body.media === '' || (Array.isArray(req.body.media) && req.body.media.length === 0)) {
        updates.media = [];
      }

      // ── 4. Perform the update ───────────────────────────────────────────
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Invalidate caches
      cache.del(`service:${id}`);
      cache.del(SERVICES_LIST_KEY);

      return res.status(200).json({
        message: 'Service updated successfully',
        service: updatedService,
      });
    } catch (error) {
      console.error('Update service error:', error);
      return res.status(400).json({
        message: 'Error updating service',
        error: error.message,
      });
    }
  },
];
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    cache.del(`service:${id}`);
    cache.del(SERVICES_LIST_KEY);

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

















