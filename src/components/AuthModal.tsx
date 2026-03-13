import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, EnvelopeSimple, Lock, User, ArrowRight } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

const AuthModal: React.FC = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
        } catch (error) {
            console.error("Auth error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isAuthModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAuthModalOpen(false)}
                        className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsAuthModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-brand-latte rounded-full transition-colors z-10"
                        >
                            <X size={20} weight="bold" className="text-brand-brown" />
                        </button>

                        <div className="p-8 pt-12">
                            <div className="text-center mb-10">
                                <h2 className="font-headline text-3xl text-brand-brown mb-2">
                                    {isLogin ? "Welcome Back" : "Join NutriHaven"}
                                </h2>
                                <p className="font-sans text-gray-500 text-sm">
                                    {isLogin
                                        ? "Enter your details to access your account"
                                        : "Create an account to start your wellness journey"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            className="w-full bg-brand-latte/50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-sans text-sm focus:outline-none focus:border-brand-brown transition-colors"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <EnvelopeSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full bg-brand-latte/50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-sans text-sm focus:outline-none focus:border-brand-brown transition-colors"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="w-full bg-brand-latte/50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 font-sans text-sm focus:outline-none focus:border-brand-brown transition-colors"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                {isLogin && (
                                    <div className="text-right">
                                        <button type="button" className="text-xs font-label text-brand-brown hover:underline">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-brand-brown text-brand-cream font-label py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-cocoa transition-all shadow-lg shadow-brand-brown/20 disabled:opacity-70"
                                >
                                    {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="font-sans text-sm text-gray-500">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="ml-2 font-bold text-brand-brown hover:underline cursor-pointer"
                                    >
                                        {isLogin ? "Sign Up Free" : "Sign In Here"}
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="h-2 bg-gradient-to-r from-brand-brown via-brand-cocoa to-brand-plum" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;