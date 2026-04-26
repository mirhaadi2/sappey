import React from "react";
import { MapPin, Phone, Copy, CheckFat, Fingerprint } from "@phosphor-icons/react";
import { OrderDetailsShippingDossierProps } from "../../types/OrderDetailsPage";

const OrderDetailsShippingDossier: React.FC<OrderDetailsShippingDossierProps> = ({
    userName,
    shippingAddress,
    shippingPhone,
    onCopyPhone,
    copiedField
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-200/30">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Shipping Dossier</h3>
            <div className="space-y-10">
                <div>
                    <p className="text-[9px] font-black text-brand-brown/50 uppercase tracking-widest mb-3">Recipient Identity</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                            <Fingerprint size={20} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{userName}</p>
                    </div>
                </div>

                <div>
                    <p className="text-[9px] font-black text-brand-brown/50 uppercase tracking-widest mb-3">Destination</p>
                    <div className="flex gap-4">
                        <MapPin size={22} weight="duotone" className="text-slate-300 shrink-0 mt-1" />
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                            {shippingAddress.line1 && shippingAddress.city && (
                                <>
                                    {shippingAddress.line1}, {shippingAddress.city}<br />
                                </>
                            )}
                            {shippingAddress.state && shippingAddress.postalCode && (
                                <span className="text-slate-900 font-black">{shippingAddress.state} {shippingAddress.postalCode}</span>
                            )}
                        </p>
                    </div>
                </div>

                {shippingPhone && (
                    <button
                        onClick={() => onCopyPhone(shippingPhone)}
                        className="w-full flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:border-brand-brown transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-brand-brown/20 shadow-sm">
                                <Phone size={16} className="text-slate-400 group-hover:text-brand-brown" />
                            </div>
                            <span className="text-sm font-black text-slate-800">{shippingPhone}</span>
                        </div>
                        {copiedField === "phone" ? (
                            <CheckFat className="text-emerald-500" weight="fill" />
                        ) : (
                            <Copy size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsShippingDossier;