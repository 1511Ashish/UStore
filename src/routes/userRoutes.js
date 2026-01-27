const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { me } = require('../controllers/userController');

const router = express.Router();

router.get('/me', auth, me);
router.get('/admin-only', auth, requireRole('super_admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome super admin' });
});

router.get('/seller-only', auth, requireRole('seller'), (req, res) => {
  res.status(200).json({ message: 'Welcome seller' });
});

module.exports = router;
