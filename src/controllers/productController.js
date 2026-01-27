const Product = require('../models/Product');
const { cloudinary, isConfigured } = require('../config/cloudinary');

async function uploadImageIfProvided(image) {
  if (!image) return null;
  if (!isConfigured) {
    const err = new Error('Cloudinary is not configured');
    err.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw err;
  }
  const result = await cloudinary.uploader.upload(image, {
    folder: process.env.CLOUDINARY_FOLDER || 'ustore/products'
  });
  return result.secure_url;
}

function buildProductFilter(query) {
  const filter = {};
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.brand) {
    filter.brand = query.brand;
  }
  if (query.gender) {
    filter.gender = query.gender;
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }
  if (query.size) {
    filter.sizes = query.size;
  }
  if (query.color) {
    filter.colors = query.color;
  }
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
}

async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      sku,
      sizes,
      colors,
      material,
      gender,
      images,
      image,
      stock,
      discountPercent,
      tags,
      isActive
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const imageUrl = await uploadImageIfProvided(image);
    const normalizedImages = Array.isArray(images) ? [...images] : [];
    if (imageUrl) normalizedImages.push(imageUrl);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      sku,
      sizes,
      colors,
      material,
      gender,
      images: normalizedImages,
      stock,
      discountPercent,
      tags,
      isActive
    });

    return res.status(201).json(product);
  } catch (err) {
    if (err.code === 'CLOUDINARY_NOT_CONFIGURED') {
      return res.status(500).json({ message: 'Cloudinary is not configured' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getProducts(req, res) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const skip = (page - 1) * limit;

    const filter = buildProductFilter(req.query);
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    return res.status(200).json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
}

async function updateProduct(req, res) {
  try {
    if (req.body.image) {
      const imageUrl = await uploadImageIfProvided(req.body.image);
      if (Array.isArray(req.body.images)) {
        req.body.images = [...req.body.images, imageUrl];
      } else {
        const existing = await Product.findById(req.params.id).select('images');
        const existingImages = existing?.images ? [...existing.images] : [];
        existingImages.push(imageUrl);
        req.body.images = existingImages;
      }
      delete req.body.image;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    if (err.code === 'CLOUDINARY_NOT_CONFIGURED') {
      return res.status(500).json({ message: 'Cloudinary is not configured' });
    }
    return res.status(400).json({ message: 'Invalid product id or data' });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid product id' });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
