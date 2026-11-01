'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface HeroSectionProps {
  onNavigateToCatalog: () => void;
  onWhatsAppOrder: () => void;
  totalCartCount?: number;
}

const HERO_IMAGES = [
  {
    id: 'sacks-scoop',
    src: '/images/hero/rice-sacks-scoop.jpg',
    alt: 'Authentic burlap jute sacks of white rice with wooden scoop and golden paddy stalks',
    label: '100% Sortex Cleaned Sacks',
    tag: 'Mill Sacks',
  },
  {
    id: 'paddy-texture',
    src: '/images/hero/paddy-grains-texture.jpg',
    alt: 'Golden ears of paddy stalks lying across white rice grains texture',
    label: 'Golden Paddy Harvest',
    tag: 'Direct Harvest',
  },
  {
    id: 'hands-heart',
    src: '/images/hero/hands-holding-rice-heart.jpg',
    alt: 'Two hands cupping pure white rice grains in a heart shape',
    label: 'Pure & Handpicked Quality',
    tag: 'Pure Grains',
  },
  {
    id: 'pouch-scoop',
    src: '/images/hero/rice-pouch-bamboo-scoop.jpg',
    alt: 'Burlap pouch overflowing with rice grains onto bamboo winnowing tray with paddy stalks',
    label: 'Traditional Winnowed Rice',
    tag: 'Farm Fresh',
  },
];

