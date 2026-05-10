import React from "react";
import { ProductImageGalleryProps } from "../../types/ProductDetails";

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    images,
    selectedImage,
    onImageSelect,
    badge
}) => (
    <div className="flex flex-col lg:flex-row-reverse gap-4 h-fit lg:sticky lg:top-24">
        {/* Main Image Container */}
        <div className="flex-1 relative aspect-[5/5] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center">
            <img
                src={images?.[selectedImage] || "/placeholder-product.png"}
                className="w-full h-full object-contain p-0"
            />
            {badge && (
                <div className="absolute top-6 right-6 bg-brand-brown text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                    {badge}
                </div>
            )}
        </div>

        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide pb-2 lg:pb-0 lg:w-24">
            {images?.map((img: string, index: number) => (
                <button
                    key={index}
                    onClick={() => onImageSelect(index)}
                    className={`relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all
            ${selectedImage === index ? "border-brand-brown scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                    <img src={img || "/placeholder-product.png"} className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
    </div>
);

export default ProductImageGallery;