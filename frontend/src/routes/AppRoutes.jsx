import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import Products from "../pages/admin/Products";
import Users from "../pages/admin/Users";
import Cart from "../pages/client/Cart";
import Checkout from "../pages/client/Checkout";
import Home from "../pages/client/Home";
import Product from "../pages/client/Product";
import ProductDetails from "../pages/client/ProductDetails";
import OrderSuccess from "../pages/client/OrderSuccess";
import ClientOrders from "../pages/client/Orders";
import OrderDetails from "../pages/client/OrderDetails";
import Profile, {
  ProfileAddresses,
  ProfileDetails,
  ProfileOrders,
  ProfileOverview,
  ProfilePassword,
  ProfilePreferences,
} from "../pages/client/Profile";
import Login from "../pages/auth/Login";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Login route - no layout */}
      <Route path="/login" element={<Login />} />

      {/* Public client routes */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Route>

      {/* Protected client routes */}
      <Route
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<ClientOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />}>
          <Route index element={<ProfileOverview />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="details" element={<ProfileDetails />} />
          <Route path="password" element={<ProfilePassword />} />
          <Route path="addresses" element={<ProfileAddresses />} />
          <Route path="preferences" element={<ProfilePreferences />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;