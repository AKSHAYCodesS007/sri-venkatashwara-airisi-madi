'use client';

import React, { useState } from 'react';
import {
  Home,
  ShoppingBag,
  Truck,
  Info,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Star
} from 'lucide-react';
import { StoreInfo } from '@/types';
import { WhatsAppIcon } from '@/components/common/Icons';

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
      <div className="bg-[#FAF5E9] text-[#222E26] text-xs py-1.5 px-3 sm:px-6 border-b border-[#EADFC7] w-full max-w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="bg-[#52B82E] text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1 shadow-2xs shrink-0">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Wholesale Mandy</span>
            </span>
            <span className="text-[10px] sm:text-xs text-[#8C6914] font-bold tracking-wide truncate">
              || {storeInfo.invocation || "ஸ்ரீ குழந்தை அம்மன் துணை"} ||
            </span>
            <span className="hidden lg:inline text-[11px] text-[#55695E] truncate">
              • 26kg Direct Mill Sacks • Exclusively Across Chennai City &amp; Suburbs
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#475A4F] shrink-0">
            <a
              href={`tel:${storeInfo.whatsappNumber}`}
              className="flex items-center gap-1 hover:text-[#52B82E] transition font-bold"
            >
              <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#52B82E]" />
              <span className="whitespace-nowrap">
                <span className="hidden xs:inline">Mandi: </span>99621 19810
              </span>
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <button
              onClick={() => handleNav('track')}
              className="hidden md:flex items-center gap-1 hover:text-[#52B82E] transition font-bold cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#52B82E]" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar matching warm cream aesthetic */}
      <header className="sticky top-0 z-40 bg-[#FAF5E9]/95 backdrop-blur-md border-b border-[#EADFC7] shadow-xs transition-all w-full max-w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Title */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#EADFC7] p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-all overflow-hidden shrink-0">
              <img
                src={storeInfo.logo || "/images/logo.png"}
                alt={storeInfo.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xs sm:text-base lg:text-lg font-black tracking-tight text-[#111827] leading-tight truncate block">
                  {storeInfo.name}
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#52B82E] font-bold tracking-wide flex items-center gap-1 leading-tight truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B82E] shrink-0" />
                <span className="truncate">{storeInfo.tamilName || "ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி"}</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-bold text-[#222E26] shrink min-w-0">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-[#111827] font-black shadow-xs border border-[#EADFC7]'
                  : 'hover:bg-white/60 hover:text-[#111827]'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${currentView === 'home' ? 'text-[#52B82E]' : 'text-gray-500'}`} />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNav('products')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'products'
                  ? 'bg-white text-[#111827] font-black shadow-xs border border-[#EADFC7]'
                  : 'hover:bg-white/60 hover:text-[#111827]'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${currentView === 'products' ? 'text-[#52B82E]' : 'text-gray-500'}`} />
              <span>Our Rice Products</span>
            </button>

            <button
              onClick={() => handleNav('track')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'track'
                  ? 'bg-white text-[#111827] font-black shadow-xs border border-[#EADFC7]'
                  : 'hover:bg-white/60 hover:text-[#111827]'
              }`}
            >
              <Truck className={`w-3.5 h-3.5 ${currentView === 'track' ? 'text-[#52B82E]' : 'text-gray-500'}`} />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => handleNav('reviews')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'reviews'
                  ? 'bg-white text-[#111827] font-black shadow-xs border border-[#EADFC7]'
                  : 'hover:bg-white/60 hover:text-[#111827]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${currentView === 'reviews' ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-500'}`} />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'about'
                  ? 'bg-white text-[#111827] font-black shadow-xs border border-[#EADFC7]'
                  : 'hover:bg-white/60 hover:text-[#111827]'
              }`}
            >
              <Info className={`w-3.5 h-3.5 ${currentView === 'about' ? 'text-[#52B82E]' : 'text-gray-500'}`} />
              <span>About Mandi</span>
            </button>
          </nav>

          {/* Right Action Controls: Search, WhatsApp & Shopping Bag Pill matching screenshot */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search rice..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-28 lg:w-36 xl:w-44 text-xs pl-7 pr-6 py-1.5 rounded-full border border-[#EADFC7] bg-white focus:outline-none focus:border-[#52B82E] transition-all text-[#19241F]"
              />
              <Search className="absolute left-2.5 top-2 text-gray-400 w-3 h-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1.5 text-gray-400 text-xs hover:text-black font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Direct WhatsApp Pill */}
            <button
              onClick={onWhatsAppOrder}
              className="inline-flex items-center gap-1 sm:gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
              title="Order directly on WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Shopping Bag Icon with Count Pill matching screenshot `🛍️ 0` */}
            <button
              onClick={onOpenCart}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-gray-50 border border-[#EADFC7] text-[#111827] flex items-center gap-1.5 sm:gap-2 text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 group"
              title="View Cart"
              aria-label="View Shopping Cart"
            >
              <span className="text-sm sm:text-base leading-none">🛍️</span>
              <span className="font-black text-xs sm:text-sm text-[#111827]">{totalCartCount}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-lg border border-[#EADFC7] bg-white text-[#19241F] hover:bg-gray-50 transition cursor-pointer shrink-0"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF5E9] border-b border-[#EADFC7] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fade-in">
            {/* Mobile Search */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search AKS Bullet, Ponni, Idly..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#EADFC7] bg-white text-[#19241F] focus:outline-none focus:border-[#52B82E]"
              />
              <Search className="absolute left-3 top-3 text-gray-400 w-3.5 h-3.5" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => handleNav('home')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-white border-[#52B82E] text-[#111827]'
                    : 'bg-white/70 border-[#EADFC7] text-gray-700 hover:bg-white'
                }`}
              >
                <Home className="w-4 h-4 text-[#52B82E]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNav('products')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'products'
                    ? 'bg-white border-[#52B82E] text-[#111827]'
                    : 'bg-white/70 border-[#EADFC7] text-gray-700 hover:bg-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#52B82E]" />
                <span>Products</span>
              </button>

              <button
                onClick={() => handleNav('track')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'track'
                    ? 'bg-white border-[#52B82E] text-[#111827]'
                    : 'bg-white/70 border-[#EADFC7] text-gray-700 hover:bg-white'
                }`}
              >
                <Truck className="w-4 h-4 text-[#52B82E]" />
                <span>Track Order</span>
              </button>

              <button
                onClick={() => handleNav('reviews')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'reviews'
                    ? 'bg-white border-[#52B82E] text-[#111827]'
                    : 'bg-white/70 border-[#EADFC7] text-gray-700 hover:bg-white'
                }`}
              >
                <Star className="w-4 h-4 text-[#F5A623]" />
                <span>Reviews</span>
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`p-2.5 rounded-lg flex items-center gap-2 border transition cursor-pointer ${
                  currentView === 'about'
                    ? 'bg-white border-[#52B82E] text-[#111827]'
                    : 'bg-white/70 border-[#EADFC7] text-gray-700 hover:bg-white'
                }`}
              >
                <Info className="w-4 h-4 text-[#52B82E]" />
                <span>About Us</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
