const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['product_create', 'product_update', 'product_delete', 'login', 'logout', 'other'],
      required: true
    },
    entity: {
      type: {
        type: String,
        trim: true,
        default: ''
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entity.type'
      },
      name: {
        type: String,
        trim: true,
        default: ''
      }
    },
    metadata: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      changes: { type: mongoose.Schema.Types.Mixed }
    }
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
