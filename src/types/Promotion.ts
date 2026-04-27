import { Promotion } from "../api/promotions";

export interface PromotionCardProps {
    promotion: Promotion;
    discountAmount: number;
    isSelected?: boolean;
    onSelect?: (promotion: Promotion) => void;
    showDetails?: boolean;
}