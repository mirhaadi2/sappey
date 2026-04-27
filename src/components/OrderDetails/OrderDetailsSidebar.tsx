import React from "react";
import OrderDetailsShippingDossier from "./OrderDetailsShippingDossier";
import OrderDetailsCancelButton from "./OrderDetailsCancelButton";
import { OrderDetailsSidebarProps } from "../../types/OrderDetailsPage";
import { LogisticsTimeline } from "./index";

const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
    timelineData,
    shippingDossier,
    cancelButton
}) => {
    return (
        <div className="lg:col-span-4 space-y-8">
            <LogisticsTimeline timelineData={timelineData} />
            <OrderDetailsShippingDossier {...shippingDossier} />
            <OrderDetailsCancelButton {...cancelButton} />
        </div>
    );
};

export default OrderDetailsSidebar;