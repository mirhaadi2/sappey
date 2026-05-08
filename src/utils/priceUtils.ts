export type PriceSource = {
    product?: Record<string, any>;
    variant?: Record<string, any>;
};

const sanitizeNumber = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? 0 : numberValue;
};

export const getGstRate = (source: PriceSource): number => {
    return sanitizeNumber(source?.variant?.gst_rate ?? source?.product?.gst_rate ?? 0);
};

export const getBasePrice = (source: PriceSource): number => {
    return sanitizeNumber(
        source?.variant?.discountedPrice ??
        source?.variant?.price ??
        source?.product?.discountedPrice ??
        source?.product?.price ??
        0
    );
};

export const getOriginalBasePrice = (source: PriceSource): number => {
    return sanitizeNumber(source?.variant?.price ?? source?.product?.price ?? 0);
};

export const getPriceWithGst = (price: number, gstRate: number): number => {
    const sanitizedPrice = sanitizeNumber(price);
    const sanitizedRate = sanitizeNumber(gstRate);
    return Math.round((sanitizedPrice * (1 + sanitizedRate / 100)) * 100) / 100;
};

export const getDisplayPrice = (source: PriceSource): number => {
    return getPriceWithGst(getBasePrice(source), getGstRate(source));
};

export const getOriginalDisplayPrice = (source: PriceSource): number => {
    return getPriceWithGst(getOriginalBasePrice(source), getGstRate(source));
};

export const getDisplayLineTotal = (source: PriceSource, quantity: number): number => {
    return getDisplayPrice(source) * Math.max(0, quantity);
};
