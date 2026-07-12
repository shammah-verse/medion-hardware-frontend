import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { ProductCatalog } from './pages/ProductCatalog';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { Stores } from './pages/Stores';
import { StoreProfile } from './pages/StoreProfile';
import { Categories } from './pages/Categories';
import { CategoryDetails } from './pages/CategoryDetails';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { VendorSetup } from './pages/vendor/VendorSetup';
import { StoreSetupSuccess } from './pages/vendor/StoreSetupSuccess';
import { VendorStores } from './pages/vendor/VendorStores';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { Wallet as VendorWallet } from './pages/vendor/Wallet';
import { Verification as VendorVerification } from './pages/vendor/Verification';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useAuthStore } from './store/useAuthStore';
import { About } from './pages/About';
import { Journal } from './pages/Journal';
import { Support } from './pages/Support';
import { Terms } from './pages/Terms';

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
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<CategoryDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreProfile />} />
          <Route path="about" element={<About />} />
          <Route path="journal" element={<Journal />} />
          <Route path="support" element={<Support />} />
          <Route path="terms" element={<Terms />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Customer Routes */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="profile/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Vendor Routes */}
          <Route path="vendor/setup" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <VendorSetup />
            </ProtectedRoute>
          } />
          <Route path="vendor/setup/success" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <StoreSetupSuccess />
            </ProtectedRoute>
          } />
          <Route path="vendor/stores" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <VendorStores />
            </ProtectedRoute>
          } />
          <Route path="vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
          {/*
          <Route path="vendor/products/new" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <CreateProduct />
            </ProtectedRoute>
          } />
          */}
          <Route path="vendor/wallet" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <VendorWallet />
            </ProtectedRoute>
          } />
          <Route path="vendor/verification" element={
            <ProtectedRoute allowedRoles={['STORE_VENDOR']}>
              <VendorVerification />
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
