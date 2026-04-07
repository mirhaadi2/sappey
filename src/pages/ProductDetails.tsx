import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProduct, useProducts } from "../api/exports";
import { useCart } from "../context/CardContext";
import { useHomepagePromotions } from "../api/promotions";
import ProductCard from "../components/ProductCard";
import { ProductDetailSkeleton } from "../components/Skeletons";
import { Product, ProductVariant, NutritionFact, Review } from "../types";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  Check,
  Truck,
  Package,
  ArrowLeft,
} from "@phosphor-icons/react";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { products, isLoading: productsLoading } = useProducts(undefined);
  const { data: product, isLoading: productLoading } = useProduct(id!, true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<any>(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [addedToCart, setAddedToCart] = useState(false);

  // Check if there's an active promotion banner to adjust layout
  const { data: promotionBanners = [] } = useHomepagePromotions();
  const hasBanner = promotionBanners && promotionBanners.length > 0;
  // Add padding-top to account for fixed header: Banner(32px) + Header(64px) = 96px when banner present
  // const topPadding = hasBanner ? "pt-24" : "pt-16";

const variantOptions = useMemo(() => {
    if (!product) return [];

    const options: ProductVariant[] = [];

    // Add variants if they exist
    if (Array.isArray(product?.variants)) {
      (product?.variants as Array<string | ProductVariant>).forEach((variant: string | ProductVariant) => {
        // Type guard: only process if it's a ProductVariant object
        if (typeof variant !== 'string' && variant && 'id' in variant) {
          options.push({
            id: variant.id,
            productId: variant.productId,
            label: variant.label,
            price: variant.price,
            originalPrice: variant.originalPrice,
            discountedPrice: variant.discountedPrice,
            discountedPercent: variant.discountedPercent,
            weight: variant.weight,
            weightUnit: variant.weightUnit,
            sku: variant.sku,
            status: variant.status,
          });
        }
      });
    }

    // Sort by weight ascending
    return options.sort((a, b) => {
      const weightA = typeof a.weight === 'string' ? parseFloat(a.weight) : (a.weight || 0);
      const weightB = typeof b.weight === 'string' ? parseFloat(b.weight) : (b.weight || 0);
      return weightA - weightB;
    });
  }, [product]);

  const selectedVariantData: ProductVariant | null = useMemo(() => {
    if (!variantOptions || variantOptions.length === 0) return null;
    const found = variantOptions.find(
      (item: ProductVariant) => item.id === selectedVariant,
    );
    return found || variantOptions[0] || null;
  }, [selectedVariant, variantOptions]);

  useEffect(() => {
    if (variantOptions.length > 0 && !selectedVariant) {
      setSelectedVariant(String(variantOptions[0].id ?? ""));
    }
  }, [variantOptions, selectedVariant]);

  // Price display: use selected weight's price (no product-level discount for weight-based)
  const displayPrice = selectedVariantData?.price ?? 0;
  const displayWeight = selectedVariantData?.label;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (productLoading || productsLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product && productLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-latte px-8">
        <h1
          className="text-3xl font-headline text-brand-brown mb-4"
          style={{ fontWeight: 500 }}
        >
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

  const relatedProducts: Product[] = product
    ? (products ?? [])
      .filter((p: Product) => p?.category === product?.category && p?.id !== product?.id)
      .slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!product || !selectedVariantData) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: { ...product, price: selectedVariantData.price || 0 } as Product,
        variant: selectedVariantData,
        quantity,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariantData) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: { ...product, price: selectedVariantData.price || 0 } as Product,
        variant: selectedVariantData,
        quantity,
      },
    });
    dispatch({ type: "OPEN_CART" });
  };

  return (
    <div className={`min-h-screen bg-brand-latte text-foreground pt-0 ${hasBanner ? "pt-2" : ""}`}>
      <div className="bg-white border-b border-slate-200">
        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-cocoa transition-colors font-medium text-sm"
          >
            <ArrowLeft size={20} weight="bold" />
            Shop
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-label text-xs text-brand-brown capitalize">
            {product?.category}
          </span>
          <span className="text-slate-300">/</span>
          <span className="font-label text-xs text-slate-500 truncate max-w-xs">
            {product?.name}
          </span>
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
                src={product?.images?.[selectedImage]}
                alt={`${product?.name} - view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {product?.badge && (
                <span
                  className={`absolute top-4 left-4 font-label text-xs px-3 py-1 rounded-full uppercase tracking-wider 
                  ${product?.badge === "Bestseller"
                      ? "bg-brand-brown text-brand-cream"
                      : product?.badge === "New Arrival"
                        ? "bg-brand-plum text-brand-cream"
                        : "bg-brand-cocoa text-brand-cream"
                    }`}
                >
                  {product?.badge}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {product?.images?.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${selectedImage === index ? "border-brand-brown" : "border-slate-200 hover:border-brand-cocoa"}`}
                  aria-label={`View ${product?.name} - image ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product?.name} - view ${index + 1}`}
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
                <span
                  className={`font-label text-xs uppercase tracking-widest px-2 py-1 rounded-full 
                  ${(product?.badge === "Bestseller")
                      ? "bg-brand-brown text-brand-cream"
                      : "bg-brand-plum text-brand-cream"
                    }`}
                >
                  {product?.badge}
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
                    weight={i < (product?.rating ? Math.floor(product?.rating) : 0) ? "fill" : "regular"}
                    className={
                      i < (product?.rating ? Math.floor(product?.rating) : 0)
                        ? "text-warning"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <span className="font-sans text-sm text-slate-600">
                {product?.rating ?? 0} ({(product?.reviewCount ?? 0)} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span
                className="font-headline text-4xl text-brand-brown"
                style={{ fontWeight: 600 }}
              >
                ₹{displayPrice.toFixed(2)}
              </span>
              <span className="font-label text-sm uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {displayWeight}
              </span>
            </div>

            <p className="font-sans text-slate-600 leading-relaxed mb-6">
              {product?.description}
            </p>

            {/* <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-4 mb-6">
              <h3
                className="font-label text-xs uppercase tracking-wider text-brand brown mb-3"
                style={{ fontWeight: 500 }}
              >
                Available Offers
              </h3>

              <ul className="space-y-2">
                {[
                  "Free shipping on orders above $49",
                  "Use SAPPEY10 for 10% off your first order",
                  "Buy 2 get 5% off | Buy 3 get 10% off",
                ]?.map((offer: string) => (
                  <li key={offer} className="flex items-start gap-2">
                    <Check
                      size={14}
                      weight="bold"
                      className="text-success mt-0.5 flex-shrink-0"
                    />
                    <span className="font-sans text-xs text-slate-600">
                      {offer}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

            <div className="mb-6">
              <h3 className="font-label text-xs uppercase tracking-wider text-brand-brown mb-3">
                Select Weight
              </h3>

              <div className="flex flex-wrap gap-2">
                {variantOptions.map((variant: ProductVariant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(String(variant.id))}
                    className={`px-6 py-3 border-2 rounded-lg text-sm font-label transition-all duration-200 ${selectedVariant === variant.id
                        ? "border-brand-brown bg-brand-brown text-brand-cream"
                        : "border-slate-200 bg-white text-brand-brown hover:border-brand-cocoa"
                      }`}
                  >
                    <div className="font-semibold">{variant.label}</div>
                    <div className="text-xs">₹{Number(variant.price).toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3
                className="font-label text-xs uppercase tracking-wider text-brand-brown mb-3"
                style={{ fontWeight: 500 }}
              >
                Quantity
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-brand-brown flex items-center justify-center hover:bg-slate-100 transition-colors duration-200 cursor-pointer border border-slate-200"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} weight="regular" />
                </button>
                <span className="font-sans text-lg font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-brand-brown flex items-center justify-center hover:bg-slate-100 transition-colors duration-200 cursor-pointer border border-slate-200"
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
                  }`}
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
              <div className="flex items-center gap-2 text-slate-600">
                <Truck
                  size={20}
                  weight="regular"
                  className="text-brand-cocoa"
                />
                <span className="font-sans text-xs">
                  Free delivery above $49
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Package
                  size={20}
                  weight="regular"
                  className="text-brand-cocoa"
                />
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
          className="bg-white rounded-[24px] border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 p-8 mb-12"
          aria-label="Nutritional information"
        >
          <h2
            className="font-headline text-2xl text-brand-brown mb-6"
            style={{ fontWeight: 500, letterSpacing: "-0.025em" }}
          >
            Nutritional Facts
          </h2>
          <p className="font-sans text-xs text-slate-500 mb-4">
            Per 100g serving
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {product?.nutrition?.map((fact: string | NutritionFact) => {
              // Type guard to handle both string and object
              if (typeof fact === 'string') return null;
              return (
                <div
                  key={fact?.label}
                  className="bg-brand-latte rounded-lg p-4 text-center"
                >
                  <p
                    className="font-headline text-xl text-brand-brown mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    {fact?.value}
                  </p>
                  <p className="font-label text-xs text-slate-500 uppercase tracking-wider">
                    {fact?.label}
                  </p>
                </div>
              );
            })}
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
            {product?.reviews?.map((review: string | Review) => {
              if (typeof review === 'string') return null;
              return (
              <div
                key={review?.id}
                className="bg-white rounded-[24px] border border-brand-brown/10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(139,115,85,0.15)] hover:-translate-y-1 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-brown flex items-center justify-center">
                      <span
                        className="font-label text-xs text-brand-cream"
                        style={{ fontWeight: 500 }}
                      >
                        {review?.author?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-label text-sm text-brand-brown"
                        style={{ fontWeight: 500 }}
                      >
                        {review?.author}
                      </p>
                      <p className="font-sans text-xs text-slate-400">
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
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {review?.comment}
                </p>
              </div>
              );
            })}
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
              {relatedProducts?.map((p: Product) => (
                <ProductCard key={p?.id} product={p} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;