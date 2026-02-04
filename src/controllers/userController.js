const ActivityLog = require('../models/ActivityLog');

async function me(req, res) {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
}

async function getSellerActivity(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.sellerId) filter.seller = req.query.sellerId;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const [items, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('seller', 'name email role'),
      ActivityLog.countDocuments(filter)
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

module.exports = { me, getSellerActivity };
