import React, { useEffect, useState } from "react";

export interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, fallbackSrc = "/images/product-placeholder.svg", onError, alt, ...props }) => {
    const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!src) {
            setCurrentSrc(fallbackSrc);
            return;
        }

        if (src === failedSrc) {
            setCurrentSrc(fallbackSrc);
            return;
        }

        setCurrentSrc(src);
    }, [src, fallbackSrc, failedSrc]);

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (event.currentTarget.src === fallbackSrc) {
            return;
        }

        setFailedSrc(src || null);
        setCurrentSrc(fallbackSrc);

        if (typeof onError === "function") {
            onError(event as any);
        }
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
