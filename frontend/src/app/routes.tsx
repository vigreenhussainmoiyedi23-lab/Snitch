import { Routes, Route, Link } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import LandingPage from "../features/LandingPage/Pages/LandingPage";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import CommonLayout from "../Layouts/CommonLayout";
import GoogleSuccess from "../features/auth/pages/GoogleSuccess";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import ProtectedLayout from "../Layouts/ProtectedLayout";
import ChangePassword from "../features/auth/pages/ChangePassword";
import CreateProduct from "../features/admin/pages/CreateProduct";
import AdminLayout from "../Layouts/AdminLayout";
import Products from "../features/products/pages/Products";
import ProductDetails from "../features/products/pages/ProductDetails";
import UpdateProducts from "../features/products/pages/UpdateProducts";
import Checkout from "../features/cart/pages/Checkout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CommonLayout>
            <LandingPage />
          </CommonLayout>
        }
      />
      {/* --- Auth Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verifyOtp" element={<VerifyOtp />} />
      <Route path="/auth/google/success" element={<GoogleSuccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/change-password"
        element={
          <ProtectedLayout>
            <ChangePassword />
          </ProtectedLayout>
        }
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Product Routes */}
      <Route
        path="/products"
        element={
          <CommonLayout>
            <Products />
          </CommonLayout>
        }
      />
      <Route
        path="/product/:slug"
        element={
          <CommonLayout>
            <ProductDetails />
          </CommonLayout>
        }
      />
      <Route
        path="/product/:slug/update"
        element={
          <AdminLayout>
            <UpdateProducts />
          </AdminLayout>
        }
      />
      {/* ADMIN Routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Link to="/admin/create-product">Create Product</Link>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/create-product"
        element={
          <AdminLayout>
            <CreateProduct />
          </AdminLayout>
        }
      />
      {/*Checkout  */}
      <Route
        path="/checkout"
        element={
          <CommonLayout>
            |<Checkout />
          </CommonLayout>
        }
      />
      <Route
        path="*"
        element={
          <>
            <h1>404 </h1>
            <a href="/">Go to home Page</a>
          </>
        }
      />
    </Routes>
  );
}
