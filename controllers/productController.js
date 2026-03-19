// controllers/productController.js
import Product from '../models/Product.js';
import cache from '../cache.js';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import dotenv from "dotenv"

dotenv.config()

// Cache keys
const PRODUCTS_LIST_KEY = 'products:all';

const upload = multer({ storage: multer.memoryStorage() });


const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
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


// export const createProduct = async (req, res) => {
//     const user = req.user._id
//   // Assume admin auth middleware already checked
//   try {
//     const { name, price, media } = req.body;

//     const product = new Product({user, name, price, media });
//     await product.save();

//     // Invalidate cache
//     cache.del(PRODUCTS_LIST_KEY);

//     res.status(201).json({ message: 'Product created', product });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: 'Error creating product', error: error.message });
//   }
// };


export const createProduct = [
  // Multer middleware to parse form-data (single or multiple images)
  upload.array('media', 10), // allow up to 10 files, field name must be 'media'

  async (req, res) => {
    try {
      const user = req.user._id;
      const { name, price } = req.body;

      // Handle image uploads
      let mediaUrls = [];

      if (req.files && req.files.length > 0) {
        // Upload each file to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            folder: 'products', // optional: organize in Cloudinary folder
            public_id: `${user}-${Date.now()}`, // unique name
          });
          return url;
        });

        mediaUrls = await Promise.all(uploadPromises);
      }

      // Create product in database
      const product = new Product({
        user,
        name,
        price,
        media: mediaUrls, // array of Cloudinary secure URLs
      });

      await product.save();

      // Invalidate cache
      cache.del(PRODUCTS_LIST_KEY);

      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({
        message: 'Error creating product',
        error: error.message,
      });
    }
  },
];


export const getAllProducts = async (req, res) => {
  try {
    let products = cache.get(PRODUCTS_LIST_KEY);

    if (products) {
      console.log('📦 Cache HIT: products list');
      return res.json(products);
    }

    console.log('💾 Cache MISS: fetching products');
    products = await Product.find().sort({ updatedAt: -1 }).lean();

    cache.set(PRODUCTS_LIST_KEY, products);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    let product = cache.get(cacheKey);

    if (product) {
      console.log(`📦 Cache HIT: ${cacheKey}`);
      return res.json(product);
    }

    console.log(`💾 Cache MISS: ${cacheKey}`);
    product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    cache.set(cacheKey, product, 3600); // 1 hour TTL

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// export const updateProduct = async (req, res) => {
//         const user = req.user._id
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Invalidate caches
//     cache.del(`product:${id}`);
//     cache.del(PRODUCTS_LIST_KEY);

//     res.json({ message: 'Product updated', product });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating product', error: error.message });
//   }
// };



export const updateProduct = [
  // Parse multipart/form-data — allow up to 10 new files
  upload.array('media', 10), // field name must be 'media' on frontend

  async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      // Find existing product (make sure it belongs to the user)
      const product = await Product.findOne({ _id: id, user: userId });
      if (!product) {
        return res.status(404).json({ message: 'Product not found or not owned by you' });
      }

      // ── 1. Handle text/JSON fields from req.body ────────────────────────
      const allowedUpdates = ['name', 'price', 'description']; // add any other fields
      const updates = {};

      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // ── 2. Handle new media files (if any were uploaded) ────────────────
      let newMediaUrls = [];

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(async (file) => {
          const url = await uploadToCloudinary(file.buffer, {
            public_id: `product-${id}-${Date.now()}`,
          });
          return url;
        });

        newMediaUrls = await Promise.all(uploadPromises);
      }

      // ── 3. Decide how to handle media ──────────────────────────────────
      // Option A: REPLACE all media (most common for simple updates)
      if (newMediaUrls.length > 0) {
        updates.media = newMediaUrls;
      }
      // Option B: APPEND new images (keep old ones)
      // else if (newMediaUrls.length > 0) {
      //   updates.media = [...(product.media || []), ...newMediaUrls];
      // }

      // ── 4. Perform the update ──────────────────────────────────────────
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      // Invalidate caches
      cache.del(`product:${id}`);
      cache.del(PRODUCTS_LIST_KEY);

      return res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(400).json({
        message: 'Error updating product',
        error: error.message,
      });
    }
  },
];

export const deleteProduct = async (req, res) => {
        const user = req.user._id
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Invalidate caches
    cache.del(`product:${id}`);
    cache.del(PRODUCTS_LIST_KEY);

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

























