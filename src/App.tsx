import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CardContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetails";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import PageContent from "./pages/PageContent";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

const AppContent: React.FC = () => {
    const location = useLocation();
    const isPageContentRoute = ["/about", "/shipping", "/returns", "/faqs", "/privacy-policy", "/terms-and-conditions", "/sitemap"].includes(location.pathname) || location.pathname.startsWith("/pages/");

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {!isPageContentRoute && <Header />}
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/products/:slug" element={<ProductDetailsPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/about" element={<PageContent />} />
                    <Route path="/shipping" element={<PageContent />} />
                    <Route path="/returns" element={<PageContent />} />
                    <Route path="/faqs" element={<PageContent />} />
                    <Route path="/privacy-policy" element={<PageContent />} />
                    <Route path="/terms-and-conditions" element={<PageContent />} />
                    <Route path="/sitemap" element={<PageContent />} />
                    <Route path="/pages/:slug" element={<PageContent />} />
                </Routes>
            </main>
            {!isPageContentRoute && <Footer />}
            <CartDrawer />
            <SignInModal />
            <SignUpModal />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;