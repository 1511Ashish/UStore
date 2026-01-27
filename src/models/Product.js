const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: '' },
    sku: { type: String, trim: true, unique: true, sparse: true },
    sizes: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],
    material: { type: String, trim: true, default: '' },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
    images: [{ type: String, trim: true }],
    stock: { type: Number, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
