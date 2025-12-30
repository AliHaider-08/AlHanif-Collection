import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @route   POST /api/orders
// @desc    Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await db.Cart.findOne({ where: { userId: req.user.id } });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = await db.Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} is no longer available`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    // Create order
    const order = await db.Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      subtotal: cart.subtotal,
      shippingCost: 0, // Calculate shipping logic here
      tax: 0, // Calculate tax logic here
      discount: 0, // Apply discount logic here
      total: cart.subtotal, // Calculate total with shipping and tax
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes
    });

    // Create order items and update stock
    for (const item of cart.items) {
      const product = await db.Product.findByPk(item.productId);
      
      // Create order item
      await db.OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productSnapshot: {
          name: item.name,
          image: item.image,
          sku: product.sku
        }
      });

      // Update product stock
      await product.update({
        stock: product.stock - item.quantity
      });
    }

    // Clear cart
    await cart.update({
      items: [],
      subtotal: 0,
      totalItems: 0
    });

    // Get complete order with items
    const completeOrder = await db.Order.findByPk(order.id, {
      include: [
        {
          model: db.OrderItem,
          as: 'items',
          include: [
            {
              model: db.Product,
              as: 'product',
              attributes: ['id', 'name', 'sku']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: completeOrder
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await db.Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.OrderItem,
          as: 'items',
          include: [
            {
              model: db.Product,
              as: 'product',
              attributes: ['id', 'name', 'mainImage', 'sku']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalOrders: count,
          ordersPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await db.Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: db.OrderItem,
          as: 'items',
          include: [
            {
              model: db.Product,
              as: 'product',
              attributes: ['id', 'name', 'mainImage', 'sku']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await db.Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: db.OrderItem,
          as: 'items'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await db.Product.findByPk(item.productId);
      if (product) {
        await product.update({
          stock: product.stock + item.quantity
        });
      }
    }

    // Update order status
    await order.update({
      status: 'cancelled',
      paymentStatus: 'refunded' // Or based on payment status
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

export default router;
