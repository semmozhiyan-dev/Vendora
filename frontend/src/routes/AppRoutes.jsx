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