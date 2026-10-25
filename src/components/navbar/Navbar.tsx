'use client';

import React, { useState } from 'react';
import {
  Home,
  ShoppingBag,
  Sparkles,
  Truck,
  Info,
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  Clock,
  ShieldCheck,
  Star
} from 'lucide-react';
import { StoreInfo } from '@/types';
import { WhatsAppIcon, GrainLogoIcon } from '@/components/common/Icons';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: Record<string, any>) => void;
  totalCartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  storeInfo: StoreInfo;
  onWhatsAppOrder: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  totalCartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  storeInfo,
  onWhatsAppOrder,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string, extra?: Record<string, any>) => {
    onNavigate(view, extra);
    setMobileMenuOpen(false);
  };

  const handleSearchInput = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === '#admin' || trimmed === '#portal' || trimmed === '*admin' || trimmed === '/admin') {
      onSearchChange('');
      handleNav('admin');
      return;
    }
    onSearchChange(val);
    if (currentView !== 'products') handleNav('products');
  };

  return (
    <>
      {/* Top Bar / Mill Notice */}
      <div className="bg-[#0C2B1D] text-[#E6E2D8] text-xs py-1.5 px-4 border-b border-[#1C523B]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#C59B27] text-[#0C2B1D] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              Wholesale Mandy &amp; Modern Mill
            </span>
            <span className="text-[11px] sm:text-xs text-[#FFD875] font-semibold tracking-wide">
              || {storeInfo.invocation || "ஸ்ரீ குழந்தை அம்மன் துணை"} ||
            </span>
            <span className="hidden lg:inline text-[11px] text-[#D5E6DC]">
              • 26kg Direct Mill Sacks • Exclusively Delivering Across Chennai City &amp; Suburbs
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-[#AECDBB]">
            <a
              href={`tel:${storeInfo.whatsappNumber}`}
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-[#C59B27]" />
              <span>
                Mandi: <strong className="text-white font-semibold">99621 19810</strong>
              </span>
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <a
              href="tel:9500014516"
              className="hidden sm:flex items-center gap-1 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-[#C59B27]" />
              <span>
                Office: <strong className="text-white font-semibold">95000 14516</strong>
              </span>
            </a>
            <span className="hidden md:inline text-white/30">|</span>
            <button
              onClick={() => handleNav('track')}
              className="hidden md:flex items-center gap-1 text-[#E6E2D8] hover:text-[#C59B27] transition font-semibold cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#C59B27]" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6E2D8] shadow-xs transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 h-20 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FBF9F5] border border-[#C59B27]/70 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-[#C59B27] transition-all overflow-hidden shrink-0">
              <img
                src={storeInfo.logo || "/images/logo.png"}
                alt={storeInfo.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-sm sm:text-base lg:text-lg font-black tracking-tight text-[#133E2B] whitespace-nowrap">
                  {storeInfo.name}
                </span>
                <span className="hidden 2xl:inline-block text-[9px] bg-[#FEF9EB] text-[#A27B16] border border-[#E6CE8A] px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                  Estd. {storeInfo.established}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] sm:text-[11px] text-[#133E2B] font-bold tracking-wide flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></span>
                  <span>{storeInfo.tamilName || "ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி"}</span>
                </p>
                <span className="text-[10px] text-[#A27B16] font-bold uppercase tracking-wider hidden 2xl:inline">
                  • Rice Wholesale
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Offers removed from Navbar as requested) */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-bold text-[#19241F] shrink min-w-0">
            <button
              onClick={() => handleNav('home')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#EAF3EE] text-[#133E2B] font-bold shadow-xs border border-[#133E2B]/15'
                  : 'hover:bg-gray-100 hover:text-[#133E2B]'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${currentView === 'home' ? 'text-[#133E2B]' : 'text-[#7C8D83]'}`} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNav('products')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'products'
                  ? 'bg-[#EAF3EE] text-[#133E2B] font-bold shadow-xs border border-[#133E2B]/15'
                  : 'hover:bg-gray-100 hover:text-[#133E2B]'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${currentView === 'products' ? 'text-[#133E2B]' : 'text-[#7C8D83]'}`} />
              <span>Products</span>
            </button>

            <button
              onClick={() => handleNav('track')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'track'
                  ? 'bg-[#EAF3EE] text-[#133E2B] font-bold shadow-xs border border-[#133E2B]/15'
                  : 'hover:bg-gray-100 hover:text-[#133E2B]'
              }`}
            >
              <Truck className={`w-3.5 h-3.5 ${currentView === 'track' ? 'text-[#133E2B]' : 'text-[#7C8D83]'}`} />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => handleNav('reviews')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'reviews'
                  ? 'bg-[#EAF3EE] text-[#133E2B] font-bold shadow-xs border border-[#133E2B]/15'
                  : 'hover:bg-gray-100 hover:text-[#133E2B]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${currentView === 'reviews' ? 'text-[#C59B27] fill-[#C59B27]' : 'text-[#7C8D83]'}`} />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                currentView === 'about'
                  ? 'bg-[#EAF3EE] text-[#133E2B] font-bold shadow-xs border border-[#133E2B]/15'
                  : 'hover:bg-gray-100 hover:text-[#133E2B]'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${currentView === 'about' ? 'text-[#133E2B]' : 'text-[#7C8D83]'}`} />
              <span>About Us</span>
            </button>
          </nav>

          {/* Right Utility Actions - WhatsApp & Cart ALWAYS Visible */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search rice..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-28 lg:w-36 xl:w-44 text-xs pl-7 pr-6 py-2 rounded-full border border-[#E6E2D8] bg-[#FBF9F5] focus:outline-none focus:border-[#133E2B] focus:bg-white transition-all text-[#19241F]"
              />
              <Search className="absolute left-2.5 top-2.5 text-[#7C8D83] w-3 h-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-2 text-[#7C8D83] text-xs hover:text-black font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* WhatsApp Quick Order Button - Always Visible */}
            <button
              onClick={onWhatsAppOrder}
              className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-150 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title={
                totalCartCount > 0
                  ? `Take ${totalCartCount} selected item(s) to WhatsApp`
                  : 'Order directly on WhatsApp'
              }
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span className="hidden sm:inline">
                {totalCartCount > 0 ? `WhatsApp (${totalCartCount})` : 'WhatsApp Order'}
              </span>
              <span className="sm:hidden">
                {totalCartCount > 0 ? `WA (${totalCartCount})` : 'WA'}
              </span>
              {totalCartCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse hidden xl:inline-block"></span>
              )}
            </button>

            {/* WhatsApp Order Bag Button - Always Visible */}
            <button
              onClick={onOpenCart}
              className="shrink-0 relative px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white flex items-center gap-1.5 sm:gap-2 text-xs font-bold transition shadow-sm hover:shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="View WhatsApp Order Bag"
            >
              <ShoppingCart className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span className="bg-[#C59B27] text-[#0C2B1D] text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-[#E6E2D8] text-[#19241F] hover:bg-gray-100 transition cursor-pointer shrink-0"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-[#E6E2D8] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fade-in">
            {/* Mobile Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pb-1">
              <button
                onClick={() => { onWhatsAppOrder(); setMobileMenuOpen(false); }}
                className="bg-[#25D366] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>WhatsApp {totalCartCount > 0 ? `(${totalCartCount})` : 'Order'}</span>
              </button>
              <button
                onClick={() => { onOpenCart(); setMobileMenuOpen(false); }}
                className="bg-[#133E2B] text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#C59B27]" />
                <span>Cart {totalCartCount > 0 ? `(${totalCartCount})` : ''}</span>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search 1121, Sona Masuri, Ponni..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E6E2D8] bg-[#FBF9F5] text-[#19241F] focus:outline-none focus:border-[#133E2B]"
              />
              <Search className="absolute left-3 top-3 text-[#7C8D83] w-3.5 h-3.5" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleNav('home')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-[#EAF3EE] border-[#133E2B] text-[#133E2B] font-bold'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 text-[#133E2B]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNav('products')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'products'
                    ? 'bg-[#EAF3EE] border-[#133E2B] text-[#133E2B] font-bold'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#133E2B]" />
                <span>Products</span>
              </button>

              <button
                onClick={() => handleNav('track')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'track'
                    ? 'bg-[#EAF3EE] border-[#133E2B] text-[#133E2B] font-bold'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Truck className="w-4 h-4 text-[#133E2B]" />
                <span>Track Order</span>
              </button>

              <button
                onClick={() => handleNav('reviews')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'reviews'
                    ? 'bg-[#EAF3EE] border-[#133E2B] text-[#133E2B] font-bold'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Star className="w-4 h-4 text-[#C59B27]" />
                <span>Customer Reviews</span>
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'about'
                    ? 'bg-[#EAF3EE] border-[#133E2B] text-[#133E2B] font-bold'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="w-4 h-4 text-[#133E2B]" />
                <span>About Us</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
