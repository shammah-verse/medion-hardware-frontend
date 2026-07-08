import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { ProductCatalog } from './pages/ProductCatalog';
import { Checkout } from './pages/Checkout';
import { Stores } from './pages/Stores';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VendorSetup } from './pages/vendor/VendorSetup';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';

export function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public & Customer Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<ProductCatalog />} />
          <Route path="stores" element={<Stores />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          {/* Vendor Routes */}
          <Route path="vendor/setup" element={
            <ProtectedRoute allowedRoles={['STORE_OWNER']}>
              <VendorSetup />
            </ProtectedRoute>
          } />
          <Route path="vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['STORE_OWNER']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
