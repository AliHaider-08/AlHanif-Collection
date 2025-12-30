import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlistItems = await db.Wishlist.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: db.Product,
          as: 'product',
          where: { isActive: true }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        wishlistItems
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists and is active
    const product = await db.Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existingItem = await db.Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await db.Wishlist.create({
      userId: req.user.id,
      productId
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: {
        wishlistItem
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove item from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await db.Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    await wishlistItem.destroy();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
});

// @route   POST /api/wishlist/clear
// @desc    Clear entire wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    await db.Wishlist.destroy({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing wishlist'
    });
  }
});

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await db.Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });

    res.json({
      success: true,
      data: {
        isInWishlist: !!wishlistItem
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking wishlist'
    });
  }
});

export default router;
