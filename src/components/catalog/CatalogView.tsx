'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (productId: string, weight?: string) => void;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onDirectWhatsApp: (product: Product, weight: string) => void;
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
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

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
      result.sort((a, b) => a.weights[0].price - b.weights[0].price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.weights[0].price - a.weights[0].price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="py-8 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#C59B27] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Direct From Godowns
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#133E2B]">
                Heritage &amp; Aged Rice Catalog
              </h1>
              <p className="text-xs text-[#56645C] mt-1">
                Browse our naturally aged grain batches, de-stoned and bagged freshly upon order.
              </p>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search input in catalog */}
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  placeholder="Filter varieties..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full text-xs pl-8 pr-7 py-2 rounded-xl border border-[#E6E2D8] bg-white focus:outline-none focus:border-[#133E2B]"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-2 text-gray-400 hover:text-black text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-[#E6E2D8] bg-white text-gray-700 font-semibold focus:outline-none focus:border-[#133E2B] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* In-Stock Toggle */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`text-xs px-3 py-2 rounded-xl border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  inStockOnly
                    ? 'bg-[#133E2B] text-white border-[#133E2B]'
                    : 'bg-white text-gray-700 border-[#E6E2D8] hover:border-gray-400'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>In Stock Only</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E6E2D8]">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#133E2B] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
              }`}
            >
              All ({products.length})
            </button>
            {categories
              .filter((c) => c.id !== 'all')
              .map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#133E2B] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div>
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> grain varieties
            {searchQuery && (
              <span> matching &ldquo;<span className="text-[#133E2B] font-semibold">{searchQuery}</span>&rdquo;</span>
            )}
          </div>
          {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                setInStockOnly(false);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const cartCount = cartItemsCountMap[p.id] || 0;
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onDirectWhatsApp={onDirectWhatsApp}
                  currentCartQty={cartCount}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E6E2D8] p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FEF9EB] border border-[#E6CE8A] text-[#C59B27] flex items-center justify-center mx-auto text-3xl">
              {products.length === 0 ? '🌾' : <Search className="w-6 h-6" />}
            </div>
            <h3 className="font-serif font-bold text-xl text-gray-900">
              {products.length === 0 ? 'Catalog Freshly Reset' : 'No Rice Varieties Found'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {products.length === 0
                ? 'All sample products have been removed. Our inventory is ready for fresh real grain batches.'
                : "We couldn't find any grain batch matching your query. Try resetting your search or exploring our popular categories."}
            </p>
            {products.length > 0 ? (
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSearchChange('');
                }}
                className="px-4 py-2 rounded-xl bg-[#133E2B] text-white text-xs font-bold hover:bg-[#1C523B] transition cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <a
                href="https://wa.me/919962119810"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#133E2B] text-white text-xs font-semibold hover:bg-[#0C2B1D] transition shadow-md"
              >
                Inquire on WhatsApp Desk
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
