'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Plus,
  HelpCircle
} from 'lucide-react';
import { WhatsAppIcon, GrainLogoIcon } from '@/components/common/Icons';
import { Product, StoreInfo } from '@/types';

interface SelectProductsPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCatalog: () => void;
  products: Product[];
  onAddToCartAndWhatsApp: (product: Product, weight: string, quantity: number) => void;
  onGeneralInquiry: () => void;
  storeInfo: StoreInfo;
}

export default function SelectProductsPromptModal({
  isOpen,
  onClose,
  onNavigateToCatalog,
  products,
  onAddToCartAndWhatsApp,
  onGeneralInquiry,
  storeInfo,
}: SelectProductsPromptModalProps) {
  // Quick pick selection state for recommended mill favorites
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Pick top 3 signature products for quick 1-click addition
  const featuredProducts = products.slice(0, 3);

  const handleSelectWeight = (prodId: string, weight: string) => {
    setSelectedWeights((prev) => ({ ...prev, [prodId]: weight }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#C59B27]/40 overflow-hidden flex flex-col text-[#19241F] relative max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] text-white px-6 pt-6 pb-5 relative border-b border-[#1C523B]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                WhatsApp Order System
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Select Rice Products First
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#C2D7CB] leading-relaxed">
            Before proceeding to WhatsApp, please select your rice varieties &amp; pack weights on the website. We will automatically package all your selected items with exact pricing and weights into your WhatsApp message!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* 3-Step Flow Visual */}
          <div className="grid grid-cols-3 gap-2 bg-[#FBF9F5] p-3 rounded-2xl border border-[#E6E2D8] text-center">
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#133E2B] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                1
              </div>
              <p className="text-[11px] font-bold text-[#133E2B]">Pick Variety</p>
              <p className="text-[9px] text-gray-500">Basmati, Sona, Ponni</p>
            </div>
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#133E2B] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                2
              </div>
              <p className="text-[11px] font-bold text-[#133E2B]">Choose Weight</p>
              <p className="text-[9px] text-gray-500">1kg, 5kg, 10kg, 25kg</p>
            </div>
            <div className="space-y-1">
              <div className="w-7 h-7 mx-auto rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                3
              </div>
              <p className="text-[11px] font-bold text-[#14532D]">Order on WA</p>
              <p className="text-[9px] text-gray-500">Zero typing needed</p>
            </div>
          </div>

          {/* Quick Mill Favorites Picker */}
          {featuredProducts.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#133E2B] uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Or 1-Click Pick a Mill Signature:</span>
                </span>
                <span className="text-[10px] text-gray-400">Popular items</span>
              </div>

              <div className="space-y-2">
                {featuredProducts.map((prod) => {
                  const currWeight = selectedWeights[prod.id] || prod.defaultWeight || prod.weights[0].weight;
                  const weightObj = prod.weights.find((w) => w.weight === currWeight) || prod.weights[0];

                  return (
                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl border border-gray-200 hover:border-[#133E2B]/40 bg-white shadow-2xs flex items-center justify-between gap-3 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-xs text-[#19241F] truncate">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-1">
                            {prod.weights.slice(0, 3).map((w) => (
                              <button
                                key={w.weight}
                                type="button"
                                onClick={() => handleSelectWeight(prod.id, w.weight)}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                                  currWeight === w.weight
                                    ? 'bg-[#133E2B] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {w.weight}
                              </button>
                            ))}
                          </div>
                          <span className="text-xs font-extrabold text-[#133E2B]">
                            ₹{weightObj.price}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onAddToCartAndWhatsApp(prod, currWeight, 1);
                          onClose();
                        }}
                        className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold flex items-center gap-1.5 transition shrink-0 shadow-xs cursor-pointer"
                        title="Add this item and order via WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        <span>Add &amp; Take to WA</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToCatalog();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
              <span>Browse Rice Catalog ({products.length} Varieties)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGeneralInquiry();
              }}
              className="w-full py-2 text-center text-xs text-gray-500 hover:text-black font-semibold underline underline-offset-4 cursor-pointer"
            >
              Have a general inquiry without items? Chat with Mill Staff →
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-[#FBF9F5] px-6 py-2.5 border-t border-gray-200 flex items-center justify-center gap-2 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Select varieties • Free Doorstep Delivery on ₹999+ • Pay Cash or UPI</span>
        </div>
      </div>
    </div>
  );
}
