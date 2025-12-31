import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import CustomerRoute from './components/CustomerRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './context/AuthContext';

// Pages

import Home from './Pages/Home';
import Shop from './Pages/Shop';
import Category from './Pages/Category';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import About from './Pages/About';
import Contact from './Pages/Contact';
import SignIn from './Pages/Auth/SignIn';
import SignUp from './Pages/Auth/SignUp';
import Orders from './Pages/Orders';
import Account from './Pages/Account';
import AdminLogin from './Pages/AdminDashboard/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';

import CustomerDashboard from './Pages/CustomerDashboard/CustomerDashboardSimple';

const MainLayout = ({ children, colors }) => (
  <div
    className="flex flex-col min-h-screen"
    style={{ backgroundColor: colors.ivory }}
  >
    <header
      className="shadow-md sticky top-0 z-50"
      style={{ backgroundColor: colors.emerald, color: colors.ivory }}
    >
      <Navbar colors={colors} />
    </header>

    <main className="flex-grow">
      {children}
    </main>

    <footer>
      <Footer colors={colors} />
    </footer>
  </div>
);

function App() {
  const colors = {
    emerald: '#0ea774',
    ivory: '#FFFFF0',
  };

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />

        <Routes>
          {/* Auth Pages (No Global Navbar/Footer) */}
          <Route path="/login" element={<PublicRoute><SignIn colors={colors} /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><SignIn colors={colors} /></PublicRoute>} />
          <Route path="/signup" element={<SignUp colors={colors} />} />
          <Route path="/register" element={<SignUp colors={colors} />} />
          <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          {/* Admin Dashboard (No Global Navbar/Footer) */}
          <Route
            path="/admin-dashboard/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Customer Dashboard (No Global Navbar/Footer) */}
          <Route
            path="/customer-dashboard/*"
            element={
              <CustomerRoute>
                <CustomerDashboard colors={colors} />
              </CustomerRoute>
            }
          />

          {/* Main App Layout Routes */}
          <Route path="/" element={<MainLayout colors={colors}><Home colors={colors} /></MainLayout>} />
          <Route path="/shop" element={<MainLayout colors={colors}><Shop colors={colors} /></MainLayout>} />
          <Route path="/category" element={<MainLayout colors={colors}><Category colors={colors} /></MainLayout>} />
          <Route path="/product/:id" element={<MainLayout colors={colors}><ProductDetails colors={colors} /></MainLayout>} />
          <Route path="/cart" element={<MainLayout colors={colors}><Cart colors={colors} /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout colors={colors}><Checkout colors={colors} /></MainLayout>} />
          <Route path="/about" element={<MainLayout colors={colors}><About colors={colors} /></MainLayout>} />
          <Route path="/contact" element={<MainLayout colors={colors}><Contact colors={colors} /></MainLayout>} />
          <Route path="/account" element={<MainLayout colors={colors}><CustomerRoute><Account colors={colors} /></CustomerRoute></MainLayout>} />
          <Route path="/orders" element={<MainLayout colors={colors}><CustomerRoute><Orders colors={colors} /></CustomerRoute></MainLayout>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;
