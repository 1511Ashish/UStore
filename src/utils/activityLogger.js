const ActivityLog = require('../models/ActivityLog');

async function logActivity({
  sellerId,
  action,
  entityType = '',
  entityId = null,
  entityName = '',
  metadata = {}
}) {
  if (!sellerId) return;
  try {
    await ActivityLog.create({
      seller: sellerId,
      action,
      entity: { type: entityType, id: entityId, name: entityName },
      metadata
    });
  } catch (err) {
    // Activity logging should never block the main flow; log and continue.
    console.error('Failed to log activity', err);
  }
}

module.exports = { logActivity };
