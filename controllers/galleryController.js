// controllers/galleryController.js
import GalleryItem from '../models/Gallery.js';
import cache from '../cache.js';

const GALLERY_LIST_KEY = 'gallery:all';

export const createGalleryItem = async (req, res) => {
  try {
    const { type, media, caption } = req.body;

    const item = new GalleryItem({ type, media, caption });
    await item.save();

    cache.del(GALLERY_LIST_KEY);

    res.status(201).json({ message: 'Gallery item created', item });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating gallery item', error: error.message });
  }
};

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

export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await GalleryItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    cache.del(`gallery:${id}`);
    cache.del(GALLERY_LIST_KEY);

    res.json({ message: 'Gallery item updated', item });
  } catch (error) {
    res.status(400).json({ message: 'Error updating gallery item', error: error.message });
  }
};

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