import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "../context/CardContext";
import { Link } from "react-router-dom";

const CartDrawer: React.FC = () => {
    const {
        items,
        removeItem,
        updateQuantity,
        totalPrice,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={24} weight="duotone" className="text-brand-brown" />
                                <h2 className="font-headline text-xl text-brand-brown">Your Cart</h2>
                                <span className="bg-brand-latte text-brand-brown text-xs font-bold px-2 py-1 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-brand-latte rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-brand-latte rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={32} weight="light" className="text-brand-brown" />
                                    </div>
                                    <p className="font-sans text-gray-500 mb-6">Your cart is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-brand-brown text-brand-cream px-8 py-3 rounded-xl font-label text-sm hover:bg-brand-cocoa transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={`${item.product.id}-${item.variant}`} className="flex gap-4">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-latte shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-headline text-brand-brown leading-tight">
                                                    {item.product.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.variant)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 font-sans mb-3">
                                                Size: {item.variant}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-brand-latte rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.variant, item.quantity - 1)}
                                                        className="p-1 hover:bg-white rounded-md transition-colors"
                                                    >
                                                        <Minus size={14} weight="bold" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.variant, item.quantity + 1)}
                                                        className="p-1 hover:bg-white rounded-md transition-colors"
                                                    >
                                                        <Plus size={14} weight="bold" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-brand-brown">
                                                    ₹{item.product.price * item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 space-y-4 bg-brand-latte/30">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-brand-brown text-xl">₹{totalPrice}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full bg-brand-brown text-brand-cream text-center py-4 rounded-xl font-label uppercase tracking-widest hover:bg-brand-cocoa transition-all shadow-lg shadow-brand-brown/20"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;