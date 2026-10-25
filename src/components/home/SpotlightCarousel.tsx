'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Settings,
  ArrowRight,
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { OfferBanner } from '@/types';

interface SpotlightCarouselProps {
  banners: OfferBanner[];
  onSelectProduct: (productId: string, weight?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenBannerManager?: () => void;
}

export default function SpotlightCarousel({
  banners,
  onSelectProduct,
  onSelectCategory,
  onOpenBannerManager,
}: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch & Swipe Gesture State for Mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchEndYRef = useRef<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  const minSwipeDistance = 35; // minimum horizontal distance in px to trigger slide

  const safeBanners = banners && banners.length > 0 ? banners : [];
  const currentBanner = safeBanners[currentIndex] || safeBanners[0];

  // Auto-advance logic
  useEffect(() => {
    if (safeBanners.length <= 1 || isPaused || isSwiping) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeBanners.length, isPaused, isSwiping]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (safeBanners.length <= 1) return;
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchStartYRef.current = e.targetTouches[0].clientY;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
    setIsSwiping(true);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    touchEndXRef.current = currentX;
    touchEndYRef.current = currentY;

    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Apply horizontal offset when predominantly moving horizontally
    if (Math.abs(diffX) > Math.abs(diffY)) {
      const cappedDelta = Math.max(-80, Math.min(80, diffX));
      setTouchDeltaX(cappedDelta);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setIsSwiping(false);

    if (
      touchStartXRef.current !== null &&
      touchEndXRef.current !== null &&
      touchStartYRef.current !== null &&
      touchEndYRef.current !== null
    ) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      const diffY = touchStartYRef.current - touchEndYRef.current;

      // Horizontal swipe detected
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          // Swiped left -> Next slide
          handleNext();
        } else {
          // Swiped right -> Previous slide
          handlePrev();
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
    setTouchDeltaX(0);
  };

  // Mouse Drag Handlers for Desktop Touchpad / DevTools Simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (safeBanners.length <= 1) return;
    setIsPaused(true);
    isDraggingRef.current = true;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
    setIsSwiping(true);
    setTouchDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    touchEndXRef.current = currentX;
    touchEndYRef.current = currentY;

    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      const cappedDelta = Math.max(-80, Math.min(80, diffX));
      setTouchDeltaX(cappedDelta);
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleTouchEnd();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (Math.abs(touchDeltaX) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleExploreCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Math.abs(touchDeltaX) > 10) return;
    if (currentBanner?.category) {
      onSelectCategory(currentBanner.category);
    } else if (currentBanner?.productId) {
      onSelectProduct(currentBanner.productId, currentBanner.weight);
    }
  };

  const handleQuickViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Math.abs(touchDeltaX) > 10) return;
    if (currentBanner?.productId) {
      onSelectProduct(currentBanner.productId, currentBanner.weight);
    }
  };

  if (safeBanners.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#0C2B1D] text-white pt-2.5 sm:pt-4 pb-3.5 sm:pb-8 px-2.5 sm:px-6 lg:px-8 border-b border-[#1C523B] relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-2.5 sm:space-y-4">
        {/* Top Fee Ribbon / Exclusivity Badge */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#174630] via-[#1F5C40] to-[#174630] border border-[#C59B27]/40 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 shadow-md">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs font-bold tracking-wide truncate">
            <span className="p-0.5 sm:p-1 rounded bg-[#C59B27] text-[#0C2B1D] shadow-xs shrink-0">
              <BadgePercent className="w-3 h-3 sm:w-4 sm:h-4 text-[#0C2B1D]" />
            </span>
            <span className="text-[#F5E6BF] font-extrabold hidden xs:inline">EXCLUSIVE MILL SAVINGS:</span>
            
            {/* 0 Platform Fee */}
            <span className="text-white bg-black/35 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs border border-white/10 shrink-0">
              Platform Fee: <span className="line-through text-red-300">₹23</span>{' '}
              <strong className="text-[#4ADE80]">₹0 FREE</strong>
            </span>
            
            <span className="text-white/40 hidden sm:inline">•</span>
            
            {/* 0 Delivery Fee */}
            <span className="text-white bg-black/35 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs border border-white/10 shrink-0">
              Delivery Fee: <span className="line-through text-red-300">₹70</span>{' '}
              <strong className="text-[#4ADE80]">₹0 FREE</strong>
            </span>
            
            <span className="text-white/40 hidden md:inline">•</span>
            
            <span className="text-white bg-black/35 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs border border-white/10 shrink-0 hidden md:inline">
              COD: <strong className="text-[#4ADE80]">FREE</strong>
            </span>
            
            <span className="text-[10px] sm:text-xs bg-[#C59B27]/20 text-[#FFD875] border border-[#C59B27]/50 px-2 py-0.5 rounded-full font-bold ml-1 hidden lg:inline-flex items-center gap-1">
              💵 DIRECT WHOLESALE
            </span>
          </div>

          {/* Right Badge - Pure Wholesale Mill Assurance (Admin edit button removed from public storefront) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] sm:text-[11px] font-bold text-[#FFD875] bg-black/30 border border-[#C59B27]/40 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
              <span className="hidden xs:inline">Zero Middlemen</span>
              <span className="xs:hidden">Wholesale</span>
            </span>
          </div>
        </div>

        {/* Category Tabs Switcher Strip */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#FFD875] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C59B27]" />
            Categories:
          </span>
          {safeBanners.map((b, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={b.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#C59B27] text-[#0C2B1D] shadow-lg scale-105 ring-1 sm:ring-2 ring-[#FFD875]/60'
                    : 'bg-white/10 text-[#D5E6DC] hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                <span>{b.categoryName?.split('(')[0].trim() || b.brand}</span>
                {isActive && <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#0C2B1D]" />}
              </button>
            );
          })}
        </div>

        {/* Gold Frame Spotlight Carousel Container */}
        <div
          className="relative shimmer-gold-border p-1 sm:p-1.5 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl glow-ambient transition-all"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Inner Carousel Content with Mobile Swipe & Touch Support */}
          <div
            className="group relative bg-gradient-to-br from-[#0A2317] via-[#0F3523] to-[#081B12] rounded-[10px] sm:rounded-[14px] md:rounded-[22px] overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleContainerClick}
            style={{
              transform: isSwiping && touchDeltaX !== 0 ? `translateX(${touchDeltaX * 0.45}px)` : 'none',
              transition: isSwiping ? 'none' : 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {/* Banner Media & Content Grid */}
            <div className="grid grid-cols-12 min-h-[160px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-[380px] lg:min-h-[420px]">
              {/* Text & Pitch Column - 7 cols on mobile, 7 cols on tablet, 6-7 on desktop */}
              <div className="col-span-7 sm:col-span-7 md:col-span-7 lg:col-span-6 p-2.5 xs:p-3.5 sm:p-6 lg:p-10 flex flex-col justify-between relative z-10 space-y-1.5 sm:space-y-4">
                <div className="space-y-1 sm:space-y-3">
                  {/* Category Pill & Badges */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    {currentBanner.categoryName && (
                      <span className="bg-[#C59B27] text-[#0C2B1D] text-[8px] xs:text-[9px] sm:text-xs font-black uppercase tracking-wider px-1.5 sm:px-3 py-0.5 sm:py-1 rounded sm:rounded-md shadow-xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-none">
                          {currentBanner.categoryName}
                        </span>
                      </span>
                    )}
                    {currentBanner.badge && (
                      <span className="bg-white/10 border border-white/25 text-[#FFD875] text-[8px] xs:text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-md truncate max-w-[70px] sm:max-w-none">
                        {currentBanner.badge}
                      </span>
                    )}
                    <span className="bg-[#1C523B] text-[#D5E6DC] text-[8px] xs:text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-md border border-[#2A6E52] truncate">
                      {currentBanner.discount || currentBanner.weight}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="font-serif text-xs xs:text-sm sm:text-2xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md line-clamp-2 sm:line-clamp-none">
                    {currentBanner.headline}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-[9px] xs:text-[11px] sm:text-sm lg:text-[15px] text-[#D5E6DC] leading-relaxed max-w-xl font-normal line-clamp-1 sm:line-clamp-2 hidden xs:block">
                    {currentBanner.subtitle || `${currentBanner.brand} — Direct mill cured rice in sealed 26kg sacks.`}
                  </p>

                  {/* Highlights Chips */}
                  {currentBanner.highlights && currentBanner.highlights.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-2 pt-1">
                      {currentBanner.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold bg-[#14472F] text-[#4ADE80] border border-[#2E8057] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                          <span>{h}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Action Buttons */}
                <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-1.5 sm:gap-3">
                  <button
                    onClick={handleExploreCategory}
                    className="px-2.5 xs:px-3 sm:px-5 py-1 xs:py-1.5 sm:py-3 rounded-lg sm:rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] font-extrabold text-[9px] xs:text-[10px] sm:text-sm shadow-md transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span>Shop {currentBanner.categoryName?.split('(')[0].trim() || 'Now'}</span>
                    <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    onClick={handleQuickViewProduct}
                    className="hidden sm:flex px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm transition-all items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-[#C59B27]" />
                    <span>Quick View Pack ({currentBanner.weight})</span>
                  </button>
                </div>
              </div>

              {/* Visual Image Column - 5 cols on mobile, 5 cols on tablet, 5-6 on desktop */}
              <div className="col-span-5 sm:col-span-5 md:col-span-5 lg:col-span-6 relative h-full min-h-[160px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-auto overflow-hidden bg-black/40">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.headline}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Gradient blend overlay on left of image */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F3523] via-transparent to-transparent opacity-90 md:opacity-100" />
                
                {/* Direct Price/Authenticity Pill on bottom right */}
                <div className="absolute bottom-1.5 right-1.5 sm:bottom-4 sm:right-4 bg-black/85 backdrop-blur-md border border-[#C59B27]/60 px-1.5 py-0.5 sm:px-4 sm:py-2 rounded-md sm:rounded-xl text-right shadow-xl">
                  <div className="text-[7px] xs:text-[8px] sm:text-[10px] text-[#FFD875] uppercase tracking-wider font-extrabold flex items-center gap-0.5 sm:gap-1 justify-end">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                    <span>Direct Mill</span>
                  </div>
                  <div className="text-white font-serif font-black text-[9px] xs:text-[11px] sm:text-base">
                    {currentBanner.discount}
                  </div>
                </div>
              </div>
            </div>

            {/* Left & Right Arrow Navigation Controls (Responsive for Touch and Desktop) */}
            {safeBanners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-[#C59B27] hover:text-[#0C2B1D] text-white backdrop-blur-md border border-white/20 sm:border-white/30 items-center justify-center transition-all opacity-75 sm:opacity-85 hover:opacity-100 active:scale-90 hover:scale-110 shadow-lg z-20 cursor-pointer"
                  aria-label="Previous Category Banner"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-[#C59B27] hover:text-[#0C2B1D] text-white backdrop-blur-md border border-white/20 sm:border-white/30 items-center justify-center transition-all opacity-75 sm:opacity-85 hover:opacity-100 active:scale-90 hover:scale-110 shadow-lg z-20 cursor-pointer"
                  aria-label="Next Category Banner"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </>
            )}

            {/* Slide Indicators, Counter & Swipe Hint */}
            {safeBanners.length > 1 && (
              <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-black/75 backdrop-blur-md px-2 sm:px-3.5 py-0.5 sm:py-1.5 rounded-full border border-white/15 z-20 shadow-md">
                {safeBanners.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-4 sm:w-6 bg-[#C59B27]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
                <span className="text-[8px] sm:text-[10px] font-mono text-[#FFD875] font-bold ml-0.5 sm:ml-1">
                  0{currentIndex + 1} / 0{safeBanners.length}
                </span>
                <span className="text-[7.5px] text-[#AECDBB] font-semibold hidden xs:inline sm:hidden ml-1">
                  • Swipe ↔
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Trust Ribbons: POWERED BY & PAY LATER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
          {/* Powered By Trust Ribbon */}
          <div className="bg-[#103322] border border-[#1E523A] rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-2 sm:gap-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27] shrink-0" />
            <div className="text-[10px] sm:text-xs">
              <span className="text-[#FFD875] font-bold uppercase tracking-wider">Certified: </span>
              <span className="text-[#D5E6DC]">
                AP AGMARK • Sri Venkateswara Modern Rice Mill (Kolapakkam)
              </span>
            </div>
          </div>

          {/* Pay Later / COD Assurance Ribbon */}
          <div className="bg-[#103322] border border-[#1E523A] rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-2 sm:gap-3 shadow-xs">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ADE80] shrink-0" />
            <div className="text-[10px] sm:text-xs">
              <span className="text-[#4ADE80] font-bold uppercase tracking-wider">Pay on Delivery: </span>
              <span className="text-[#D5E6DC]">
                Check bag aroma at doorstep • Pay UPI or Cash
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
