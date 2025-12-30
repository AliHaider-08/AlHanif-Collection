import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await db.Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: db.Product,
          as: 'products',
          through: { attributes: [] }
        }
      ]
    });

    if (!cart) {
      cart = await db.Cart.create({
        userId: req.user.id,
        items: [],
        subtotal: 0,
        totalItems: 0
      });
    }

    res.json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and is active
    const product = await db.Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await db.Cart.create({
        userId: req.user.id,
        items: [],
        subtotal: 0,
        totalItems: 0
      });
    }

    // Parse existing items
    let items = cart.items || [];
    
    // Check if product already in cart
    const existingItemIndex = items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      const newQuantity = items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity'
        });
      }
      
      items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name,
        image: product.mainImage,
        addedAt: new Date()
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Update cart
    await cart.update({
      items,
      subtotal,
      totalItems
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Validate product and stock
    const product = await db.Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Update item
    let items = cart.items || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    items[itemIndex].quantity = quantity;

    // Recalculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.update({
      items,
      subtotal,
      totalItems
    });

    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    let items = cart.items || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    items.splice(itemIndex, 1);

    // Recalculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.update({
      items,
      subtotal,
      totalItems
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.update({
      items: [],
      subtotal: 0,
      totalItems: 0
    });

    res.json({
      success: true,
      message: 'Cart cleared',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

export default router;
