'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
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
    product.defaultWeight || product.weights[0]?.weight || '26kg'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const currentWeightObj =
    product.weights.find((w) => w.weight === activeWeight) ||
    product.weights[0] || {
      weight: '26kg',
      price: 1850,
      originalPrice: 2000,
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeWeight, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectWhatsApp(product, activeWeight);
  };

  return (
    <div
      onClick={() => onSelectProduct(product.id, activeWeight)}
      className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 hover:border-[#52B82E]/70 hover:shadow-xl shadow-2xs transition-all duration-300 p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Sack Image matching screenshot */}
      <div className="relative aspect-square w-full max-h-[180px] sm:max-h-[220px] flex items-center justify-center bg-white p-2 mb-2 sm:mb-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Out of stock overlay if applicable */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Title in Bold Uppercase matching reference */}
      <div className="text-center mb-1.5 sm:mb-2">
        <h3 className="font-extrabold text-[11px] xs:text-xs sm:text-sm text-[#111827] uppercase tracking-wide leading-snug line-clamp-2 min-h-[32px] sm:min-h-[40px] flex items-center justify-center group-hover:text-[#52B82E] transition-colors">
          {product.name}
        </h3>
      </div>

      {/* Pack Size & Price matching reference */}
      <div className="text-center space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-3">
        {/* If multiple weights, allow quick selection; else display single size */}
        {product.weights.length > 1 ? (
          <div className="flex items-center justify-center gap-1 flex-wrap">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Size:</span>
            {product.weights.map((w) => (
              <button
                key={w.weight}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveWeight(w.weight);
                }}
                className={`text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                  activeWeight === w.weight
                    ? 'bg-[#1E1E1E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {w.weight}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
            Size: <span className="text-gray-800 font-bold">{activeWeight}</span>
          </div>
        )}

        <div className="text-[11px] sm:text-xs text-gray-600 font-medium">
          Price:{' '}
          <span className="text-[#F39C12] font-black text-xs sm:text-sm md:text-base">
            ₹{currentWeightObj.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stepper Quantity Box [-] qty [+] */}
      <div className="mb-2 sm:mb-3">
        <div className="flex items-center justify-between bg-[#F4F5F7] rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200/80">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((q) => Math.max(1, q - 1));
            }}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black text-gray-700 hover:text-black hover:bg-gray-200 rounded text-sm sm:text-base cursor-pointer select-none"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="font-bold text-xs sm:text-sm text-gray-900 select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((q) => q + 1);
            }}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-black text-gray-700 hover:text-black hover:bg-gray-200 rounded text-sm sm:text-base cursor-pointer select-none"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Cart (Light Green) & Buy Now (Gold/Orange with WhatsApp) */}
      <div className="space-y-1.5 sm:space-y-2">
        {/* Vibrant Light Green "Add to Cart" */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-[#52B82E] hover:bg-[#439E23] active:bg-[#38881C] text-white font-extrabold py-2 sm:py-2.5 px-2 rounded-lg text-xs sm:text-sm transition-all shadow-2xs hover:shadow cursor-pointer flex items-center justify-center gap-1 select-none"
        >
          {justAdded ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>

        {/* Vibrant Gold/Orange "Buy Now" with WhatsApp */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full bg-[#F5A623] hover:bg-[#E59715] active:bg-[#CC840E] text-white font-extrabold py-2 sm:py-2.5 px-2 rounded-lg text-xs sm:text-sm transition-all shadow-2xs hover:shadow cursor-pointer flex items-center justify-center gap-1.5 select-none"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
