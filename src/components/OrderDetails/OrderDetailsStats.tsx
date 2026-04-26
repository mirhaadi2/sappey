import React from "react";
import { Package, CalendarBlank, Truck, SealCheck } from "@phosphor-icons/react";
import { OrderDetailsStatsProps } from "../../types/OrderDetailsPage";

const OrderDetailsStats: React.FC<OrderDetailsStatsProps> = ({ itemCount, orderDate }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Package} label="SKU Count" value={`${itemCount} Items`} />
            <StatCard icon={CalendarBlank} label="Ordered" value={orderDate} />
            <StatCard icon={Truck} label="Carrier" value="Premium Logistics" />
            <StatCard icon={SealCheck} label="Authenticity" value="Verified" />
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
        <Icon size={22} weight="duotone" className="text-brand-brown" />
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </div>
);

export default OrderDetailsStats;