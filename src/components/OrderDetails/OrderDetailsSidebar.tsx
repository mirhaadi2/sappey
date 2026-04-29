import React from "react";
import { OrderDetailsShippingDossier, OrderDetailsCancelButton } from "./index";
import { OrderDetailsSidebarProps } from "../../types/OrderDetailsPage";
import { LogisticsTimeline } from "./index";

const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
    timelineData,
    trackingNumber,
    shippingDossier,
    cancelButton
}) => {
    return (
        <div className="lg:col-span-4 space-y-8">
            <LogisticsTimeline timelineData={timelineData} trackingNumber={trackingNumber} />
            <OrderDetailsShippingDossier {...shippingDossier} />
            <OrderDetailsCancelButton {...cancelButton} />
        </div>
    );
};

export default OrderDetailsSidebar;