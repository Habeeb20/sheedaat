// controllers/productController.js
import Product from '../models/Product.js';
import cache from '../cache.js';


// Cache keys
const PRODUCTS_LIST_KEY = 'products:all';

export const createProduct = async (req, res) => {
    const user = req.user._id
  // Assume admin auth middleware already checked
  try {
    const { name, price, media } = req.body;

    const product = new Product({user, name, price, media });
    await product.save();

    // Invalidate cache
    cache.del(PRODUCTS_LIST_KEY);

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

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

    res.json(products);
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

export const updateProduct = async (req, res) => {
        const user = req.user._id
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Invalidate caches
    cache.del(`product:${id}`);
    cache.del(PRODUCTS_LIST_KEY);

    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

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