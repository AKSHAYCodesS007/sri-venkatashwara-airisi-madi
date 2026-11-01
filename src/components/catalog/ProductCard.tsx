'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import {
  Star,
  Plus,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (productId: string, weight?: string) => void;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onDirectWhatsApp: (product: Product, weight: string) => void;
  currentCartQty?: number;
}

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onDirectWhatsApp,
  currentCartQty = 0,
}: ProductCardProps) {
  const [activeWeight, setActiveWeight] = useState<string>(
    product.defaultWeight || product.weights[0]?.weight || '5kg'
  );
  const [justAdded, setJustAdded] = useState(false);

  const currentWeightObj =
    product.weights.find((w) => w.weight === activeWeight) ||
    product.weights[0] || {
      weight: '5kg',
      price: 300,
      originalPrice: 350,
    };

  const discountPercent = Math.round(
    ((currentWeightObj.originalPrice - currentWeightObj.price) /
      currentWeightObj.originalPrice) *
      100
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeWeight, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectWhatsApp(product, activeWeight);
  };

  return (
    <div
      onClick={() => onSelectProduct(product.id, activeWeight)}
      className="group bg-white rounded-xl sm:rounded-2xl border border-[#E6E2D8] hover:border-[#C59B27] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Media & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F1EA]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-[#133E2B] text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5 sm:gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C59B27]" />
              <span className="truncate max-w-[75px] sm:max-w-none">{product.badge}</span>
            </span>
          )}
          <span className="bg-[#FEF9EB] text-[#A27B16] border border-[#E6CE8A] text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-2xs">
            {product.aging}
          </span>
        </div>

        {/* Origin Pill */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[100px] sm:max-w-none">
          {product.origin}
        </div>

        {/* Discount Pill */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-[#C59B27] text-[#0C2B1D] font-extrabold text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-2 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#7C8D83] mb-1">
            <span className="text-[9px] sm:text-[11px] font-medium text-[#133E2B] bg-[#EAF3EE] px-1.5 py-0.5 rounded capitalize truncate max-w-[70px] sm:max-w-none">
              {product.category.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[#19241F] font-bold text-[10px] sm:text-xs shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#C59B27] text-[#C59B27]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal text-[9px] sm:text-xs">({product.reviewCount})</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-serif font-bold text-xs sm:text-base lg:text-lg text-[#19241F] group-hover:text-[#133E2B] transition-colors leading-snug line-clamp-2 mb-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-[10px] sm:text-xs text-[#56645C] line-clamp-1 sm:line-clamp-2 leading-relaxed mb-2 sm:mb-4">
            {product.description}
          </p>
        </div>

        {/* Weights Selector & Price Row */}
        <div className="space-y-2 sm:space-y-3 pt-1.5 sm:pt-2 border-t border-[#E6E2D8]/80">
          {/* Weight Selection Pills */}
          <div>
            <div className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
              Select Pack Size:
            </div>
            <div className="flex flex-wrap gap-1">
              {product.weights.map((w) => {
                const isActive = activeWeight === w.weight;
                return (
                  <button
                    type="button"
                    key={w.weight}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveWeight(w.weight);
                    }}
                    className={`text-[9px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#133E2B] text-white border border-[#133E2B] shadow-2xs'
                        : 'bg-[#FBF9F5] text-gray-700 border border-[#E6E2D8] hover:border-gray-400'
                    }`}
                  >
                    {w.weight}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Price Display */}
          <div className="flex items-baseline justify-between pt-0.5 flex-wrap gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-sm sm:text-xl lg:text-2xl font-black text-[#133E2B]">
                ₹{currentWeightObj.price}
              </span>
              <span className="text-[9px] sm:text-xs text-gray-400 line-through font-normal">
                ₹{currentWeightObj.originalPrice}
              </span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded font-bold">
              Save ₹{currentWeightObj.originalPrice - currentWeightObj.price}
            </span>
          </div>

          {/* Action Buttons - Exclusively WhatsApp Ordering */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              title={`Direct WhatsApp order for ${product.name} (${activeWeight})`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="hidden sm:inline">Order on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {/* Combine multiple items into WhatsApp Order Bag */}
            <button
              type="button"
              onClick={handleAdd}
              className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
                justAdded
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#FBF9F5] hover:bg-[#EAF3EE] text-[#133E2B] border-[#133E2B]/20 hover:border-[#133E2B]'
              }`}
              title="Add to WhatsApp Bag"
            >
              {justAdded ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#133E2B]" />
                  {currentCartQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#C59B27] text-[#0C2B1D] text-[8px] sm:text-[9px] w-3.5 h-3.5 rounded-full font-black flex items-center justify-center shadow-xs">
                      {currentCartQty}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}