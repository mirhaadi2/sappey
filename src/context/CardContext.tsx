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

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const payloadVariantId = action.payload.variant?.id ?? action.payload.variant;
            const existing = state.items.find(
                (item) => {
                    const itemVariantId = item.variant?.id ?? item.variant;
                    return (
                        item.product.id === action.payload.product.id &&
                        itemVariantId === payloadVariantId
                    );
                }
            );

            if (existing) {
                return {
                    ...state,
                    items: state.items.map((item) => {
                        const itemVariantId = item.variant?.id ?? item.variant;
                        return item.product.id === action.payload.product.id &&
                            itemVariantId === payloadVariantId
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item;
                    }),
                };
            }

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
            const payloadVariantId = action.payload.variant?.id ?? action.payload.variant;
            return {
                ...state,
                items: state.items.filter((item) => {
                    const itemVariantId = item.variant?.id ?? item.variant;
                    return !(item.product.id === action.payload.productId && itemVariantId === payloadVariantId);
                }),
            };
        }
        case "UPDATE_QUANTITY": {
            const payloadVariantId = action.payload.variant?.id ?? action.payload.variant;
            return {
                ...state,
                items: state.items.map((item) => {
                    const itemVariantId = item.variant?.id ?? item.variant;
                    return item.product.id === action.payload.productId && itemVariantId === payloadVariantId
                        ? { ...item, quantity: action.payload.quantity }
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children } : { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

    const totalItems = state.items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    
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
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};