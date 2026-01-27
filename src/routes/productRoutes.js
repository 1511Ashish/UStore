const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', auth, requireRole('seller', 'super_admin'), createProduct);
router.put('/:id', auth, requireRole('seller', 'super_admin'), updateProduct);
router.delete('/:id', auth, requireRole('seller', 'super_admin'), deleteProduct);

module.exports = router;
