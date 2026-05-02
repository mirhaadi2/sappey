import React, { createContext, useContext, useReducer, ReactNode, useEffect, useMemo, useState } from "react";
import { Product, CartItem, ProductVariant } from "../types";
import { productsClient } from "../api/products/client";

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

export type CartAction =
    | { type: "ADD_ITEM", payload: { product: Product; variant: ProductVariant | string | null; quantity: number } }
    | { type: "REMOVE_ITEM"; payload: { productId: string; variant: ProductVariant | string | null } }
    | { type: "UPDATE_QUANTITY"; payload: { productId: string; variant: ProductVariant | string | null; quantity: number } }
    | { type: "TOGGLE_CART" }
    | { type: "OPEN_CART" }
    | { type: "CLOSE_CART" }
    | { type: "CLEAR_CART" }
    | { type: "RESTORE_CART"; payload: CartState };

const CART_STORAGE_KEY = "sappay_cart";

// Helper function to get consistent variant identifier
export const getVariantKey = (variant: ProductVariant | string | null): string => {
    if (!variant) return "no-variant";
    // If it's a string, just return it
    if (typeof variant === 'string') return variant;
    // Otherwise it should be a ProductVariant object
    if (variant.id) return variant.id;
    if (variant.sku) return variant.sku;
    if (variant.label) return variant.label;
    // Fallback to stringified variant for edge cases
    return JSON.stringify(variant);
};

// Helper function to safely load cart from localStorage
const loadCartFromStorage = (): CartState => {
    try {
        if (typeof window === 'undefined') {
            return { items: [], isOpen: false };
        }
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) {
            return { items: [], isOpen: false };
        }
        const parsed = JSON.parse(stored);
        return {
            items: Array.isArray(parsed.items) ? parsed.items : [],
            isOpen: false, // Always start with cart closed after reload
        };
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return { items: [], isOpen: false };
    }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (state: CartState) => {
    try {
        if (typeof window !== 'undefined') {
            const cartToSave = {
                items: state.items,
                isOpen: false, // Don't persist the isOpen state
            };
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
        }
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
    }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const incomingVariantKey = getVariantKey(action.payload.variant);
            const existing = state.items.find(
                (item) => {
                    return (
                        item.product.id === action.payload.product.id &&
                        getVariantKey(item.variant) === incomingVariantKey
                    );
                }
            );

            if (existing) {
                // UPSERT: Update quantity if product + variant already exists
                return {
                    ...state,
                    items: state.items.map((item) => {
                        return item.product.id === action.payload.product.id &&
                            getVariantKey(item.variant) === incomingVariantKey
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item;
                    }),
                };
            }

            // INSERT: Add as new item if it doesn't exist
            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        product: action.payload.product,
                        variant: action.payload.variant,
                        quantity: action.payload.quantity,
                    },
                ],
            };
        }
        case "REMOVE_ITEM": {
            const incomingVariantKey = getVariantKey(action.payload.variant);
            return {
                ...state,
                items: state.items.filter((item) => {
                    return !(
                        item.product.id === action.payload.productId &&
                        getVariantKey(item.variant) === incomingVariantKey
                    );
                }),
            };
        }
        case "UPDATE_QUANTITY": {
            const incomingVariantKey = getVariantKey(action.payload.variant);
            const newQuantity = Math.max(0, action.payload.quantity); // Ensure non-negative

            // If quantity is 0 or less, remove the item automatically
            if (newQuantity === 0) {
                return {
                    ...state,
                    items: state.items.filter((item) => {
                        return !(item.product.id === action.payload.productId &&
                            getVariantKey(item.variant) === incomingVariantKey);
                    }),
                };
            }

            // Otherwise, update quantity with minimum of 1
            return {
                ...state,
                items: state.items.map((item) => {
                    return item.product.id === action.payload.productId &&
                        getVariantKey(item.variant) === incomingVariantKey
                        ? { ...item, quantity: Math.max(1, newQuantity) }
                        : item;
                }),
            };
        }
        case "TOGGLE_CART":
            return { ...state, isOpen: !state.isOpen };
        case "OPEN_CART":
            return { ...state, isOpen: true };
        case "CLOSE_CART":
            return { ...state, isOpen: false };
        case "CLEAR_CART":
            return { ...state, items: [] };
        case "RESTORE_CART":
            return action.payload;
        default:
            return state;
    }
};

interface CartContextType {
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    totalItems: number;
    totalPrice: number;
}

const defaultContextValue: CartContextType = {
    state: { items: [], isOpen: false },
    dispatch: () => { },
    totalItems: 0,
    totalPrice: 0,
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
    const [isHydrated, setIsHydrated] = useState(false);
    const [cartRestorePending, setCartRestorePending] = useState(false);

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = loadCartFromStorage();
        if (savedCart.items.length > 0) {
            dispatch({ type: "RESTORE_CART", payload: savedCart });
            setCartRestorePending(true);
        }
        setIsHydrated(true);
    }, []);

    // Refresh restored cart products to ensure image URLs and latest product data are current
    useEffect(() => {
        if (!cartRestorePending || state.items.length === 0) {
            return;
        }

        const refreshCartProducts = async () => {
            try {
                const refreshedItems = await Promise.all(
                    state.items.map(async (item) => {
                        try {
                            const latestProduct = await productsClient.getProduct(item.product.id);
                            return { ...item, product: latestProduct };
                        } catch (error) {
                            console.warn(
                                `Failed to refresh product ${item.product.id} during cart restore, keeping fallback product data.`,
                                error
                            );
                            return item;
                        }
                    })
                );

                dispatch({ type: "RESTORE_CART", payload: { items: refreshedItems, isOpen: false } });
            } finally {
                setCartRestorePending(false);
            }
        };

        refreshCartProducts();
    }, [cartRestorePending, state.items]);

    // Save cart to localStorage whenever state changes
    useEffect(() => {
        if (isHydrated) {
            saveCartToStorage(state);
        }
    }, [state, isHydrated]);

    // totalItems = number of line items in cart (not total quantity)
    const totalItems = state.items.length;

    // Inside your CardContext.tsx
    const totalPrice = useMemo(() => {
        return state.items.reduce((acc, item) => {
            const unitPrice =
                item.variant?.discountedPrice ||
                item.variant?.price ||
                item.product?.price ||
                0;
            return acc + (unitPrice * (item.quantity || 0));
        }, 0);
    }, [state.items]);

    return (
        <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    // Default value is always available, no need to throw error
    if (!ctx) {
        console.warn("useCart: Using default context (CartProvider might not be wrapping this component)");
        return defaultContextValue;
    }
    return ctx;
};