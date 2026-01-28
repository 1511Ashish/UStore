const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    brand: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
    material: { type: String, trim: true, default: '' },
    pricing: {
      mrp: { type: Number, required: true, min: 0 },
      sellingPrice: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'INR' },
      taxPercent: { type: Number, default: 0, min: 0, max: 100 }
    },
    variants: [
      {
        sku: { type: String, trim: true },
        size: { type: String, trim: true },
        color: { type: String, trim: true },
        stock: { type: Number, default: 0, min: 0 },
        price: { type: Number, min: 0 }
      }
    ],
    images: [
      {
        url: { type: String, trim: true },
        alt: { type: String, trim: true, default: '' }
      }
    ],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 }
    },
    shipping: {
      weight: { type: Number, default: 0, min: 0 },
      weightUnit: { type: String, default: 'g' },
      isCODAvailable: { type: Boolean, default: false }
    },
    policies: {
      returnable: { type: Boolean, default: false },
      returnDays: { type: Number, default: 0, min: 0 }
    },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
