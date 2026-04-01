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

// Helper remains the same (good as is)
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: 'services',
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Create Service - Supports multiple media files
export const createService = [
  upload.array('media', 10),   // Accepts up to 10 files

  async (req, res) => {
    try {
      const user = req.user._id;
      const { name, description, timeRange } = req.body;

      if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
      }

      // Upload multiple files to Cloudinary
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

      const service = new Service({
        user,
        name,
        description,
        media: mediaUrls,        // Array of Cloudinary URLs
        timeRange,
      });

      await service.save();

      // Invalidate cache
      if (cache && SERVICES_LIST_KEY) cache.del(SERVICES_LIST_KEY);

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service,
      });
    } catch (error) {
      console.error('Service creation error:', error);
      res.status(500).json({
        success: false,
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


// Update Service - Supports multiple media files
export const updateService = [
  upload.array('media', 10),

  async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      // Check ownership
      const service = await Service.findOne({ _id: id, user: userId });
      if (!service) {
        return res.status(404).json({ message: 'Service not found or not owned by you' });
      }

      const updates = {};

      // Update text fields
      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.timeRange !== undefined) updates.timeRange = req.body.timeRange;

      // ── Handle Media Files ─────────────────────────────────────
      let newMediaUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            public_id: `service-${id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          });
          return url;
        });

        newMediaUrls = await Promise.all(uploadPromises);
      }

      // Decide media behavior:
      // Option 1: Replace all media with newly uploaded ones (Recommended for most UIs)
      if (newMediaUrls.length > 0) {
        updates.media = newMediaUrls;
      }

      // Option 2: Append new media to existing ones (uncomment if you prefer this)
      // if (newMediaUrls.length > 0) {
      //   updates.media = [...(service.media || []), ...newMediaUrls];
      // }

      // Optional: Allow clearing all media from frontend
      if (req.body.clearMedia === 'true' || req.body.media === '') {
        updates.media = [];
      }

      // Perform update
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Invalidate caches
      if (cache) {
        cache.del(`service:${id}`);
        cache.del(SERVICES_LIST_KEY);
      }

      res.status(200).json({
        success: true,
        message: 'Service updated successfully',
        service: updatedService,
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        success: false,
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

















