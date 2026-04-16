import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "../context/CardContext";

const CheckoutHeader: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <div className="bg-white border-b border-slate-100 sticky z-40 top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 font-headline font-black text-2xl text-brand-brown tracking-tighter transition-all duration-300">
          <img src="/images/sappey-logo-4.png" alt="SAPPEY Logo" width="120" height="40" />
        </Link>

        {/* Cart Icon */}
        <button
          onClick={() => navigate("/shop")}
          className="relative p-2 text-brand-brown hover:text-brand-cocoa transition-colors"
          title="Continue Shopping"
        >
          <ShoppingCart size={24} weight="bold" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-brand-brown text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutHeader;
