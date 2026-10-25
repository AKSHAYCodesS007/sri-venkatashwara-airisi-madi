'use client';

import React from 'react';
import { Category } from '@/types';
import { Sparkles, Utensils, HeartPulse, History, ChevronRight, Soup, Wind, Wheat, Layers } from 'lucide-react';

interface CategoriesGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoriesGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesGridProps) {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[#C59B27]" />;
      case 'heart-pulse':
        return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'history':
      case 'idly':
        return <History className="w-5 h-5 text-amber-700" />;
      case 'boiled':
        return <Soup className="w-5 h-5 text-amber-800" />;
      case 'steam':
        return <Wind className="w-5 h-5 text-sky-700" />;
      case 'raw':
        return <Wheat className="w-5 h-5 text-amber-600" />;
      case 'broken':
        return <Layers className="w-5 h-5 text-emerald-700" />;
      default:
        return <Utensils className="w-5 h-5 text-[#133E2B]" />;
    }
  };

  return (
    <section className="py-10 bg-white border-b border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#C59B27] font-bold">
              Grain Classifications
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#133E2B]">
              Explore by Cooking Need
            </h2>
          </div>
          <p className="text-xs text-[#56645C] max-w-md">
            Every variety is aged specifically for its culinary purpose — from daily fluffy table rice to elongation-grade biryani basmati.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories
            .filter((c) => c.id !== 'all')
            .map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF3EE] border-[#133E2B] shadow-sm ring-1 ring-[#133E2B]/20'
                    : 'bg-[#FBF9F5] border-[#E6E2D8] hover:border-[#C59B27] hover:bg-white hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E2D8] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-700 border border-[#E6E2D8]">
                      {cat.count > 0 ? `${cat.count} Varieties` : 'Restocking Soon'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#19241F] group-hover:text-[#133E2B] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#56645C] mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6E2D8]/60 flex items-center justify-between text-xs font-bold text-[#133E2B] group-hover:text-[#C59B27] transition-colors">
                  <span>Browse Variety</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
