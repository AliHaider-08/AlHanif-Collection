# AlHaneef Collection Backend API

A comprehensive e-commerce backend API for AlHaneef Collection, built with Node.js, Express.js, and MySQL with Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations for products with categories and filters
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Complete order lifecycle with status tracking
- **Wishlist**: Save favorite products
- **Admin Dashboard**: Analytics and management endpoints
- **User Management**: Customer and admin user handling
- **Reviews & Ratings**: Product review system
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize ORM** - Database ORM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials and JWT secrets.

4. Set up MySQL database:
   ```sql
   CREATE DATABASE alhaneef_collection;
   ```

5. Run the database seeder (optional):
   ```bash
   node utils/seedData.js
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories/list` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove item from wishlist
- `DELETE /api/wishlist/clear` - Clear wishlist
- `GET /api/wishlist/check/:productId` - Check if product is in wishlist

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alhaneef_collection

# Server Configuration
PORT=9000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Database Models

### User
- id, firstName, lastName, email, password, phone, role, isActive, emailVerified, lastLogin

### Product
- id, name, description, price, originalPrice, category, subcategory, images, mainImage, sku, stock, isActive, isFeatured, tags, materials, careInstructions, dimensions, weight, rating, numReviews

### Order
- id, orderNumber, userId, status, paymentStatus, paymentMethod, subtotal, shippingCost, tax, discount, total, shippingAddress, billingAddress, notes, trackingNumber, estimatedDelivery, actualDelivery

### OrderItem
- id, orderId, productId, quantity, price, productSnapshot

### Cart
- id, userId, items (JSON), subtotal, totalItems

### Wishlist
- id, userId, productId

### Review
- id, userId, productId, rating, title, comment, isVerified, helpful

## Default Admin Credentials

After running the seed script:
- Email: `admin@alhaneef.com`
- Password: `admin123`

## Default Customer Credentials

After running the seed script:
- Email: `customer@example.com`
- Password: `customer123`

## Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Responses

Success responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## Development

The server runs on port 9000 by default. Use `npm run dev` for development with nodemon auto-restart.

## License

MIT License
