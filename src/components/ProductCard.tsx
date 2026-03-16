import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "@phosphor-icons/react";
import { Product } from "../types";
import { useCart } from "../context/CardContext";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { dispatch } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "ADD_ITEM", payload: { product, variant: product.variants[0], quantity: 1 } });
        dispatch({ type: "OPEN_CART" });
    };

    return (
        <Link to={`/products/${product.slug}`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.badge && (
                            <span className={`${product?.isNew ? "bg-brand-plum" : "bg-brand-brown"} text-brand-cream text-[10px] font-label uppercase tracking-widest px-2 py-1 rounded-md`}>
                                {product.badge}
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-brand-brown opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-brown hover:text-brand-cream cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            // Wishlist logic here
                        }}
                    >
                        <Heart size={18} />
                    </button>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-brand-brown text-brand-cream font-label text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-cocoa transition-colors cursor-pointer"
                        >
                            <ShoppingCart size={18} weight="fill" />
                            Quick Add
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    weight={i < Math.floor(product.rating) ? "fill" : "regular"}
                                    className="text-yellow-400"
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-sans">
                            ({product.reviewCount})
                        </span>
                    </div>

                    <h3 className="font-headline text-brand-brown text-lg mb-1 line-clamp-1 group-hover:text-brand-cocoa transition-colors">
                        {product.name}
                    </h3>

                    <p className="text-xs text-gray-500 font-sans mb-4">{product.weight}</p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-brand-brown">
                                ₹{product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                        </div>

                        <span className="text-[10px] font-label uppercase tracking-wider text-gray-400 group-hover:text-brand-brown transition-colors">
                            View Details →
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;