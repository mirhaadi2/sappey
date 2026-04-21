import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "../context/CardContext";
import { useWebsiteAuth } from "../contexts/WebsiteAuthContext";

const CheckoutHeader: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { currentUser, isGuestAuthenticated, guestDisplayName } = useWebsiteAuth();
  const isLoggedIn = Boolean(currentUser || isGuestAuthenticated);
  const displayName = currentUser?.name?.split(" ")[0] || guestDisplayName || "Guest";

  return (
    <div className="bg-white border-b border-slate-100 sticky z-40 top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 font-headline font-black text-2xl text-brand-brown tracking-tighter transition-all duration-300">
          <img src="/images/sappey-logo-4.png" alt="SAPPEY Logo" width="120" height="40" />
        </Link>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
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

          {/* User Greeting */}
          {isLoggedIn && (
            <button
              // onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-brand-brown/5 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-brown">{displayName}</span>
              <div className="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center text-[11px] font-bold">
                {displayName.charAt(0)}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
