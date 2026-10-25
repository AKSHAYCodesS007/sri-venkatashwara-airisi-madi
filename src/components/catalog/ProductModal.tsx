'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Utensils
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  initialWeight?: string;
  onClose: () => void;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onDirectWhatsApp: (product: Product, weight: string, quantity: number) => void;
  onWriteReview?: (productId: string) => void;
}

export default function ProductModal({
  isOpen,
  product,
  initialWeight,
  onClose,
  onAddToCart,
  onDirectWhatsApp,
  onWriteReview,
}: ProductModalProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>('5kg');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product) {
      if (initialWeight && product.weights.some((w) => w.weight === initialWeight)) {
        setSelectedWeight(initialWeight);
      } else {
        setSelectedWeight(product.defaultWeight || product.weights[0]?.weight || '5kg');
      }
      setQuantity(1);
      setAddedNotice(false);
    }
  }, [product, initialWeight]);

  if (!isOpen || !product) return null;

  const currentWeightObj =
    product.weights.find((w) => w.weight === selectedWeight) ||
    product.weights[0] || {
      weight: '5kg',
      price: 300,
      originalPrice: 350,
    };

  const lineTotal = currentWeightObj.price * quantity;
  const originalLineTotal = currentWeightObj.originalPrice * quantity;
  const totalSavings = originalLineTotal - lineTotal;

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleWhatsApp = () => {
    onDirectWhatsApp(product, selectedWeight, quantity);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl md:rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C59B27]/40 flex flex-col text-[#19241F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#0C2B1D] text-white px-6 py-4 flex items-center justify-between border-b border-[#1C523B] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="bg-[#C59B27] text-[#0C2B1D] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Mill Direct Reserve
            </span>
            <span className="text-xs text-[#AECDBB]">Authenticity Guaranteed</span>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#E6E2D8] bg-[#F4F1EA] shadow-inner">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#133E2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {product.aging}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C59B27]" />
                  <span>{product.origin}</span>
                </div>
              </div>

              {/* Quality Guarantee Box */}
              <div className="bg-[#FBF9F5] border border-[#E6E2D8] rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#133E2B]">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                  <span>Mill Quality Standards</span>
                </div>
                <ul className="space-y-1 text-gray-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Cleaned &amp; De-stoned in ISO facility</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>0% Adulteration or Mineral Oil Coating</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Freshly packed in breathable food-grade bag</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#133E2B] bg-[#EAF3EE] px-2.5 py-0.5 rounded-md capitalize">
                    {product.category.replace(/-/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({product.reviewCount} customer reviews)</span>
                    {onWriteReview && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onWriteReview(product.id);
                        }}
                        className="ml-1 text-[11px] text-[#133E2B] hover:text-[#C59B27] font-bold underline cursor-pointer"
                      >
                        • Rate &amp; Review
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#19241F] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#56645C] mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Weight Pack Selector */}
              <div className="pt-2 border-t border-[#E6E2D8]">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Choose Pack Size:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.weights.map((w) => {
                    const isSelected = selectedWeight === w.weight;
                    return (
                      <button
                        key={w.weight}
                        onClick={() => setSelectedWeight(w.weight)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#133E2B] text-white border-[#133E2B] shadow-sm'
                            : 'bg-[#FBF9F5] text-gray-800 border-[#E6E2D8] hover:border-gray-400'
                        }`}
                      >
                        <span className="block text-xs font-extrabold">{w.weight}</span>
                        <span className="block text-[11px] font-medium opacity-90">₹{w.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation & Savings */}
              <div className="bg-[#FEF9EB] border border-[#E6CE8A] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#A27B16] font-bold uppercase tracking-wider">
                    Package Price ({selectedWeight})
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-black text-[#133E2B]">
                      ₹{lineTotal}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{originalLineTotal}
                    </span>
                  </div>
                </div>
                {totalSavings > 0 && (
                  <span className="bg-[#C59B27] text-[#0C2B1D] text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    Save ₹{totalSavings}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-700">Number of Bags:</span>
                <div className="flex items-center gap-3 border border-[#E6E2D8] rounded-xl p-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm min-w-[24px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary Call to Action Buttons - Exclusively WhatsApp */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>Order on WhatsApp • ₹{lineTotal}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FBF9F5] hover:bg-[#EAF3EE] text-[#133E2B] border border-[#133E2B]/20 hover:border-[#133E2B] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#133E2B]" />
                  <span>
                    {addedNotice ? '✓ Added to WhatsApp Bag!' : 'Add to WhatsApp Bag (Order Multiple Varieties)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