export default function HeroSection({
  onNavigateToCatalog,
  onWhatsAppOrder,
  totalCartCount = 0,
}: HeroSectionProps) {
  const [activeImage, setActiveImage] = useState(HERO_IMAGES[0]);

  return (
    <section className="relative bg-gradient-to-b from-[#FAF4E4] via-[#F8EABA] to-[#FAF5E6] pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden border-b border-[#F0DC9B]/40">
      
      {/* Sweeping organic golden & light-green radial glows in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#F5DE98]/45 blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[650px] h-[650px] rounded-full bg-[#52B82E]/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-[#EFC967]/30 blur-3xl" />

        {/* Ambient yellow & orange circular accent dots */}
        <div className="absolute top-28 right-[18%] w-5 h-5 rounded-full bg-[#F5A623] opacity-90 shadow-xs animate-pulse" />
        <div className="absolute bottom-24 right-[8%] w-6 h-6 rounded-full bg-[#F39C12] opacity-80 shadow-md" />
        <div className="absolute top-44 left-[46%] w-3.5 h-3.5 rounded-full bg-[#E67E22] opacity-70" />

        {/* Scattered decorative natural rice grain silhouettes */}
        <svg className="absolute top-10 left-[28%] w-8 h-8 text-[#A88424]/20 rotate-45" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.5 5 7 10 9 15c1.5 3.5 4 6 7 7 1.5-3 1-8-1-12-1.5-3-2.5-6-3-8z" />
        </svg>
        <svg className="absolute bottom-20 left-[12%] w-10 h-10 text-[#A88424]/25 -rotate-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.5 5 7 10 9 15c1.5 3.5 4 6 7 7 1.5-3 1-8-1-12-1.5-3-2.5-6-3-8z" />
        </svg>
        <svg className="absolute top-20 right-[42%] w-7 h-7 text-[#52B82E]/25 rotate-30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 8C8 10 5 16 8 21c3-2 8-5 10-10 .5-1.5.5-2.5-.5-3z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & Vibrant Light Green CTA */}
          <div className="md:col-span-7 lg:col-span-6 space-y-4 sm:space-y-6 text-center md:text-left pt-2 sm:pt-4">
            
            {/* Super Badge / Invocation with Gold & Light Green */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF9EB] border border-[#E6CE8A] text-[#8C6914] text-xs font-bold tracking-wider uppercase shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#52B82E] animate-pulse" />
              <span>|| ஸ்ரீ குழந்தை அம்மன் துணை || Pan-India Mill Direct Mandy</span>
            </div>

            {/* Big Bold Headline matching screenshot */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-[#1C2520] tracking-tight leading-[1.12]">
              Sri Venkateshwara<br />
              <span className="text-[#388A1C] text-transparent bg-clip-text bg-gradient-to-r from-[#2F7D18] via-[#52B82E] to-[#C59B27]">
                Arisi Mandy
              </span>
            </h1>

            {/* Subtitle matching reference text and emphasis */}
            <p className="text-sm sm:text-base lg:text-lg text-[#334138] leading-relaxed max-w-xl mx-auto md:mx-0 font-normal">
              Delivering great <strong className="font-extrabold text-[#111827]">Tasting</strong> and{' '}
              <strong className="font-extrabold text-[#111827]">Quality</strong> rice products for our customers and consumers is our sole focus.
            </p>

            <p className="text-xs sm:text-sm text-[#5C6D63] font-medium max-w-lg mx-auto md:mx-0">
              Direct mill wholesale supply in authentic 26kg sacks from Kundrathur Main Road, Chiikkarayapuram godowns. 100% Sortex cleaned grains delivered to homes, caterers and businesses all over India.
            </p>

            {/* Vibrant Light Green Pill Button */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#52B82E] hover:bg-[#439E23] active:bg-[#38881C] text-white text-base sm:text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group select-none"
              >
                <span>Explore Rice Varieties</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onWhatsAppOrder}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#F4F9F5] text-[#133E2B] border-2 border-[#C59B27]/40 hover:border-[#52B82E] text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>
                  {totalCartCount > 0
                    ? `Cart (${totalCartCount}) • Order on WhatsApp`
                    : 'WhatsApp Desk'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Artwork Composition incorporating all 4 uploaded user images */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center items-center relative select-none mt-6 md:mt-0">
            <div className="relative w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center">
              
              {/* Back Golden-Green Radial Accent Glow */}
              <div className="absolute w-[86%] h-[86%] rounded-full bg-gradient-to-br from-[#FDE89D] via-[#F4CF68] to-[#52B82E]/30 opacity-70 blur-md transform scale-105" />

              {/* Main Central Circular Window */}
              <div className="relative w-[76%] h-[76%] rounded-full overflow-hidden shadow-2xl border-4 sm:border-[6px] border-white/95 bg-[#FAF7F0] transition-all duration-500">
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  key={activeImage.id}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle dark gradient overlay at bottom for stamp legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Inner Centered Stamp */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#C59B27]/50 shadow-md whitespace-nowrap">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-[#133E2B] tracking-wider flex items-center gap-1.5">
                    <span className="text-[#C59B27]">🌾</span> {activeImage.label}
                  </span>
                </div>
              </div>

              {/* Satellite 1 (Top-Right): Paddy Grains on White Rice Texture */}
              <button
                type="button"
                onClick={() => setActiveImage(HERO_IMAGES[1])}
                className={`absolute -top-1 sm:-top-2 right-1 sm:right-4 w-22 h-22 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl border-3 sm:border-4 bg-white transition-all duration-300 cursor-pointer ${
                  activeImage.id === HERO_IMAGES[1].id
                    ? 'border-[#52B82E] ring-4 ring-[#52B82E]/30 scale-105'
                    : 'border-white/95 hover:scale-110 hover:border-[#C59B27]'
                }`}
                title="View Golden Paddy Harvest"
              >
                <img
                  src={HERO_IMAGES[1].src}
                  alt={HERO_IMAGES[1].alt}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Satellite 2 (Bottom-Right): Cupped Hands with Heart-Shaped Rice */}
              <button
                type="button"
                onClick={() => setActiveImage(HERO_IMAGES[2])}
                className={`absolute -bottom-2 sm:-bottom-3 right-0 sm:right-3 w-22 h-22 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl border-3 sm:border-4 bg-white transition-all duration-300 cursor-pointer ${
                  activeImage.id === HERO_IMAGES[2].id
                    ? 'border-[#52B82E] ring-4 ring-[#52B82E]/30 scale-105'
                    : 'border-white/95 hover:scale-110 hover:border-[#C59B27]'
                }`}
                title="View Pure & Handpicked Quality"
              >
                <img
                  src={HERO_IMAGES[2].src}
                  alt={HERO_IMAGES[2].alt}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Satellite 3 (Bottom-Left): Jute Pouch, Bamboo Winnowing Tray & Paddy */}
              <button
                type="button"
                onClick={() => setActiveImage(HERO_IMAGES[3])}
                className={`absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-3 w-22 h-22 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl border-3 sm:border-4 bg-white transition-all duration-300 cursor-pointer ${
                  activeImage.id === HERO_IMAGES[3].id
                    ? 'border-[#52B82E] ring-4 ring-[#52B82E]/30 scale-105'
                    : 'border-white/95 hover:scale-110 hover:border-[#C59B27]'
                }`}
                title="View Traditional Winnowed Rice"
              >
                <img
                  src={HERO_IMAGES[3].src}
                  alt={HERO_IMAGES[3].alt}
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Floating Amber & Orange Accent Dots */}
              <div className="absolute top-10 left-6 sm:left-10 w-4 h-4 rounded-full bg-[#F39C12] shadow-lg animate-bounce" />
              <div className="absolute bottom-16 right-[-8px] w-3 h-3 rounded-full bg-[#E67E22] shadow-md opacity-80" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Wave Transition into Pure White Content */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-16 text-white preserve-3d"
        >
          <path
            d="M0,32 C280,75 520,10 800,45 C1080,80 1260,20 1440,50 L1440,80 L0,80 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
