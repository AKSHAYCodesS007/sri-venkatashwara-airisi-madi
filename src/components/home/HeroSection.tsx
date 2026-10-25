'use client';

import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Award,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface HeroSectionProps {
  onNavigateToCatalog: () => void;
  onWhatsAppOrder: () => void;
  totalCartCount?: number;
}

export default function HeroSection({
  onNavigateToCatalog,
  onWhatsAppOrder,
  totalCartCount = 0,
}: HeroSectionProps) {
  return (
    <section className="relative bg-[#FBF9F5] pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-[#E6E2D8] overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#133E2B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Super Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#EAF3EE] border border-[#133E2B]/20 text-[#133E2B] text-[10px] sm:text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C59B27] animate-pulse"></span>
              <span className="truncate">|| ஸ்ரீ குழந்தை அம்மன் துணை || Rice Wholesale Merchant • Exclusively in Chennai</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#133E2B] tracking-tight leading-snug sm:leading-[1.18]">
              Direct Mill-Fresh Rice,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59B27] to-[#A27B16]">
                Wholesale 26kg Sacks
              </span>{' '}
              Delivered Exclusively Across Chennai.
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-base text-[#56645C] leading-relaxed max-w-2xl font-normal">
              Direct from <strong>Sri Venkateshwara Arisi Mandy</strong> (Kundrathur Main Road, Chiikkarayapuram) and <strong>Sri Venkateswara Modern Rice Mill</strong> (Kolapakkam). Pure, sortex-cleaned Boiled, Steam, Raw, and Idly rice in authentic 26kg sacks delivered exclusively to homes and kitchens across Chennai.
            </p>

            {/* Quality Seals List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-0.5 sm:pt-1">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#19241F]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B27] flex-shrink-0" />
                <span>Zero Liquid Paraffin or Chemical Polish</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#19241F]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B27] flex-shrink-0" />
                <span>Milled &amp; Cleaned Only Upon Order</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#19241F]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B27] flex-shrink-0" />
                <span>Direct Mill Wholesale Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#19241F]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B27] flex-shrink-0" />
                <span>Doorstep Delivery Across Chennai City Only</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                onClick={onNavigateToCatalog}
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B27]" />
                <span>Browse Rice Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
              </button>

              <button
                onClick={onWhatsAppOrder}
                className="px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                title={
                  totalCartCount > 0
                    ? `Take ${totalCartCount} item(s) to WhatsApp`
                    : 'Select products on website to order via WhatsApp'
                }
              >
                <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span>
                  {totalCartCount > 0
                    ? `Take ${totalCartCount} Item(s) to WhatsApp`
                    : 'Order via WhatsApp'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#C59B27]/40 shadow-xl bg-white p-2">
              <div className="relative h-56 sm:h-80 md:h-96 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80"
                  alt="Aged Royal Basmati and Sona Masuri Grains"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Floating Authentic Logo Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-lg border border-[#C59B27]/50 flex items-center gap-2.5">
                  <img
                    src="/images/logo.png"
                    alt="Sri Venkateshwara Arisi Mandy Logo"
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                  />
                  <div className="text-left pr-1">
                    <span className="text-[10px] font-black uppercase text-[#133E2B] tracking-wider block">
                      Sri Venkateshwara
                    </span>
                    <span className="text-[9px] text-[#A27B16] font-bold block">
                      Arisi Mandy • Chennai
                    </span>
                  </div>
                </div>

                {/* Floating Authentic Stamp */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-[#C59B27]/40 text-center">
                  <Award className="w-5 h-5 text-[#C59B27] mx-auto mb-1" />
                  <span className="text-[10px] font-black uppercase text-[#133E2B] tracking-wider block">
                    100% SORTEX
                  </span>
                  <span className="text-[9px] text-gray-500 font-semibold block">Mill Direct Sacks</span>
                </div>

                {/* Bottom Highlight Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#FFD875] tracking-wider block">
                        Direct Mill 26kg Sacks
                      </span>
                      <h4 className="font-serif font-bold text-sm text-white">
                        Boiled, Steam, Raw &amp; Idly Rice
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-300 block">Sacks From</span>
                      <span className="text-[#4ADE80] font-bold text-base">₹1,140 / 26kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-10 pt-6 border-t border-[#E6E2D8] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white rounded-xl border border-[#E6E2D8]/80 shadow-2xs">
            <span className="font-serif text-2xl font-black text-[#133E2B] block">12,400+</span>
            <span className="text-xs text-[#56645C] font-medium">Delighted Households</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E6E2D8]/80 shadow-2xs">
            <span className="font-serif text-2xl font-black text-[#C59B27] block">24 Months</span>
            <span className="text-xs text-[#56645C] font-medium">Natural Godown Ageing</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E6E2D8]/80 shadow-2xs">
            <span className="font-serif text-2xl font-black text-[#133E2B] block">4.9 / 5.0</span>
            <span className="text-xs text-[#56645C] font-medium">Pure Aroma Verified</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E6E2D8]/80 shadow-2xs">
            <span className="font-serif text-2xl font-black text-[#1C523B] block">48 Hours</span>
            <span className="text-xs text-[#56645C] font-medium">Milled-to-Door Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}