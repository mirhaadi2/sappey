import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CardContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetails";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <div className="flex flex-col min-h-screen bg-background text-foreground">
                            <Header />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/shop" element={<ShopPage />} />
                                    <Route path="/products/:slug" element={<ProductDetailsPage />} />
                                </Routes>
                            </main>
                            <Footer />
                            <CartDrawer />
                            <AuthModal />
                        </div>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;