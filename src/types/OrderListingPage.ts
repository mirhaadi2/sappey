import type { Order } from "../api/orders/types";

export type SortBy = "date-newest" | "date-oldest" | "amount-high" | "amount-low";

export type OrderFilter = {
    status: Order["status"] | "ALL";
    dateFrom: string;
    dateTo: string;
};

export interface OrderListingStats {
    total: number;
    active: number;
}
