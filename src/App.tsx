import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CardContext";
import { WebsiteAuthProvider } from "./contexts/WebsiteAuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import GuestAuthModal from "./components/GuestAuthModal";
import CustomerAuthModal from "./components/CustomerAuthModal";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetails";
import HomePage from "./pages/HomePage";
import BulkOrderPage from "./pages/BulkOrderPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderListingPage from "./pages/OrderListingPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import PageContent from "./pages/PageContent";
import WishlistPage from "./pages/WishlistPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: (failureCount, error: unknown) => {
                // Don't retry on 4xx errors (client errors)
                if ((error instanceof Object && 'response' in error && typeof (error as any)?.response?.status === 'number') && (error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
                    return false;
                }
                // Retry up to 3 times for 5xx and network errors with exponential backoff
                return failureCount < 3;
            },
            retryDelay: (attemptIndex) => {
                // Exponential backoff: 1s, 2s, 4s
                return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
            },
        },
    },
});

const AppContent: React.FC = () => {
    const location = useLocation();
    const isPageContentRoute = ["/about-us", "/shipping-policy", "/returns-refunds", "/faqs", "/privacy-policy", "/terms-and-conditions", "/sitemap"].includes(location.pathname) || location.pathname.startsWith("/pages/");
    const isCheckoutRoute = location.pathname === "/checkout";

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {!isPageContentRoute && !isCheckoutRoute && <Header />}
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/bulk-order" element={<BulkOrderPage />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
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
                        element={<CheckoutPage />}
                    />
                    <Route
                        path="/order-success"
                        element={<OrderSuccessPage />}
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrderListingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:orderId"
                        element={
                            <ProtectedRoute>
                                <OrderDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/about-us" element={<PageContent />} />
                    <Route path="/shipping-policy" element={<PageContent />} />
                    <Route path="/returns-refunds" element={<PageContent />} />
                    <Route path="/faqs" element={<PageContent />} />
                    <Route path="/privacy-policy" element={<PageContent />} />
                    <Route path="/terms-and-conditions" element={<PageContent />} />
                    <Route path="/sitemap" element={<PageContent />} />
                    <Route path="/pages/:slug" element={<PageContent />} />
                </Routes>
            </main>
            {!isPageContentRoute && !isCheckoutRoute && <Footer />}
            <CartDrawer />
            <GuestAuthModal />
            <CustomerAuthModal />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <WebsiteAuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <BrowserRouter>
                            <AppContent />
                        </BrowserRouter>
                    </WishlistProvider>
                </CartProvider>
            </WebsiteAuthProvider>
        </QueryClientProvider>
    );
};

export default App;