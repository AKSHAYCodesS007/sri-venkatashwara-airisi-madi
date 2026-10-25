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
  onOpenBannerManager: () => void;
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

  const safeBanners = banners && banners.length > 0 ? banners : [];
  const currentBanner = safeBanners[currentIndex] || safeBanners[0];

  // Auto-advance logic
  useEffect(() => {
    if (safeBanners.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeBanners.length, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (safeBanners.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeBanners.length);
  };

  const handleExploreCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBanner?.category) {
      onSelectCategory(currentBanner.category);
    } else if (currentBanner?.productId) {
      onSelectProduct(currentBanner.productId, currentBanner.weight);
    }
  };

  const handleQuickViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentBanner?.productId) {
      onSelectProduct(currentBanner.productId, currentBanner.weight);
    }
  };

  if (safeBanners.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#0C2B1D] text-white pt-4 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#1C523B] relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-3 sm:space-y-4">
        {/* Top Fee Ribbon / Exclusivity Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#174630] via-[#1F5C40] to-[#174630] border border-[#C59B27]/40 rounded-xl px-4 py-2.5 shadow-md">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide">
            <span className="p-1 rounded bg-[#C59B27] text-[#0C2B1D] shadow-xs">
              <BadgePercent className="w-4 h-4" />
            </span>
            <span className="text-[#F5E6BF]">EXCLUSIVE MILL SAVINGS:</span>
            <span className="text-white bg-black/30 px-2 py-0.5 rounded text-xs border border-white/10">
              Platform Fee <span className="line-through text-red-300">₹23</span>{' '}
              <strong className="text-[#4ADE80]">₹10</strong>
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white bg-black/30 px-2 py-0.5 rounded text-xs border border-white/10 hidden sm:inline-flex items-center gap-1">
              COD Fee <span className="line-through text-red-300">₹10</span>{' '}
              <strong className="text-[#4ADE80]">₹0 FREE</strong>
            </span>
            <span className="text-xs bg-[#C59B27]/20 text-[#FFD875] border border-[#C59B27]/50 px-2 py-0.5 rounded-full font-bold ml-1 hidden md:inline-flex items-center gap-1">
              💵 DIRECT WHOLESALE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBannerManager}
              className="text-xs font-semibold text-[#FFD875] hover:text-white bg-white/10 hover:bg-white/20 border border-[#C59B27]/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Manage banner promotions"
            >
              <Settings className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden sm:inline">Manage Offers</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>
        </div>

        {/* Category Tabs Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-[#FFD875] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C59B27]" />
            Categories:
          </span>
          {safeBanners.map((b, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={b.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#C59B27] text-[#0C2B1D] shadow-lg scale-105 ring-2 ring-[#FFD875]/60'
                    : 'bg-white/10 text-[#D5E6DC] hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                <span>{b.categoryName?.split('(')[0].trim() || b.brand}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0C2B1D]" />}
              </button>
            );
          })}
        </div>

        {/* Gold Frame Spotlight Carousel Container */}
        <div
          className="relative shimmer-gold-border p-1 sm:p-1.5 rounded-2xl md:rounded-3xl shadow-2xl glow-ambient transition-all"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Inner Carousel Content */}
          <div
            className="group relative bg-gradient-to-br from-[#0A2317] via-[#0F3523] to-[#081B12] rounded-[14px] md:rounded-[22px] overflow-hidden select-none transition-transform duration-300"
          >
            {/* Banner Media & Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px] md:min-h-[380px] lg:min-h-[420px]">
              {/* Text & Pitch Column */}
              <div className="md:col-span-7 lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10 space-y-4">
                <div className="space-y-3">
                  {/* Category Pill & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {currentBanner.categoryName && (
                      <span className="bg-[#C59B27] text-[#0C2B1D] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {currentBanner.categoryName}
                      </span>
                    )}
                    {currentBanner.badge && (
                      <span className="bg-white/10 border border-white/25 text-[#FFD875] text-xs font-bold px-2.5 py-1 rounded-md">
                        {currentBanner.badge}
                      </span>
                    )}
                    <span className="bg-[#1C523B] text-[#D5E6DC] text-xs font-bold px-2.5 py-1 rounded border border-[#2A6E52]">
                      {currentBanner.discount || currentBanner.weight}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                    {currentBanner.headline}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm lg:text-[15px] text-[#D5E6DC] leading-relaxed max-w-xl font-normal">
                    {currentBanner.subtitle || `${currentBanner.brand} — Direct mill cured rice, bagged in sealed 26kg sacks upon order verification.`}
                  </p>

                  {/* Highlights Chips */}
                  {currentBanner.highlights && currentBanner.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
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
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExploreCategory}
                    className="px-5 py-3 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] font-extrabold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Explore {currentBanner.categoryName?.split('(')[0].trim() || 'This Category'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleQuickViewProduct}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4 text-[#C59B27]" />
                    <span>Quick View Pack ({currentBanner.weight})</span>
                  </button>
                </div>
              </div>

              {/* Visual Image Column */}
              <div className="md:col-span-5 lg:col-span-6 relative h-64 md:h-auto overflow-hidden bg-black/40">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.headline}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Gradient blend overlay on left of image */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F3523] via-transparent to-transparent opacity-90 md:opacity-100" />
                
                {/* Direct Price/Authenticity Pill on bottom right */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-[#C59B27]/60 px-4 py-2 rounded-xl text-right shadow-xl">
                  <div className="text-[10px] text-[#FFD875] uppercase tracking-wider font-extrabold flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
                    <span>Direct Mill Harvest</span>
                  </div>
                  <div className="text-white font-serif font-black text-sm sm:text-base">
                    {currentBanner.discount}
                  </div>
                </div>
              </div>
            </div>

            {/* Left & Right Arrow Navigation Controls */}
            {safeBanners.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C59B27] hover:text-[#0C2B1D] text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 shadow-lg z-20 cursor-pointer"
                  aria-label="Previous Category Banner"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C59B27] hover:text-[#0C2B1D] text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all opacity-85 hover:opacity-100 hover:scale-110 shadow-lg z-20 cursor-pointer"
                  aria-label="Next Category Banner"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Slide Indicators and Progress */}
            {safeBanners.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 z-20">
                {safeBanners.map((b, idx) => (
                  <button
                    key={b.id || idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-[#C59B27]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
                <span className="text-[10px] font-mono text-[#FFD875] font-bold ml-1">
                  0{currentIndex + 1} / 0{safeBanners.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Trust Ribbons: POWERED BY & PAY LATER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Powered By Trust Ribbon */}
          <div className="bg-[#103322] border border-[#1E523A] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#C59B27] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <span className="text-[#FFD875] font-bold uppercase tracking-wider">Milled &amp; Certified By: </span>
              <span className="text-[#D5E6DC]">
                AP AGMARK • Sri Venkateswara Modern Rice Mill (Kolapakkam) • Traditional Godowns
              </span>
            </div>
          </div>

          {/* Pay Later / COD Assurance Ribbon */}
          <div className="bg-[#103322] border border-[#1E523A] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xs">
            <Truck className="w-5 h-5 text-[#4ADE80] shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <span className="text-[#4ADE80] font-bold uppercase tracking-wider">Inspect &amp; Pay Later: </span>
              <span className="text-[#D5E6DC]">
                Zero upfront payment required • Check bag aroma at doorstep • Pay UPI or Cash
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
