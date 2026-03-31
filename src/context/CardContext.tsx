import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Product, CartItem } from "../types";

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

type CartAction = 
    | { type: "ADD_ITEM", payload: { product: Product; variant: any; quantity: number }}
    | { type: "REMOVE_ITEM"; payload: { productId: string; variant: any }}
    | { type: "UPDATE_QUANTITY"; payload: { productId: string; variant: any; quantity: number }}
    | { type: "TOGGLE_CART" }
    | { type: "OPEN_CART" }
    | { type: "CLOSE_CART" } 
    | { type: "CLEAR_CART" }

// Helper function to get consistent variant identifier
export const getVariantKey = (variant: any): string => {
    if (!variant) return "no-variant";
    // Use variant.id as primary key, fallback to sku, then label
    if (variant.id) return variant.id;
    if (variant.sku) return variant.sku;
    if (variant.label) return variant.label;
    // Fallback to stringified variant for edge cases
    return JSON.stringify(variant);
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
    dispatch: () => {},
    totalItems: 0,
    totalPrice: 0,
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export const CartProvider = ({ children } : { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

    // totalItems = number of line items in cart (not total quantity)
    const totalItems = state.items.length;
    
    const totalPrice = state.items.reduce(
        (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
        0
    );

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