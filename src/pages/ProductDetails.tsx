import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useProduct, useProducts } from "../api/exports";
import { useCart } from "../context/CardContext";
import { useHomepagePromotions } from "../api/promotions";
import { ProductDetailSkeleton, ReviewSkeleton } from "../components/Skeletons";
import LazySection from "../components/LazySection";
import { ProductVariant } from "../types";
import {
  Star, Minus, Plus, ShoppingCart, Check,
  Truck, ArrowLeft, ShieldCheck,
  CaretRight, X, ClockCounterClockwise
} from "@phosphor-icons/react";

type DrawerType = "description" | "benefits" | "nutrition" | null;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const { products, isLoading: productsLoading } = useProducts(undefined);
  const { data: product, isLoading: productLoading } = useProduct(id!, true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Disable body scroll when drawer is open
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

  const isOutOfStock = selectedVariantData?.status === "out_of_stock";

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-x-hidden">

      {/* --- SLIDE-OUT DRAWER OVERLAY --- */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 bg-brand-brown/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-headline text-brand-brown capitalize tracking-tight">
                    {activeDrawer === "nutrition" ? "Nutritional Profile" : activeDrawer}
                  </h3>
                  <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-brand-brown">
                    <X size={24} weight="bold" />
                  </button>
                </div>

                <div className="prose prose-slate prose-sm max-w-none">
                  {(activeDrawer === "description" && product?.description) && (
                    <div className="text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: product.description }} />
                  )}

                  {activeDrawer === "benefits" && (
                    product.benefits && product.benefits.length > 0 ? (
                      <ul className="space-y-4 list-none p-0">
                        {product.benefits.map((b: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-slate-600">
                            <Check className="mt-1 text-emerald-500" weight="bold" size={14} />
                            <span className="text-sm">{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <ComingSoonPlaceholder label="Key Benefits" />
                  )}

                  {activeDrawer === "nutrition" && (
                    product.nutritionFacts && product.nutritionFacts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {product.nutritionFacts.map((fact: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{fact.label}</p>
                            <p className="text-xl font-headline font-bold text-brand-brown">{fact.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : <ComingSoonPlaceholder label="Nutritional Profile" />
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-4 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/shop")} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-brown/60 hover:text-brand-brown transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">

          {/* Left Column: Media Gallery (Side Thumbnails) */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row-reverse gap-4 h-fit lg:sticky lg:top-24">
            {/* Main Image Container */}
            <div className="flex-1 relative aspect-[5/5] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images?.[selectedImage] || "/placeholder-product.png"}
                className="w-full h-full object-contain p-0"
              />
              {product.badge && (
                <div className="absolute top-6 right-6 bg-brand-brown text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                  {product.badge}
                </div>
              )}
            </div>

            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide pb-2 lg:pb-0 lg:w-24">
              {product.images?.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all
                    ${selectedImage === index ? "border-brand-brown scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="space-y-8">
              <header>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight={i < Math.floor(product.rating || 0) ? "fill" : "regular"} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">({product.reviewCount || 0} VERIFIED REVIEWS)</span>
                </div>
                <h1 className="text-3xl font-headline text-brand-brown leading-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-medium text-brand-brown">
                    ₹{Number(selectedVariantData?.price || 0).toLocaleString('en-IN')}
                  </span>
                  {selectedVariantData?.originalPrice && (
                    <span className="text-lg text-slate-300 line-through">
                      ₹{Number(selectedVariantData.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </header>

              {/* Information Detail Buttons */}
              <div className="space-y-1 border-y border-slate-100 py-4">
                <DrawerButton label="Product Description" onClick={() => setActiveDrawer("description")} />
                <DrawerButton label="Key Benefits" onClick={() => setActiveDrawer("benefits")} />
                <DrawerButton label="Nutritional Profile" onClick={() => setActiveDrawer("nutrition")} />
              </div>

              {/* Variant Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Choose Size</label>
                <div className="flex flex-wrap gap-3">
                  <LayoutGroup>
                    {variantOptions.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(String(variant.id))}
                        className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-colors border
                          ${selectedVariantId === String(variant.id) ? "text-white border-transparent" : "text-brand-brown border-slate-200 hover:border-brand-brown"}`}
                      >
                        <span className="relative z-10">{variant.label || `${variant.weight}${variant.weightUnit}`}</span>
                        {selectedVariantId === String(variant.id) && (
                          <motion.div layoutId="activeVariant" className="absolute inset-0 bg-brand-brown rounded-xl z-0" transition={{ type: "spring", duration: 0.5 }} />
                        )}
                      </button>
                    ))}
                  </LayoutGroup>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="space-y-6 pt-4 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-brand-brown hover:bg-slate-50 rounded-xl transition-colors"><Minus weight="bold" /></button>
                    <span className="w-10 text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-brand-brown hover:bg-slate-50 rounded-xl transition-colors"><Plus weight="bold" /></button>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest">
                    {isOutOfStock ? <span className="text-red-500">Out of Stock</span> : <span className="text-emerald-600 flex items-center gap-1"><Check weight="bold" /> In Stock</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (selectedVariantData && product) {
                        dispatch({
                          type: "ADD_ITEM",
                          payload: {
                            product,
                            variant: selectedVariantData,
                            quantity
                          }
                        });
                        dispatch({ type: "OPEN_CART" });
                      }
                    }}
                    className="group relative overflow-hidden bg-brand-brown text-white h-12 rounded-2xl font-bold uppercase tracking-widest text-xs transition-transform active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2"><ShoppingCart size={20} /> Add To Bag</span>
                  </button>
                  <button
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (selectedVariantData && product) {
                        dispatch({
                          type: "ADD_ITEM",
                          payload: {
                            product,
                            variant: selectedVariantData,
                            quantity
                          }
                        });
                        navigate("/checkout");
                      }
                    }}
                    className="h-12 rounded-2xl border-2 border-brand-brown text-brand-brown font-bold uppercase tracking-widest text-xs hover:bg-brand-brown hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    Instant Buy
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-6 py-6 border-t border-slate-100">
                  <Badge icon={<Truck size={20} />} text={<>Complimentary <br />Shipping</>} />
                  <Badge icon={<ShieldCheck size={20} />} text={<>Quality <br />Guaranteed</>} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16">
            <LazySection fallback={<ReviewSkeleton />}>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-headline text-brand-brown mb-4">Customer Chronicles</h2>
                <p className="text-slate-400 text-sm">Honest experiences from our wellness community</p>
              </div>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {product.reviews?.map((review: any, i: number) => (
                  <div key={i} className="break-inside-avoid bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, s) => <Star key={s} size={12} weight={s < review.rating ? "fill" : "regular"} />)}
                      </div>
                    </div>
                    <p className="text-slate-600 italic text-sm leading-relaxed mb-6">"{review.comment}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <div className="w-8 h-8 rounded-full bg-brand-latte flex items-center justify-center text-[10px] font-black text-brand-brown uppercase">{review.author?.[0]}</div>
                      <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">{review.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </LazySection>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="mt-16">
            <LazySection fallback={<ReviewSkeleton />}>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-headline text-brand-brown mb-4">You Might Also Like</h2>
                <p className="text-slate-400 text-sm">Similar products from our curated collection</p>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                  {products
                    .filter((p: any) => p.category === product.category && p.id !== product.id)
                    .slice(0, 4)
                    .map((relatedProduct: any) => (
                      <motion.div
                        key={relatedProduct.id}
                        whileHover={{ y: -8 }}
                        onClick={() => {
                          navigate(`/shop/product/${relatedProduct.id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="cursor-pointer group h-full flex flex-col"
                      >
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                          {/* Product Image - Fixed height to keep layout consistent */}
                          <div className="h-48 bg-brand-latte overflow-hidden relative flex-shrink-0">
                            {relatedProduct.images?.[0] && (
                              <img
                                src={relatedProduct.images[0]}
                                alt={relatedProduct.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            )}
                          </div>

                          {/* Product Info - flex-1 allows this section to grow and fill space */}
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="font-headline text-brand-brown text-lg mb-2 line-clamp-2 group-hover:text-brand-cocoa transition-colors">
                              {relatedProduct.name}
                            </h3>

                            <p className="text-slate-400 text-xs mb-4 line-clamp-2">
                              {relatedProduct.description?.replace(/<[^>]*>/g, '')}
                            </p>

                            {/* mt-auto pushes everything below this point to the bottom of the card */}
                            <div className="mt-auto">
                              {/* Rating */}
                              {relatedProduct.rating && (
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, s) => (
                                      <Star
                                        key={s}
                                        size={12}
                                        weight={s < Math.floor(relatedProduct.rating) ? "fill" : "regular"}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    ({relatedProduct.reviews || 0})
                                  </span>
                                </div>
                              )}

                              {/* Price Section */}
                              {relatedProduct.variants && relatedProduct.variants.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-headline text-lg text-brand-brown">
                                    ₹{relatedProduct.variants[0]?.discountedPrice || relatedProduct.variants[0]?.price}
                                  </span>
                                  {relatedProduct.variants[0]?.price > (relatedProduct.variants[0]?.discountedPrice || relatedProduct.variants[0]?.price) && (
                                    <span className="text-slate-400 line-through text-sm">
                                      ₹{relatedProduct.variants[0]?.price}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <ComingSoonPlaceholder label="related products" />
              )}
            </LazySection>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Subcomponents for Cleaner Code ---

const DrawerButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button onClick={onClick} className="w-full flex justify-between items-center py-4 group transition-all border-b border-slate-50 last:border-none">
    <span className="text-xs font-bold uppercase tracking-widest text-brand-brown/70 group-hover:text-brand-brown">{label}</span>
    <CaretRight size={18} className="text-slate-300 group-hover:text-brand-brown group-hover:translate-x-1 transition-all" />
  </button>
);

const Badge = ({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-brand-latte rounded-lg text-brand-brown">{icon}</div>
    <span className="text-[10px] font-bold uppercase leading-tight text-slate-500">{text}</span>
  </div>
);

const ComingSoonPlaceholder = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-brown shadow-sm">
      <ClockCounterClockwise size={24} weight="duotone" className="animate-spin-slow" />
    </div>
    <div>
      <h4 className="font-headline text-brand-brown text-lg">Coming Soon</h4>
      <p className="text-slate-400 text-xs max-w-[200px] mx-auto">We are currently updating the {label} for this product.</p>
    </div>
  </div>
);

const NotFoundState = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center">
    <h1 className="text-5xl font-headline text-brand-brown mb-6">Item not found</h1>
    <button onClick={onBack} className="flex items-center gap-3 bg-brand-brown text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-cocoa transition-colors">
      <ArrowLeft /> Return to Shop
    </button>
  </div>
);

export default ProductDetailPage;