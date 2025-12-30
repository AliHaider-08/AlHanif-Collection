import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      featured
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Category filter
    if (category) {
      whereClause.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[db.Sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[db.Sequelize.Op.lte] = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } },
        { tags: { [db.Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Featured filter
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    const order = [[sortBy, sortOrder.toUpperCase()]];

    const { count, rows: products } = await db.Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      include: [
        {
          model: db.Review,
          as: 'reviews',
          attributes: ['rating']
        }
      ]
    });

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const productData = product.toJSON();
      if (productData.reviews && productData.reviews.length > 0) {
        const avgRating = productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length;
        productData.averageRating = avgRating;
        productData.reviewCount = productData.reviews.length;
      } else {
        productData.averageRating = 0;
        productData.reviewCount = 0;
      }
      delete productData.reviews;
      return productData;
    });

    res.json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalProducts: count,
          productsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.Product.findOne({
      where: { id: req.params.id, isActive: true },
      include: [
        {
          model: db.Review,
          as: 'reviews',
          include: [
            {
              model: db.User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productData = product.toJSON();
    
    // Calculate average rating
    if (productData.reviews && productData.reviews.length > 0) {
      const avgRating = productData.reviews.reduce((sum, review) => sum + review.rating, 0) / productData.reviews.length;
      productData.averageRating = avgRating;
      productData.reviewCount = productData.reviews.length;
    } else {
      productData.averageRating = 0;
      productData.reviewCount = 0;
    }

    res.json({
      success: true,
      data: {
        product: productData
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const productData = req.body;

    // Generate unique SKU
    const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    productData.sku = sku;

    const product = await db.Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update(req.body);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete by setting isActive to false
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get all product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await db.Product.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category']
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: {
        categories: categoryList
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

export default router;
