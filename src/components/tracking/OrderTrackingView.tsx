'use client';

import React, { useState, useEffect } from 'react';
import { Order, StoreInfo } from '@/types';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
  RotateCcw,
  Clock,
  ShieldCheck,
  X
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface OrderTrackingViewProps {
  orders: Order[];
  activeTrackingId?: string;
  storeInfo: StoreInfo;
  onWriteReview?: (productId?: string) => void;
}

const STEPS = [
  { step: 1, title: 'Order Placed', desc: 'Verified by Mill Desk' },
  { step: 2, title: 'Paddy Cleaned & Milled', desc: 'De-stoned & Bagged' },
  { step: 3, title: 'In Transit', desc: 'En route via logistics' },
  { step: 4, title: 'Delivered', desc: 'Doorstep Handover' },
];

export default function OrderTrackingView({
  orders,
  activeTrackingId,
  storeInfo,
  onWriteReview,
}: OrderTrackingViewProps) {
  const [searchInput, setSearchInput] = useState(activeTrackingId || '');
  const [searchedOrderId, setSearchedOrderId] = useState<string>(activeTrackingId || '');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(Boolean(activeTrackingId));
  const [inputError, setInputError] = useState<string>('');

  useEffect(() => {
    if (activeTrackingId) {
      setSearchInput(activeTrackingId);
      setSearchedOrderId(activeTrackingId);
      setSearchAttempted(true);
      setInputError('');
    }
  }, [activeTrackingId]);

  const cleanId = searchedOrderId.trim().replace(/^#/, '');

  const currentOrder = cleanId
    ? orders.find((o) => o.orderId.toLowerCase() === cleanId.toLowerCase())
    : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim().replace(/^#/, '');
    if (!trimmed) {
      setInputError('Please enter your Order ID (e.g. RS10248)');
      return;
    }
    setInputError('');
    setSearchedOrderId(trimmed);
    setSearchAttempted(true);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchedOrderId('');
    setSearchAttempted(false);
    setInputError('');
  };

  const handleWhatsAppInquiry = () => {
    if (!currentOrder) return;
    const msg = `Namaste Mill Desk! I would like to check the dispatch status for Order *#${currentOrder.orderId}* (Total: ₹${currentOrder.total}).`;
    const url = `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleWhatsAppNotFound = () => {
    const trimmed = searchInput.trim();
    const msg = `Namaste Mill Desk! I am trying to track my order ${trimmed ? `*#${trimmed}* ` : ''}on your website, but could not find the details. Could you please check?`;
    const url = `https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-12 bg-[#FBF9F5] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search Bar */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EE] border border-[#133E2B]/20 text-[#133E2B] text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#133E2B]" />
            <span>Mill Logistics Tracking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#133E2B]">
            Track Your Rice Order
          </h1>
          <p className="text-xs sm:text-sm text-[#56645C] max-w-lg mx-auto leading-relaxed">
            Enter your Order ID (e.g. <strong>RS10248</strong> or <strong>RS48291</strong>) to view live milling, packing, and doorstep transit details across Chennai.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto pt-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. RS10248)"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  className="w-full text-xs pl-9 pr-8 py-3 rounded-xl border border-[#E6E2D8] bg-white uppercase font-bold focus:outline-none focus:border-[#133E2B] shadow-2xs"
                  autoFocus={!activeTrackingId}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-black font-bold text-xs cursor-pointer"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Track</span>
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-red-600 font-semibold text-left pt-1.5 pl-1">
                {inputError}
              </p>
            )}
          </form>
        </div>

        {/* 1. STATE: Order Details Found */}
        {currentOrder && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] shadow-lg p-6 sm:p-8 space-y-8 animate-fade-in">
            {/* Top Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E2D8] gap-4">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Order Reference:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif text-2xl font-bold text-[#133E2B]">
                    #{currentOrder.orderId}
                  </h2>
                  <span className="bg-[#FEF9EB] text-[#A27B16] border border-[#E6CE8A] text-xs font-bold px-2 py-0.5 rounded">
                    {currentOrder.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  title="Search another order ID"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Track Another</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>WhatsApp Logistics Desk</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
                Current Milling &amp; Transit Stage
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {STEPS.map((s) => {
                  const isCompleted = currentOrder.currentStep >= s.step;
                  const isCurrent = currentOrder.currentStep === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`p-4 rounded-2xl border text-center relative transition ${
                        isCurrent
                          ? 'bg-[#EAF3EE] border-[#133E2B] shadow-sm'
                          : isCompleted
                          ? 'bg-[#FBF9F5] border-emerald-300'
                          : 'bg-white border-gray-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-[#133E2B] text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900">{s.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6E2D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#133E2B]">
                  <MapPin className="w-4 h-4 text-[#C59B27]" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {currentOrder.deliveryAddress}
                </p>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Placed on: {currentOrder.date}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E6E2D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#133E2B]">
                  <Package className="w-4 h-4 text-[#C59B27]" />
                  <span>Payment &amp; Verification</span>
                </div>
                <p className="text-xs text-gray-700">
                  Method: <strong>{currentOrder.paymentMethod}</strong>
                </p>
                <p className="text-xs text-gray-700">
                  Total Order Value: <strong className="text-emerald-700 font-serif">₹{currentOrder.total}</strong>
                </p>
              </div>
            </div>

            {/* Items Included */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Bags Packed for this Order
              </h4>
              <div className="space-y-2">
                {currentOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#E6E2D8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <span className="text-[11px] text-gray-500 ml-2">
                        Pack: {item.weight} × {item.quantity} bag(s)
                      </span>
                    </div>
                    <span className="font-bold text-[#133E2B]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Invitation Banner */}
            <div className="p-4 rounded-2xl bg-[#EAF3EE] border border-[#133E2B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#133E2B] flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
                  <span>How was the aroma &amp; cooking quality?</span>
                </span>
                <p className="text-[11px] text-[#56645C]">
                  Share your experience with Chennai households and restaurants.
                </p>
              </div>
              {onWriteReview && (
                <button
                  type="button"
                  onClick={() => onWriteReview(currentOrder.items[0]?.name ? undefined : undefined)}
                  className="px-4 py-2 rounded-xl bg-[#133E2B] text-white font-bold hover:bg-[#1C523B] transition shadow-xs shrink-0 cursor-pointer"
                >
                  Rate &amp; Review Order
                </button>
              )}
            </div>

            {/* Tracking Log Timeline */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Mill Activity Log
              </h4>
              <div className="space-y-3">
                {currentOrder.trackingUpdates && currentOrder.trackingUpdates.length > 0 ? (
                  currentOrder.trackingUpdates.map((u, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#C59B27] mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-900">{u.status}</strong>
                          <span className="text-[10px] text-gray-400">{u.time}</span>
                        </div>
                        <span className="text-[11px] text-gray-500">{u.location}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Order confirmed. Dispatch in progress.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. STATE: Search Attempted but Not Found */}
        {searchAttempted && !currentOrder && (
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-10 text-center max-w-lg mx-auto shadow-sm space-y-4 animate-fade-in">
            <div className="w-14 h-14 mx-auto bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Order #{cleanId || searchInput.trim()} Not Found
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                We could not find an order matching this ID in our system. Please check the spelling or order number given during checkout.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
              >
                Try Another ID
              </button>

              <button
                type="button"
                onClick={handleWhatsAppNotFound}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Inquire on WhatsApp Desk</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. STATE: Initial Clean State (No Order Searched Yet) */}
        {!searchAttempted && !currentOrder && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-[#FEF9EB] border border-[#E6CE8A] rounded-2xl flex items-center justify-center text-3xl shadow-2xs">
              📦
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-xl font-bold text-[#133E2B]">
                Enter Your Order Number to View Status
              </h3>
              <p className="text-xs text-[#56645C] max-w-md mx-auto leading-relaxed">
                When you place an order on our website or via WhatsApp, a 6 to 7-character Order ID (e.g., <strong>RS10248</strong>) is assigned. Enter it above to view live milling, packing, and courier dispatch updates.
              </p>
            </div>

            {/* 3 Benefit Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8] text-center space-y-1">
                <span className="text-base">🌾</span>
                <h4 className="text-[11px] font-bold text-[#133E2B] block">Fresh Milling</h4>
                <p className="text-[10px] text-gray-500">De-stoned &amp; sortex cleaned upon order.</p>
              </div>

              <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8] text-center space-y-1">
                <span className="text-base">🚚</span>
                <h4 className="text-[11px] font-bold text-[#133E2B] block">Chennai Transit</h4>
                <p className="text-[10px] text-gray-500">Direct doorstep delivery across Chennai.</p>
              </div>

              <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8] text-center space-y-1">
                <span className="text-base">💬</span>
                <h4 className="text-[11px] font-bold text-[#133E2B] block">WhatsApp Support</h4>
                <p className="text-[10px] text-gray-500">Direct mill desk assistance anytime.</p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-500">
              Need assistance? Chat directly with our mill desk on WhatsApp:{' '}
              <a
                href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent('Hello Mill Desk! I would like to inquire about tracking an order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#133E2B] font-bold hover:underline"
              >
                +{storeInfo.whatsappNumber}
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
