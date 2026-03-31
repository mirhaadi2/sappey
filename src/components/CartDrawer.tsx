import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash, ShoppingBag } from "@phosphor-icons/react";
import { useCart, getVariantKey } from "../context/CardContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CartDrawer: React.FC = () => {
    const { state, dispatch, totalItems, totalPrice } = useCart();

    const { user, openAuthModal } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            dispatch({ type: "CLOSE_CART" });
            openAuthModal("signin");
            return;
        }
        dispatch({ type: "CLOSE_CART" });
        navigate("/checkout");
    };

    return (
        <AnimatePresence>
            {state.isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => dispatch({ type: "CLOSE_CART" })}
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50"
                        aria-hidden="true"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream z-50 flex flex-col"
                        role="dialog"
                        aria-label="Shopping cart"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingBag
                                    size={24}
                                    weight="regular"
                                    className="text-brand-brown"
                                />
                                <h2
                                    className="font-headline text-xl text-brand-brown"
                                    style={{ fontWeight: 600 }}
                                >
                                    Your Cart ({totalItems})
                                </h2>
                            </div>
                            <button
                                onClick={() => dispatch({ type: "CLOSE_CART" })}
                                className="p-2 rounded-lg text-brand-brown hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                            >
                                <X size={20} weight="regular" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {state?.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <ShoppingBag
                                        size={48}
                                        weight="thin"
                                        className="text-gray-400"
                                    />
                                    <p className="font-sans text-gray-500 text-center">
                                        Your cart is empty. Start adding some delicious nuts!
                                    </p>
                                    <button
                                        onClick={() => {
                                            dispatch({ type: "CLOSE_CART" });
                                            navigate("/shop");
                                        }}
                                        className="bg-brand-brown text-brand-cream px-6 py-3 rounded-lg font-label text-sm hover:bg-brand-cocoa transition-colors duration-200 cursor-pointer"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {state?.items.map((item: any) => (
                                        <li
                                            key={`${item.product.id}-${getVariantKey(item.variant)}`}
                                            className="flex gap-4 bg-white rounded-lg p-4 border border-gray-200"
                                        >
                                            <img
                                                src={item.product.images?.[0] || "/placeholder.png"}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="font-label text-sm text-brand-brown font-500 truncate"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    {item.product.name}
                                                </h3>
                                                <p className="font-sans text-xs text-gray-500 mb-2">
                                                    Weight: {item.variant?.label || "Standard"}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                dispatch({
                                                                type: "UPDATE_QUANTITY",
                                                                payload: {
                                                                    productId: item.product.id,
                                                                    variant: item.variant,
                                                                    quantity: item.quantity - 1,
                                                                },
                                                                })
                                                            }
                                                            disabled={item.quantity <= 1}
                                                            className="w-7 h-7 rounded-md bg-brand-latte text-brand-brown flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                            aria-label={`Decrease quantity of ${item.product.name}`}
                                                            title={item.quantity <= 1 ? "Quantity cannot be less than 1" : "Decrease quantity"}
                                                        >
                                                            <Minus size={12} weight="bold" />
                                                        </button>
                                                        <span className="font-label text-sm text-brand-brown w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                dispatch({
                                                                    type: "UPDATE_QUANTITY",
                                                                    payload: {
                                                                        productId: item.product.id,
                                                                        variant: item.variant,
                                                                        quantity: item.quantity + 1,
                                                                    },
                                                                })
                                                            }
                                                            className="w-7 h-7 rounded-md bg-brand-latte text-brand-brown flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                                                            aria-label={`Increase quantity of ${item.product.name}`}
                                                        >
                                                            <Plus size={12} weight="bold" />
                                                        </button>
                                                    </div>
                                                    <span
                                                        className="font-label text-sm text-brand-brown font-500"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        ₹{(((typeof item.variant === 'object' && item.variant.price)
                                                            ? item.variant.price
                                                            : item.product.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    dispatch({
                                                        type: "REMOVE_ITEM",
                                                        payload: {
                                                            productId: item.product.id,
                                                            variant: item.variant,
                                                        },
                                                    })
                                                }
                                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer self-start-mt-1"
                                                aria-label={`Remove ${item.product.name} from cart`}
                                            >
                                                <Trash size={16} weight="regular" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {state?.items.length > 0 && (
                            <div className="px-8 py-6 border-t border-gray-200 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-sans text-sm text-gray-600">Subtotal</span>
                                    <span className="font-headline text-brand-brown text-xl" style={{ fontWeight: 600 }}>
                                        ₹{totalPrice?.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4 font-sans">
                                    Shipping & taxes calculated at checkout
                                </p>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-brand-brown text-brand-cream font-label text-sm py-4 rounded-lg hover:bg-brand-cocoa transition-colors duration-200 cursor-pointer uppercase tracking-widest"
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => dispatch({ type: "CLEAR_CART" })}
                                    className="w-full mt-2 bg-transparent text-brand-brown font-label text-xs py-2 rounded-lg hover:bg-brand-latte transition-colors duration-200 cursor-pointer"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;