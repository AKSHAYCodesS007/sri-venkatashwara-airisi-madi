'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { WhatsAppIcon, GrainLogoIcon } from '@/components/common/Icons';
import { StoreInfo, UserProfile } from '@/types';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, phone: string) => void;
  onSkip: () => void;
  storeInfo: StoreInfo;
  onWhatsAppOrder: () => void;
  cartItemCount?: number;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  onLogin,
  onSkip,
  storeInfo,
  onWhatsAppOrder,
  cartItemCount = 0,
}: LoginPromptModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    const cleanName = fullName.trim() || 'Valued Customer';
    onLogin(cleanName, cleanPhone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#C59B27]/40 overflow-hidden flex flex-col text-[#19241F] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] text-white px-6 pt-6 pb-5 relative border-b border-[#1C523B]">
          {/* Close / Skip button in top right */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Skip and continue as Guest"
            aria-label="Skip login"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C523B] to-[#0C2B1D] border border-[#C59B27] flex items-center justify-center text-[#C59B27] shadow-sm">
              <GrainLogoIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                Direct From Mill
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                {storeInfo.name}
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#C2D7CB] leading-relaxed">
            Welcome! Log in to save delivery addresses and track orders, or skip and browse freely.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* 1. Login with Phone Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Enter Mobile Number</span>
                <span className="text-[10px] text-gray-400 font-normal">For instant order updates</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-gray-500">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrorMsg('');
                  }}
                  maxLength={10}
                  className="w-full text-xs pl-12 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] focus:ring-1 focus:ring-[#133E2B] font-semibold bg-[#FBF9F5]"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh Babu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5]"
                />
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue &amp; Log In</span>
              <ArrowRight className="w-4 h-4 text-[#C59B27]" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              OR ORDER WITHOUT LOGIN
            </span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* 2. Highlighted WhatsApp Instant Order (No Login Required) */}
          <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold text-[#14532D] uppercase tracking-wide">
                Direct WhatsApp Desk (No Login Needed)
              </span>
            </div>
            <p className="text-[11px] text-[#166534] leading-relaxed">
              {cartItemCount > 0
                ? `You have ${cartItemCount} item(s) in your cart! Send your complete order straight to WhatsApp without logging in.`
                : 'Select your preferred rice varieties on the website, and take your complete order to WhatsApp with 1 click without logging in!'}
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onWhatsAppOrder();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>
                {cartItemCount > 0
                  ? `Take ${cartItemCount} Selected Item(s) to WhatsApp`
                  : 'Select Products to Order on WhatsApp'}
              </span>
            </button>
          </div>

          {/* 3. Skip / Guest Action */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-bold text-gray-600 hover:text-black underline underline-offset-4 cursor-pointer py-1"
            >
              Skip for now &amp; Browse Rice Catalog →
            </button>
            <p className="text-[10px] text-gray-400 mt-1">
              You can still browse all varieties, add to cart, and order via WhatsApp anytime.
            </p>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-[#FBF9F5] px-6 py-2.5 border-t border-gray-200 flex items-center justify-center gap-2 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Secure • River Basin Aged Grains • Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
}
