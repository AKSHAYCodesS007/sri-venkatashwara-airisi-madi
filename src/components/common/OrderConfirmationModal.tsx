'use client';

import React, { useState } from 'react';
import { Order, StoreInfo } from '@/types';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Truck,
  ArrowRight,
  ShoppingBag,
  X,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  whatsappUrl: string;
  storeInfo: StoreInfo;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export default function OrderConfirmationModal({
  isOpen,
  order,
  whatsappUrl,
  storeInfo,
  onClose,
  onTrackOrder,
}: OrderConfirmationModalProps) {
  const [copied, setCopied] = useState(false);
  const [openedWhatsApp, setOpenedWhatsApp] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyId = () => {
    if (order.orderId) {
      const idToCopy = order.orderId.startsWith('#') ? order.orderId : `#${order.orderId}`;
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleOpenWhatsApp = () => {
    setOpenedWhatsApp(true);
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleGoToTracking = () => {
    onClose();
    onTrackOrder(order.orderId);
  };

  const displayId = order.orderId.startsWith('#') ? order.orderId : `#${order.orderId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#C59B27]/30 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-scale-up">
        
        {/* Top Header Banner */}
        <div className="bg-[#0C2B1D] text-white p-5 sm:p-6 text-center relative border-b border-[#1C523B]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-black text-white tracking-tight">
            Order Registered Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-[#AECDBB] mt-1 max-w-sm mx-auto">
            Vanakkam! Your rice bag order is logged with our Chennai mandi dispatch system.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* PROMINENT ORDER NUMBER CARD */}
          <div className="bg-gradient-to-br from-[#FEF9EB] to-[#FBF2DA] border-2 border-[#C59B27] rounded-2xl p-4 sm:p-5 text-center shadow-sm relative overflow-hidden">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#8F6B12] mb-1">
              Your Order Tracking ID
            </div>
            
            <div className="font-mono text-3xl sm:text-4xl font-black text-[#133E2B] tracking-wider my-1">
              {displayId}
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer bg-white text-[#133E2B] border border-[#C59B27]/40 hover:bg-[#FAF6EC] shadow-2xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Copy Order ID</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-[#7A6430] mt-2 font-medium">
              Save this Order ID to track your paddy cleaning, bagging & doorstep delivery in Chennai.
            </p>
          </div>

          {/* Items Summary Box */}
          <div className="bg-[#FBF9F5] rounded-xl border border-[#E6E2D8] p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider pb-1.5 border-b border-[#E6E2D8]">
              <span>Order Summary</span>
              <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} Bag(s)</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#133E2B]/10 text-[#133E2B] flex items-center justify-center font-bold text-[10px]">
                      {item.quantity}×
                    </span>
                    <div>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-gray-500 text-[11px] ml-1.5 font-normal">({item.weight})</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E6E2D8] flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block">Total Payable</span>
                <span className="text-[11px] text-emerald-700 font-medium">Cash / UPI on Arrival</span>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-black text-[#133E2B]">
                  ₹{order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Location Callout */}
          <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Chennai Doorstep Delivery Schedule</p>
              <p className="text-[11px] text-emerald-800/90 mt-0.5">
                Our mill delivery vehicle is dispatched across Chennai daily. Now share this order on WhatsApp to confirm your preferred delivery time.
              </p>
            </div>
          </div>

          {/* Status Message if WhatsApp already opened */}
          {openedWhatsApp && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 text-center">
              <span className="font-bold">✓ WhatsApp Chat Initiated!</span>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Order <span className="font-mono font-bold">{displayId}</span> has been saved. You can monitor live progress using the tracking button below.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F9F7F2] border-t border-[#E6E2D8] space-y-2">
          {/* Big WhatsApp Call to Action */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
            <span>
              {openedWhatsApp ? 'Re-open WhatsApp Chat' : `Continue to WhatsApp (${displayId})`}
            </span>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleGoToTracking}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#EAF3EE] text-[#133E2B] border border-[#133E2B]/20 hover:border-[#133E2B] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#133E2B]" />
              <span>Track Order Live</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-gray-200/70 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
