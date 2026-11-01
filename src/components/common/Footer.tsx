'use client';

import React, { useState } from 'react';
import { StoreInfo } from '@/types';
import { GrainLogoIcon, WhatsAppIcon } from './Icons';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

interface FooterProps {
  storeInfo: StoreInfo;
  onNavigate: (view: string) => void;
}

export default function Footer({ storeInfo, onNavigate }: FooterProps) {
  const [secretClicks, setSecretClicks] = useState(0);

  // Secret Easter-Egg: Clicking the copyright text 3 times opens the Admin Portal
  const handleSecretClick = () => {
    const next = secretClicks + 1;
    if (next >= 3) {
      setSecretClicks(0);
      onNavigate('admin');
    } else {
      setSecretClicks(next);
      setTimeout(() => setSecretClicks(0), 1800);
    }
  };
  return (
    <footer className="bg-[#0A2317] text-white border-t border-[#1C523B]">
      {/* Top Assistance Banner */}
      <div className="bg-[#103322] border-b border-[#1C523B] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59B27] text-[#0C2B1D] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">
                Direct Mill Supply &amp; Delivery Exclusively Across Chennai
              </h4>
              <p className="text-xs text-[#AECDBB]">
                Delivering 26kg sacks directly to homes, caterers &amp; restaurants across Chennai city and suburbs.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
              'Namaste Mill Desk! I would like to inquire about fresh paddy milling & bulk rice orders.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer flex-shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Chat on WhatsApp ({storeInfo.displayPhone})</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-[#C59B27] flex items-center justify-center flex-shrink-0 shadow-sm">
                <img
                  src={storeInfo.logo || "/images/logo.png"}
                  alt={storeInfo.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#FFD875] font-bold tracking-wider block">
                  || {storeInfo.invocation || "ஸ்ரீ குழந்தை அம்மன் துணை"} ||
                </span>
                <span className="font-serif text-lg sm:text-xl font-black tracking-tight text-white block">
                  {storeInfo.name}
                </span>
                <span className="text-xs text-[#C59B27] font-semibold block">
                  {storeInfo.tamilName || "ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி"} • Estd. {storeInfo.established}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#C2D7CB] leading-relaxed max-w-sm">
              Wholesale rice merchant &amp; modern rice mill supplying pure, sortex-cleaned boiled, steam, raw, and idly rice in wholesale 26kg sacks direct from mill godowns exclusively across Chennai and surrounding suburbs.
            </p>

            <div className="p-3 rounded-xl bg-[#0D2E1F] border border-[#1C523B] space-y-1 text-xs">
              <p className="text-[#FFD875] font-bold">
                {storeInfo.proprietor || "G. Venkatesan Naicker"}
              </p>
              <p className="text-[11px] text-[#AECDBB]">
                {storeInfo.proprietorTamil || "G. வெங்கடேசன் நாயக்கர்"} — {storeInfo.proprietorTitle || "Managing Proprietor"}
              </p>
              <p className="text-[11px] text-[#AECDBB] pt-1">
                GSTIN: <strong className="text-white font-mono">{storeInfo.gstin}</strong>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-[#FFD875] uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2 text-[#C2D7CB]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Home &amp; Spotlight Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition cursor-pointer"
                >
                  All Rice Varieties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Customer Reviews &amp; Ratings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition cursor-pointer"
                >
                  About Us &amp; Mill Locations
                </button>
              </li>
            </ul>
          </div>

          {/* Grain Collections */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-[#FFD875] uppercase tracking-wider">Paddy Specialties</h5>
            <ul className="space-y-2 text-[#C2D7CB]">
              <li>Kurnool Sona Masuri (18 Mo. Aged)</li>
              <li>1121 XXL Royal Basmati</li>
              <li>BPT 5204 Low-GI Sona Masuri</li>
              <li>Thanjavur Ponni Boiled Rice</li>
              <li>Seeraga Samba (Biryani Rice)</li>
              <li>Kavuni Black &amp; Red Matta Rice</li>
            </ul>
          </div>

          {/* Mill & Mandi Contact */}
          <div className="space-y-4 text-xs lg:col-span-1">
            <h5 className="font-bold text-[#FFD875] uppercase tracking-wider">Contact &amp; Locations</h5>
            <div className="space-y-3 text-[#C2D7CB]">
              <div>
                <span className="font-bold text-white block text-[11px] mb-0.5">
                  📍 Wholesale Mandi (Main Office):
                </span>
                <p className="text-[11px] leading-relaxed">
                  {storeInfo.address}
                </p>
                <div className="flex flex-col gap-0.5 mt-1 text-[#FFD875] font-semibold text-[11px]">
                  <a href="tel:9962119810" className="hover:text-white transition">📞 99621 19810</a>
                  <a href="tel:9500014516" className="hover:text-white transition">📞 95000 14516</a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C523B]">
                <span className="font-bold text-white block text-[11px] mb-0.5">
                  🏭 Sri Venkateswara Modern Rice Mill:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {storeInfo.millAddress || "No.1/247, Vanniyar Street, Kolapakkam, Chennai - 600128"}
                </p>
                <div className="flex flex-col gap-0.5 mt-1 text-[#FFD875] font-semibold text-[11px]">
                  <a href="tel:9840280459" className="hover:text-white transition">📞 98402 80459</a>
                  <a href="tel:8300230459" className="hover:text-white transition">📞 83002 30459</a>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C523B] space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                  <a href={`mailto:${storeInfo.email}`} className="hover:text-white truncate">
                    {storeInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                  <span>{storeInfo.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1C523B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7C8D83] gap-3">
          <p
            onClick={handleSecretClick}
            className="cursor-default select-none"
            title=""
          >
            © {new Date().getFullYear()} {storeInfo.name}. All rights reserved. Direct Farm-to-Kitchen Supply.
          </p>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Milled with care for your family table</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
