import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Sync database
    await db.sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await db.User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@alhaneef.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    console.log('Admin user created');

    // Create sample products
    const sampleProducts = [
      {
        name: "Men's Burgundy Embroidered Chadar",
        description: 'Rich burgundy with intricate gold thread work',
        price: 3500,
        originalPrice: 4500,
        category: 'men',
        subcategory: 'chadar',
        mainImage: 'S1.jpg',
        images: ['S1.jpg'],
        sku: 'SKU-BURGUNDY-001',
        stock: 50,
        isFeatured: true,
        tags: ['burgundy', 'embroidered', 'gold', 'traditional'],
        materials: 'Pure Wool with Gold Thread',
        careInstructions: 'Dry clean only. Store in cool, dry place.',
        dimensions: { length: '2.5m', width: '1.2m' },
        weight: 0.8
      },
      {
        name: "Men's Classic Black Shawl",
        description: 'Timeless black with subtle geometric patterns',
        price: 3999,
        originalPrice: 4999,
        category: 'men',
        subcategory: 'shawl',
        mainImage: 'S2.jpg',
        images: ['S2.jpg'],
        sku: 'SKU-BLACK-002',
        stock: 30,
        isFeatured: true,
        tags: ['black', 'geometric', 'classic', 'elegant'],
        materials: 'Premium Pashmina',
        careInstructions: 'Dry clean recommended. Handle with care.',
        dimensions: { length: '2.8m', width: '1.4m' },
        weight: 0.6
      },
      {
        name: "Men's Brown Heritage Chadar",
        description: 'Traditional brown with Kashmiri embroidery',
        price: 4500,
        category: 'men',
        subcategory: 'chadar',
        mainImage: 'S3.jpg',
        images: ['S3.jpg'],
        sku: 'SKU-BROWN-003',
        stock: 25,
        tags: ['brown', 'kashmiri', 'heritage', 'embroidery'],
        materials: 'Kashmiri Wool',
        careInstructions: 'Professional dry cleaning only.',
        dimensions: { length: '2.6m', width: '1.3m' },
        weight: 0.9
      },
      {
        name: "Men's Navy Blue Premium Shawl",
        description: 'Deep navy blue with silver accents',
        price: 5200,
        originalPrice: 6500,
        category: 'men',
        subcategory: 'shawl',
        mainImage: 'S4.jpg',
        images: ['S4.jpg'],
        sku: 'SKU-NAVY-004',
        stock: 20,
        isFeatured: true,
        tags: ['navy', 'blue', 'silver', 'premium'],
        materials: 'Merino Wool with Silver Thread',
        careInstructions: 'Dry clean. Avoid direct sunlight.',
        dimensions: { length: '3m', width: '1.5m' },
        weight: 1.0
      },
      {
        name: "Women's Elegant Pink Shawl",
        description: 'Soft pink with delicate floral patterns',
        price: 2800,
        category: 'women',
        subcategory: 'shawl',
        mainImage: 'S5.jpg',
        images: ['S5.jpg'],
        sku: 'SKU-PINK-005',
        stock: 40,
        tags: ['pink', 'floral', 'elegant', 'delicate'],
        materials: 'Fine Pashmina',
        careInstructions: 'Gentle dry cleaning recommended.',
        dimensions: { length: '2.4m', width: '1.1m' },
        weight: 0.5
      },
      {
        name: "Women's Cream Luxury Stole",
        description: 'Cream colored stole with pearl embroidery',
        price: 3200,
        originalPrice: 4000,
        category: 'women',
        subcategory: 'stole',
        mainImage: 'S6.jpg',
        images: ['S6.jpg'],
        sku: 'SKU-CREAM-006',
        stock: 35,
        isFeatured: true,
        tags: ['cream', 'pearl', 'luxury', 'stole'],
        materials: 'Silk Blend with Pearl Work',
        careInstructions: 'Professional cleaning only.',
        dimensions: { length: '2m', width: '0.8m' },
        weight: 0.4
      },
      {
        name: "Unisex Green Traditional Chadar",
        description: 'Forest green with traditional Kashmiri motifs',
        price: 3800,
        category: 'men',
        subcategory: 'chadar',
        mainImage: 'S7.jpg',
        images: ['S7.jpg'],
        sku: 'SKU-GREEN-007',
        stock: 28,
        tags: ['green', 'unisex', 'traditional', 'kashmiri'],
        materials: 'Pure Kashmiri Wool',
        careInstructions: 'Dry clean only.',
        dimensions: { length: '2.7m', width: '1.3m' },
        weight: 0.85
      },
      {
        name: "Women's Maroon Evening Shawl",
        description: 'Deep maroon perfect for evening wear',
        price: 4200,
        category: 'women',
        subcategory: 'shawl',
        mainImage: 'S8.jpg',
        images: ['S8.jpg'],
        sku: 'SKU-MAROON-008',
        stock: 22,
        tags: ['maroon', 'evening', 'formal', 'elegant'],
        materials: 'Premium Wool Blend',
        careInstructions: 'Dry clean recommended.',
        dimensions: { length: '2.5m', width: '1.2m' },
        weight: 0.7
      }
    ];

    for (const productData of sampleProducts) {
      await db.Product.create(productData);
    }
    console.log('Sample products created');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await db.User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+1234567890',
      role: 'customer',
      isActive: true,
      emailVerified: true
    });
    console.log('Sample customer created');

    // Create sample reviews
    const products = await db.Product.findAll({ limit: 5 });
    for (const product of products) {
      await db.Review.create({
        userId: customer.id,
        productId: product.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        title: 'Beautiful product!',
        comment: 'Absolutely love this shawl. The quality is amazing and the colors are vibrant.',
        isVerified: true
      });
    }
    console.log('Sample reviews created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
