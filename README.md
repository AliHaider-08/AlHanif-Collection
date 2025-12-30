# AlHaneef Collection - E-Commerce Platform

A full-stack e-commerce application for a traditional Pakistani shawl and chadar collection, built with modern web technologies.

##  Features

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive UI
- **Framer Motion** for smooth animations
- **React Router** for seamless navigation
- **Formik + Yup** for form validation
- **React Hot Toast** for notifications
- Premium UI components with glassmorphism and modern design

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT Authentication** for secure user sessions
- **bcryptjs** for password hashing
- RESTful API design
- Admin and Customer role-based access control

### Key Functionalities
-  Product browsing with filters and search
-  Shopping cart management
-  Wishlist functionality
-  User authentication (Sign up, Sign in)
-  Admin dashboard for product and order management
-  Order tracking and management
-  Checkout process with billing
-  Fully responsive design

##  Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/AliHaider-08/AlHanif-Collection.git
cd AlHanif-Collection
```

#### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=9001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=alhaneef_collection
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Create the MySQL database:
```sql
CREATE DATABASE alhaneef_collection;
```

Run the seed script to populate sample data:
```bash
node utils/seedData.js
```

Start the backend server:
```bash
npm run dev
# or
npx nodemon index.js
```

#### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:9001/api

##  Project Structure

```
AlHaneef-Collection/
 Backend/
    config/          # Database and app configuration
    controllers/     # Request handlers
    middleware/      # Auth and validation middleware
    models/          # Sequelize models
    routes/          # API routes
    utils/           # Helper functions and seed data
    index.js         # Entry point

 Frontend/
     public/          # Static assets
     src/
        assets/      # Images and media
        components/  # Reusable components
        context/     # React context (Auth, etc.)
        Pages/       # Page components
        utils/       # API services and helpers
        App.jsx      # Main app component
        main.jsx     # Entry point
     index.html
```

##  Default Credentials

### Admin Account
- Email: admin@alhaneef.com
- Password: admin123

### Customer Account
- Email: customer@example.com
- Password: customer123

##  Technologies Used

### Frontend
- React 18.3
- Vite 5.4
- Tailwind CSS 3.4
- Framer Motion 11.11
- React Router DOM 7.1
- Formik + Yup
- Axios

### Backend
- Node.js
- Express.js 4.21
- Sequelize 6.37
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

##  API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/admin-login - Admin login
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Orders
- GET /api/orders - Get user orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order by ID

### Cart & Wishlist
- GET /api/cart - Get user cart
- POST /api/cart - Add to cart
- GET /api/wishlist - Get user wishlist
- POST /api/wishlist - Add to wishlist

##  Design Features
- Premium glassmorphism UI
- Smooth animations and transitions
- Interactive hover effects
- Responsive grid layouts
- Custom color palette (Emerald green #10B981, Gold #D4AF37)
- Modern typography

##  Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

##  License
This project is licensed under the MIT License.

##  Developer
**Ali Haider**
- GitHub: [@AliHaider-08](https://github.com/AliHaider-08)

##  Acknowledgments
- Design inspiration from modern e-commerce platforms
- Traditional Pakistani craftsmanship heritage
- React and Node.js communities

---
**AlHaneef Collection** - Preserving tradition, embracing modernity 
