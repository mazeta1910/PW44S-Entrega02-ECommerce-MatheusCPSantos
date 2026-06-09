import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { CatalogPage } from "@/pages/catalog";
import { ProductDetailPage } from "@/pages/product-detail";
import { RequireAuth } from "@/components/require-auth";
import { RequireAdmin } from "@/components/require-admin";
import { AdminDashboardPage } from "@/pages/admin-dashboard";
import { Layout } from "@/components/layout";
import { CategoryListPage } from "@/pages/category-list";
import { CategoryFormPage } from "@/pages/category-form";
import { ProductListPage } from "@/pages/product-list";
import { ProductFormPage } from "@/pages/product-form";
import { NotFound } from "@/pages/not-found";
import { ProductShow } from "@/pages/product-show";
import { ProductCardListPage } from "@/pages/product-card-list";
import { CartPage } from "@/pages/cart";
import { AccountLayout } from "@/components/account-layout";
import { AccountProfilePage } from "@/pages/account/profile";
import { AccountOrdersPage } from "@/pages/account/orders";
import { AccountAddressesPage } from "@/pages/account/addresses";
import { TermsOfServicePage } from "@/pages/terms-of-service";
import { PrivacyPolicyPage } from "@/pages/privacy-policy";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* rotas públicas */}
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/product/:productId" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="termos" element={<TermsOfServicePage />} />
        <Route path="privacidade" element={<PrivacyPolicyPage />} />

        {/* rotas da conta (exigem login) */}
        <Route element={<RequireAuth />}>
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountProfilePage />} />
            <Route path="orders" element={<AccountOrdersPage />} />
            <Route path="addresses" element={<AccountAddressesPage />} />
          </Route>
        </Route>

        {/* rotas administrativas (exigem login e perfil admin) */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireAdmin />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/:id" element={<CategoryFormPage />} />

            <Route path="products" element={<ProductListPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id" element={<ProductFormPage />} />

            <Route path="products/show" element={<ProductShow />} />
            <Route path="products/card-list" element={<ProductCardListPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
