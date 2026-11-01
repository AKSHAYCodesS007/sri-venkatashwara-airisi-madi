'use client';

import React, { useState } from 'react';
import { StoreInfo } from '@/types';
import { WhatsAppIcon } from './Icons';
import { MapPin, Phone, Mail } from 'lucide-react';

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
    <footer className="mt-12 sm:mt-16 pb-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Big Vibrant Light Green Banner Container with Gold Accents */}
      <div className="bg-[#52B82E] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Mission & Mill Heritage */}
          <div className="md:col-span-7 space-y-3.5">
            <p className="text-white font-medium text-xs sm:text-sm md:text-base leading-relaxed">
              <strong className="font-black text-white">{storeInfo.name}</strong> is a Chennai based online store providing direct mill supply all over India. We are pledged to provide good quality rice across brands and hassle free doorstep delivery services according to customer needs.
            </p>
            <p className="text-white/95 text-xs sm:text-sm leading-relaxed">
              We handle different brands and varieties of rice especially indigenous rice varieties which are directly procured from Modern rice mills from all over India.
            </p>
            <div className="pt-2 text-white/90 text-xs border-t border-white/20 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Managing Proprietor: <strong className="font-bold text-[#FFD875]">{storeInfo.proprietor}</strong></span>
              <span>•</span>
              <span>GSTIN: <strong className="font-mono text-white">{storeInfo.gstin}</strong></span>
            </div>
          </div>

          {/* Right Column: Address & Direct Contacts */}
          <div className="md:col-span-5 space-y-2.5 md:pl-6 md:border-l md:border-white/25 text-xs sm:text-sm">
            <h4 className="font-black text-base sm:text-lg text-white mb-2">
              {storeInfo.name}
            </h4>
            
            <p className="text-white/95 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#FFD875]" />
              <span>Kundrathur Main Road, Chiikkarayapuram, Chennai - 600 069.</span>
            </p>

            <p className="text-white/95 flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0 text-[#FFD875]" />
              <span>Mobile: +91 99621 19810, +91 95000 14516</span>
            </p>

            <a
              href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
                '🌾 Vanakkam Sri Venkateshwara Arisi Mandy! I would like to place an order for 26kg rice sacks.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center gap-2.5 hover:underline"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0 text-white" />
              <span>Whatsapp: +91 99621 19810</span>
            </a>

            <p className="text-white/95 flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0 text-[#FFD875]" />
              <span>Email: srivenkateswaraarisimandy@gmail.com</span>
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Social Media Icons & Copyright */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 px-2">
        {/* Social Icons */}
        <div className="flex items-center gap-5 text-gray-800">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-[#52B82E] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-[#52B82E] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-[#52B82E] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-[#52B82E] transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* Copyright with 3-click secret admin easter-egg */}
        <div
          onClick={handleSecretClick}
          className="text-center sm:text-right cursor-pointer select-none text-gray-500 hover:text-gray-900 transition-colors text-xs font-semibold"
          title="Sri Venkateshwara Arisi Mandy (Triple-click for Secret Portal)"
        >
          © 2026 All rights reserved.
        </div>
      </div>
    </footer>
  );
}
