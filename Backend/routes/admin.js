import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    // Get basic stats
    const totalUsers = await db.User.count({ where: { role: 'customer' } });
    const totalOrders = await db.Order.count();
    const totalProducts = await db.Product.count({ where: { isActive: true } });
    const totalRevenue = await db.Order.sum('total', { where: { paymentStatus: 'paid' } });

    // Get recent orders
    const recentOrders = await db.Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    // Get order status breakdown
    const orderStats = await db.Order.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
        [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'year'],
        [db.sequelize.fn('SUM', db.sequelize.col('total')), 'revenue']
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
        },
        paymentStatus: 'paid'
      },
      group: [
        db.sequelize.fn('MONTH', db.sequelize.col('createdAt')),
        db.sequelize.fn('YEAR', db.sequelize.col('createdAt'))
      ],
      order: [
        [db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), 'ASC'],
        [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'ASC']
      ]
    });

    // Get top products
    const topProducts = await db.OrderItem.findAll({
      attributes: [
        'productId',
        [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalSold'],
        [db.sequelize.fn('SUM', db.sequelize.literal('quantity * price')), 'revenue']
      ],
      group: ['productId'],
      include: [
        {
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name', 'mainImage']
        }
      ],
      order: [[db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalOrders,
          totalProducts,
          totalRevenue: totalRevenue || 0
        },
        recentOrders,
        orderStats,
        monthlyRevenue,
        topProducts
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin)
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    const { count, rows: orders } = await db.Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: db.OrderItem,
          as: 'items',
          include: [
            {
              model: db.Product,
              as: 'product',
              attributes: ['id', 'name', 'mainImage']
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
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status (Admin)
router.put('/orders/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;

    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    if (status === 'delivered') updateData.actualDelivery = new Date();

    await order.update(updateData);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (Admin)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { firstName: { [db.Sequelize.Op.like]: `%${search}%` } },
        { lastName: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await db.User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Order,
          as: 'orders',
          attributes: ['id', 'status', 'total', 'createdAt']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          usersPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (Admin)
router.put('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

export default router;
