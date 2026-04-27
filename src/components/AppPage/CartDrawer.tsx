import React, { memo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash, ShoppingBag } from "@phosphor-icons/react";
import { useCart, getVariantKey } from "../../context/CardContext";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../types";

const CartDrawer: React.FC = () => {
    const { state, dispatch, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [state.isOpen]);

    const handleCheckout = useCallback(() => {
        dispatch({ type: "CLOSE_CART" });
        navigate("/checkout");
    }, [dispatch, navigate]);

    // Helper to get the actual price (discounted or regular) for an item
    const getItemPrice = (item: CartItem) => {
        const variant = item.variant;
        if (variant && typeof variant === 'object') {
            return variant.discountedPrice || variant.price || 0;
        }
        return item.product.price || 0;
    };

    console.log("Cart State:", state);
    const drawerContent = (
        <AnimatePresence>
            {state.isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => dispatch({ type: "CLOSE_CART" })}
                        className="fixed inset-0 bg-brand-brown/40 backdrop-blur-sm z-[9998]"
                        aria-hidden="true"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF9F6] z-[9999] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.05)] border-l border-brand-brown/5"
                        role="dialog"
                        aria-label="Shopping cart"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-between px-8 py-6 border-b border-brand-brown/5 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500 mb-1">
                                    Your Selection
                                </span>
                                <h2 className="font-headline text-xl text-brand-brown">
                                    The Cart ({totalItems})
                                </h2>
                            </div>
                            <button
                                onClick={() => dispatch({ type: "CLOSE_CART" })}
                                className="p-3 rounded-full text-brand-brown/40 hover:text-brand-brown hover:bg-brand-brown/5 transition-all duration-300"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                            {state?.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40">
                                    <ShoppingBag size={48} weight="thin" className="text-brand-brown" />
                                    <p className="font-headline text-lg text-brand-brown text-center italic">
                                        Your reserve is currently empty.
                                    </p>
                                    <button
                                        onClick={() => {
                                            dispatch({ type: "CLOSE_CART" });
                                            navigate("/shop");
                                        }}
                                        className="text-[11px] font-bold uppercase tracking-[0.3em] border-b border-brand-brown/20 pb-1 hover:border-brand-brown transition-all"
                                    >
                                        Explore the Collection
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {(state?.items ?? []).map((item: CartItem) => {
                                        const unitPrice = getItemPrice(item);
                                        const lineTotal = unitPrice * (item.quantity || 0);

                                        return (
                                            <li
                                                key={`${item?.product?.id}-${getVariantKey(item?.variant)}`}
                                                className="group flex gap-3 border-b border-brand-brown/5 last:border-0"
                                            >
                                                <div className="relative w-20 h-20 overflow-hidden rounded-2xl bg-white border border-brand-brown/5">
                                                    <img
                                                        src={item?.product?.images?.[0] || item?.product?.image || "/placeholder.png"}
                                                        alt={item?.product?.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(event) => {
                                                            event.currentTarget.onerror = null;
                                                            event.currentTarget.src = "/placeholder.png";
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div className="flex justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-headline text-sm text-brand-brown leading-tight mb-1">
                                                                {item?.product?.name}
                                                            </h3>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-brown/40">
                                                                {item?.variant?.weight ? `${item.variant.weight} ${item.variant.weightUnit ?? 'G'}` : "Standard Pack"}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { productId: item.product.id, variant: item.variant } })}
                                                            className="text-brand-brown/20 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center border border-brand-brown/10 rounded-full px-2 py-1 gap-4">
                                                            <button
                                                                onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, variant: item.variant, quantity: (item.quantity || 0) - 1 } })}
                                                                disabled={(item.quantity || 0) <= 1}
                                                                className="text-brand-brown/40 hover:text-brand-brown disabled:opacity-10 transition-colors"
                                                            >
                                                                <Minus size={10} weight="bold" />
                                                            </button>
                                                            <span className="text-xs font-bold text-brand-brown min-w-[12px] text-center">
                                                                {item.quantity || 0}
                                                            </span>
                                                            <button
                                                                onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { productId: item.product.id, variant: item.variant, quantity: (item.quantity || 0) + 1 } })}
                                                                className="text-brand-brown/40 hover:text-brand-brown transition-colors"
                                                            >
                                                                <Plus size={10} weight="bold" />
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-headline text-brand-brown">
                                                                ₹{lineTotal.toLocaleString('en-IN')}
                                                            </span>
                                                            {item.variant?.discountedPrice ? (
                                                                <span className="text-[9px] text-slate-400 line-through">
                                                                    ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {state?.items.length > 0 && (
                            <div className="p-3 px-5 border-t border-brand-brown/5 bg-white">
                                <div className="space-y-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-brown/40">Subtotal</span>
                                        <span className="font-headline text-2xl text-brand-brown">
                                            ₹{totalPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {/* <p className="text-[9px] text-brand-brown/30 uppercase tracking-widest leading-relaxed">
                                        Complimentary shipping on orders above ₹2,000. Taxes included.
                                    </p> */}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row justify-between items-center">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full sm:w-[60%] bg-brand-brown text-white text-[11px] font-bold uppercase tracking-[0.1em] py-3 rounded-2xl hover:bg-brand-brown/95 transition-all shadow-xl shadow-brand-brown/10 active:scale-[0.98]"
                                    >
                                        Finalize Selection
                                    </button>
                                    <button
                                        onClick={() => dispatch({ type: "CLEAR_CART" })}
                                        className="w-full sm:w-auto text-center text-[9px] font-bold uppercase tracking-widest text-brand-brown/60 hover:text-red-500 py-3 transition-colors"
                                    >
                                        Clear Entire Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(drawerContent, document.body);
};

export default memo(CartDrawer);