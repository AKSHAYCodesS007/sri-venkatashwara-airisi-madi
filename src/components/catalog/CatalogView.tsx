'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (productId: string, weight?: string) => void;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onDirectWhatsApp: (product: Product, weight: string, quantity?: number) => void;
  cartItemsCountMap: Record<string, number>;
}

export default function CatalogView({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onAddToCart,
  onDirectWhatsApp,
  cartItemsCountMap,
}: CatalogViewProps) {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Normalize category names for clean tab matching
  const tabCategories = useMemo(() => {
    // Expected order from reference screenshot:
    // ALL, BOILED RICE, STEAM RICE, RAW RICE, BASMATI RICE, IDLY RICE, BROKEN RICE, ORGANIC RICE
    return categories;
  }, [categories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.aging.toLowerCase().includes(q)
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.weights[0]?.price || 0) - (b.weights[0]?.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.weights[0]?.price || 0) - (a.weights[0]?.price || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <section className="py-8 sm:py-12 bg-white min-h-[600px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Heading matching screenshot */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Our Rice Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl mx-auto">
            Freshly milled authentic 26kg sacks supplied directly from Sri Venkateshwara Arisi Mandy
          </p>
        </div>

        {/* Category Filter Tabs matching screenshot */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-6 sm:mb-8 px-1">
          {/* ALL tab */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-black tracking-wider uppercase transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1E1E1E] text-white shadow-sm'
                : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#222222]'
            }`}
          >
            ALL
          </button>

          {/* Dynamic Category Tabs */}
          {tabCategories
            .filter((c) => c.id !== 'all')
            .map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-black tracking-wider uppercase transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E1E1E] text-white shadow-sm'
                      : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#222222]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>

        {/* Search, Filter & Quick Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF8F5] p-2.5 sm:p-3 rounded-xl border border-gray-200/80">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search rice brand, variety, weight..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#52B82E] transition-colors"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-black text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort & In-stock options */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold focus:outline-none focus:border-[#52B82E] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>

            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`text-xs px-3 py-2 rounded-lg border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                inStockOnly
                  ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>In Stock</span>
            </button>
          </div>
        </div>

        {/* Product Grid matching screenshot */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF9F6] rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm font-semibold">No rice products matched your search.</p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('all');
                setInStockOnly(false);
              }}
              className="mt-3 text-xs text-[#52B82E] font-bold underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onDirectWhatsApp={onDirectWhatsApp}
                currentCartQty={cartItemsCountMap[product.id] || 0}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
