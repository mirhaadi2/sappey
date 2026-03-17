import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";
import { useCart } from "../context/CardContext";
import ProductCard from "../components/ProductCard";
import { Star, Minus, Plus, ShoppingCart, ArrowRight, Check, Truck, Package, ArrowLeft } from "@phosphor-icons/react";

const ProductDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { dispatch } = useCart();

    const product = products.find((p) => p.slug === slug);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<any>(0);
    const [selectedVariant, setSelectedVariant] = useState<string>(product?.variants?.[0] || '');
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-latte px-8">
                <h1 className="text-3xl font-headline text-brand-brown mb-4" style={{ fontWeight: 500 }}>
                    Product Not Found
                </h1>
                <button
                    onClick={() => navigate("/shop")}
                    className="mt-4 inline-flex items-center gap-2 bg-brand-brown text-brand-cream px-4 py-2 rounded-lg hover:bg-brand-plum transition-colors"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        dispatch({
            type: "ADD_ITEM",
            payload: { product, variant: selectedVariant, quantity }
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    }

    const handleBuyNow = () => {
        dispatch({
            type: "ADD_ITEM",
            payload: { product, variant: selectedVariant, quantity }
        });
        dispatch({ type: "OPEN_CART" });
    }

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-brand-latte text-foreground">
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                {/* Image Gallery */}
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <button
                        onClick={() => navigate("/shop")}
                        className="flex items-center gap-1 font-label text-xs text-gray-500 hover:text-brand-brown transition-colors duration-200 cursor-pointer"
                    >
                        <ArrowLeft size={14} weight="regular" />
                        Shop
                    </button>
                    <span className="text-gray-300">/</span>
                    <span className="font-label text-xs text-brand-brown capitalize">{product?.category}</span>
                    <span className="text-gray-300">/</span>
                    <span className="font-label text-xs text-gray-500 truncate max-w-xs">{product?.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="relative rounded-lg overflow-hidden aspect-square bg-white mb-4">
                            <img
                                src={product.images[selectedImage]}
                                alt={`${product.name} - view ${selectedImage + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {product.badge && (
                                <span className={`absolute top-4 left-4 font-label text-xs px-3 py-1 rounded-full uppercase tracking-wider 
                                    ${product.badge === "Bestseller"
                                        ? "bg-brand-brown text-brand-cream"
                                        : product?.badge === "New Arrival"
                                            ? "bg-brand-plum text-brand-cream"
                                            : "bg-brand-cocoa text-brand-cream"
                                    }`}
                                >
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {product.images.map((img, index: any) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${selectedImage === index ? "border-brand-brown" : "border-gray-200 hover:border-brand-cocoa"}`}
                                    aria-label={`View ${product.name} - image ${index + 1}`}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} - view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            ))}

                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-label text-xs uppercase tracking-widest text-brand-cocoa">
                                {product?.category}
                            </span>
                            {product?.badge && (
                                <span className={`font-label text-xs uppercase tracking-widest px-2 py-1 rounded-full 
                                    ${product.badge === "Bestseller"
                                        ? "bg-brand-brown text-brand-cream"
                                        : "bg-brand-plum text-brand-cream"
                                    }`}>
                                    {product.badge}
                                </span>
                            )}
                        </div>

                        <h1
                            className="text-3xl font-headline text-brand-brown mb-4"
                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                        >
                            {product?.name}
                        </h1>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        weight={i < Math.round(product.rating) ? "fill" : "regular"}
                                        className={i < Math.floor(product?.rating) ? "text-warning" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="font-sans text-sm text-gray-600">
                                {product?.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-headline text-4xl text-brand-brown" style={{ fontWeight: 600 }}>
                                ${product?.price?.toFixed(2)}
                            </span>

                            {product?.originalPrice && (
                                <>
                                    <span className="font-sans text-xl text-gray-400 line-through">
                                        ${product?.originalPrice?.toFixed(2)}
                                    </span>
                                    <span className="bg-warning text-white font-label text-sm px-3 py-1 rounded-full">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="font-sans text-gray-600 leading-relaxed mb-6">{product?.description}</p>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                            <h3 className="font-label text-xs uppercase tracking-wider text-brand brown mb-3"
                                style={{ fontWeight: 500 }}
                            >
                                Available Offers
                            </h3>

                            <ul className="space-y-2">
                                {[
                                    "Free shipping on orders above $49",
                                    "Use SAPPAY10 for 10% off your first order",
                                    "Buy 2 get 5% off | Buy 3 get 10% off"
                                ]?.map((offer: any) => (
                                    <li key={offer} className="flex items-start gap-2">
                                        <Check size={14} weight="bold" className="text-success mt-0.5 flex-shrink-0" />
                                        <span className="font-sans text-xs text-gray-600">{offer}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-label text-xs uppercase tracking-wider text-brand-brown mb-3">
                                Size / Weight
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product?.variants?.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedVariant(size)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-sans transition-all duration-200 ${selectedVariant === size
                                                ? "border-brand-brown bg-brand-brown text-brand-cream"
                                                : "border-gray-200 bg-white text-brand-brown hover:border-brand-cocoa"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-label text-xs uppercase tracking-wider text-brand-brown mb-3" style={{ fontWeight: 500 }}>
                                Quantity
                            </h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-10 h-10 rounded-lg bg-brand-latte text-brand-brown flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer border border-gray-200"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={16} weight="regular" />
                                </button>
                                <span className="font-sans text-lg font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-10 h-10 rounded-lg bg-brand-latte text-brand-brown flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer border border-gray-200"
                                    aria-label="Increase quantity"
                                >
                                    <Plus size={16} weight="regular" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 font-label text-sm py-4 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest 
                                        ${addedToCart
                                        ? "bg-success text-brand-cream"
                                        : "bg-brand-brown text-brand-cream hover:brand-cocoa"
                                    }
                                    `}
                                disabled={addedToCart}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check size={16} weight="bold" />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} weight="regular" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-brand-latte text-brand-brown font-label text-sm py-4 rounded-lg border-2 border-brand-brown hover:bg-brand-brown hover:text-brand-cream transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                Buy Now
                                <ArrowRight size={16} weight="regular" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Truck size={20} weight="regular" className="text-brand-cocoa" />
                                <span className="font-sans text-xs">Free delivery above $49</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Package size={20} weight="regular" className="text-brand-cocoa" />
                                <span className="font-sans text-xs">Freshness guaranteed</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg border border-gray-200 p-8 mb-12"
                    aria-label="Nutritional information"
                >
                    <h2
                        className="font-headline text-2xl text-brand-brown mb-6"
                        style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                    >
                        Nutritional Facts
                    </h2>
                    <p className="font-sans text-xs text-gray-500 mb-4">Per 100g serving</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {product?.nutrition?.map((fact: any) => (
                            <div
                                key={fact?.label}
                                className="bg-brand-latte rounded-lg p-4 text-center"
                            >
                                <p className="font-headline text-xl text-brand-brown mb-1" style={{ fontWeight: 600 }}>
                                    {fact?.value}
                                </p>
                                <p className="font-label text-xs text-gray-500 uppercase tracking-wider">
                                    {fact?.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                    aria-label="Customer reviews"
                >
                    <h2
                        className="font-headline text-2xl text-brand-brown mb-6"
                        style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                    >
                        Customer Reviews
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product?.reviews?.map((review: any) => (
                            <div
                                key={review?.id}
                                className="bg-white rounded-lg border border-gray-200 p-6"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-brown flex items-center justify-center">
                                            <span className="font-label text-xs text-brand-cream" style={{ fontWeight: 500 }}>
                                                {review?.author?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-label text-sm text-brand-brown" style={{ fontWeight: 500 }}>
                                                {review?.author}
                                            </p>
                                            <p className="font-sans text-xs text-gray-400">
                                                {review?.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: review?.rating }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                weight="fill"
                                                className="text-warning"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="font-sans text-sm text-gray-600 leading-relaxed">{review?.comment}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ opactiy: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        aria-label="Related products"
                    >
                        <h2
                            className="font-headline text-2xl text-brand-brown mb-6"
                            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
                        >
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts?.map((p) => (
                                <ProductCard key={p?.id} product={p} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    )
}

export default ProductDetailPage;