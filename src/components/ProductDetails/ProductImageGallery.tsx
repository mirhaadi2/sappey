import React from "react";
import { ProductImageGalleryProps } from "../../types/ProductDetails";

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    images,
    selectedImage,
    onImageSelect,
    badge
}) => {
    return (
        <div className="flex flex-col gap-5 w-full h-fit">
            {/* 1. Main Hero Image Container */}
            <div className="flex relative justify-center w-full md:h-[90vh]">
                <img
                    src={images?.[selectedImage] || "/placeholder-product.png"}
                    alt="Main Product"
                    className="max-w-full max-h-full w-auto h-auto rounded-lg object-contain mx-auto transition-all duration-300 ease-in-out"
                />

                {badge && (
                    <div className="absolute top-4 right-4 bg-brand-brown text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm z-10">
                        {badge}
                    </div>
                )}
            </div>

            {/* 2. Professional Bottom Thumbnails Row */}
            <div className="flex flex-row items-center justify-start gap-3 overflow-x-auto scrollbar-hide py-1">
                {images?.map((img: string, index: number) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onImageSelect(index)}
                        className={`
                            relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden 
                            border-2 transition-all duration-200
                            ${selectedImage === index
                                ? "border-brand-brown shadow-md scale-[0.98]"
                                : "border-slate-100 opacity-80 hover:opacity-100 hover:border-slate-200"
                            }
                        `}
                    >
                        <img
                            src={img || "/placeholder-product.png"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Selected Overlay */}
                        {selectedImage === index && (
                            <div className="absolute inset-0 bg-brand-brown/5" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;