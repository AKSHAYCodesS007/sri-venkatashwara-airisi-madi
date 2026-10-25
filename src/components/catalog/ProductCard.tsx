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
      className="group bg-white rounded-2xl border border-[#E6E2D8] hover:border-[#C59B27] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Media & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F1EA]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#133E2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              {product.badge}
            </span>
          )}
          <span className="bg-[#FEF9EB] text-[#A27B16] border border-[#E6CE8A] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
            {product.aging}
          </span>
        </div>

        {/* Origin Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
          {product.origin}
        </div>

        {/* Discount Pill */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-[#C59B27] text-[#0C2B1D] font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs text-[#7C8D83] mb-1.5">
            <span className="text-[11px] font-medium text-[#133E2B] bg-[#EAF3EE] px-2 py-0.5 rounded capitalize">
              {product.category.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-[#19241F] font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#19241F] group-hover:text-[#133E2B] transition-colors leading-snug line-clamp-2 mb-1.5">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#56645C] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Weights Selector & Price Row */}
        <div className="space-y-3 pt-2 border-t border-[#E6E2D8]/80">
          {/* Weight Selection Pills */}
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
              Select Pack Size:
            </div>
            <div className="flex flex-wrap gap-1.5">
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
                    className={`text-[11px] px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
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
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="font-serif text-xl sm:text-2xl font-black text-[#133E2B]">
                ₹{currentWeightObj.price}
              </span>
              <span className="text-xs text-gray-400 line-through ml-2 font-normal">
                ₹{currentWeightObj.originalPrice}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
              Save ₹{currentWeightObj.originalPrice - currentWeightObj.price}
            </span>
          </div>

          {/* Action Buttons - Exclusively WhatsApp Ordering */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              title={`Direct WhatsApp order for ${product.name} (${activeWeight})`}
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>Order on WhatsApp</span>
            </button>

            {/* Combine multiple items into WhatsApp Order Bag */}
            <button
              type="button"
              onClick={handleAdd}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer shrink-0 ${
                justAdded
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#FBF9F5] hover:bg-[#EAF3EE] text-[#133E2B] border-[#133E2B]/20 hover:border-[#133E2B]'
              }`}
              title="Add to WhatsApp Bag to combine multiple varieties into one order"
            >
              {justAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#133E2B]" />
                  {currentCartQty > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-[#C59B27] text-[#0C2B1D] text-[9px] w-4 h-4 rounded-full font-black flex items-center justify-center shadow-xs">
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
