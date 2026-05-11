import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { useProduct, useProducts } from "../api/exports";
import { useGetProductReviews } from "../api/reviews";
import { useCart } from "../context/CardContext";
import { ProductDetailSkeleton } from "../components/Skeletons";
import { ProductVariant } from "../types";
import { DrawerType } from "../types/ProductDetails";
import {
  DrawerButton,
  NotFoundState,
  ProductImageGallery,
  ProductHeader,
  VariantSelector,
  PurchaseSection,
  ProductReviewsSection,
  RelatedProductsSection,
  ProductDetailsInfoDrawer
} from "../components/ProductDetails";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const { products, isLoading: productsLoading } = useProducts(undefined);
  const { data: product, isLoading: productLoading } = useProduct(id!, true);
  const { reviews, statistics, isLoading: reviewsLoading } = useGetProductReviews(id || "");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    if (activeDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeDrawer]);

  const variantOptions = useMemo(() => {
    if (!product || !Array.isArray(product.variants)) return [];
    return (product.variants as ProductVariant[])
      .filter((v) => v !== null && v.isAvailable !== false)
      .sort((a, b) => Number(a.weight) - Number(b.weight));
  }, [product]);

  const allVariants = useMemo(() => {
    if (!product || !Array.isArray(product.variants)) return [];
    return (product.variants as ProductVariant[])
      .filter((v) => v !== null)
      .sort((a, b) => Number(a.weight) - Number(b.weight));
  }, [product]);

  const selectedVariantData = useMemo(() => {
    if (variantOptions.length === 0) return null;
    return variantOptions.find(v => String(v.id) === selectedVariantId) || variantOptions[0];
  }, [selectedVariantId, variantOptions]);

  useEffect(() => {
    if (variantOptions.length > 0 && !selectedVariantId) {
      setSelectedVariantId(String(variantOptions[0].id));
    }
  }, [variantOptions, selectedVariantId]);

  if (productLoading || productsLoading) return <ProductDetailSkeleton />;
  if (!product) return <NotFoundState onBack={() => navigate("/shop")} />;

  const isOutOfStock = variantOptions.length === 0 || !selectedVariantData;

  return (
    /* REMOVED overflow-x-hidden here as it breaks sticky */
    <div className="min-h-screen bg-[#FDFCFB] relative">
      <ProductDetailsInfoDrawer
        product={product}
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer(null)}
      />

      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/shop")} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-brown/60 hover:text-brand-brown transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Changed to grid for more stable sticky behavior */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ProductImageGallery
              images={product.images || []}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              badge={product.badge}
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-6">
            <div className="space-y-8">
              <ProductHeader
                rating={statistics?.averageRating || product?.rating || 0}
                reviewCount={statistics?.totalReviews || product?.reviewCount || 0}
                name={product.name}
                product={product}
                selectedVariantData={selectedVariantData}
              />

              <div className="space-y-1 border-y border-slate-100 py-4">
                <DrawerButton label="Product Description" onClick={() => setActiveDrawer("description")} />
                <DrawerButton label="Key Benefits" onClick={() => setActiveDrawer("benefits")} />
                <DrawerButton label="Nutritional Profile" onClick={() => setActiveDrawer("nutrition")} />
              </div>

              <VariantSelector
                allVariants={allVariants}
                selectedVariantId={selectedVariantId}
                onVariantSelect={setSelectedVariantId}
              />

              <PurchaseSection
                quantity={quantity}
                onQuantityChange={setQuantity}
                isOutOfStock={isOutOfStock}
                selectedVariantData={selectedVariantData}
                product={product}
                onAddToCart={() => {
                  if (selectedVariantData && product) {
                    dispatch({
                      type: "ADD_ITEM",
                      payload: { product, variant: selectedVariantData, quantity }
                    });
                    dispatch({ type: "OPEN_CART" });
                  }
                }}
                onBuyNow={() => {
                  if (selectedVariantData && product) {
                    dispatch({
                      type: "ADD_ITEM",
                      payload: { product, variant: selectedVariantData, quantity }
                    });
                    navigate("/checkout");
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <ProductReviewsSection
            reviews={reviews}
            statistics={statistics}
            reviewsLoading={reviewsLoading}
          />
        </div>

        <RelatedProductsSection
          products={products}
          currentProductCategory={product.category}
          currentProductId={product.id}
        />
      </main>
    </div>
  );
};

export default ProductDetailPage;