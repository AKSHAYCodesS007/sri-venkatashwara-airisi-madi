'use client';

import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  Award,
  Filter
} from 'lucide-react';
import { UserReview } from '@/types';

interface CustomerReviewsSectionProps {
  reviews: UserReview[];
  onOpenWriteReview: (productId?: string) => void;
}

export default function CustomerReviewsSection({
  reviews,
  onOpenWriteReview,
}: CustomerReviewsSectionProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const filteredReviews = reviews.filter((rev) => {
    if (filterCategory === '5star') return rev.rating === 5;
    if (filterCategory === 'basmati') {
      return (
        rev.productName?.toLowerCase().includes('basmati') ||
        rev.productId?.includes('basmati')
      );
    }
    if (filterCategory === 'sona') {
      return (
        rev.productName?.toLowerCase().includes('sona') ||
        rev.productId?.includes('sona')
      );
    }
    if (filterCategory === 'ponni') {
      return (
        rev.productName?.toLowerCase().includes('ponni') ||
        rev.productId?.includes('ponni')
      );
    }
    return true;
  });

  return (
    <section id="reviews-section" className="py-14 sm:py-16 bg-[#FBF9F5] border-b border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header & Metrics Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E6E2D8]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3EE] border border-[#133E2B]/20 text-[#133E2B] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>100% Real Customer Reviews</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#133E2B] tracking-tight">
              Customer Reviews &amp; Ratings
            </h2>

            <p className="text-xs sm:text-sm text-[#56645C] max-w-2xl leading-relaxed">
              Read authentic feedback on grain elongation, softness, and natural aging directly from home chefs, traditional South Indian kitchens, and family customers.
            </p>
          </div>

          {/* Action: Write Review Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenWriteReview()}
              className="px-5 py-3 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
              <span>Write a Customer Review</span>
            </button>
          </div>
        </div>

        {/* Aggregated Rating Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FEF9EB] border border-[#E6CE8A] flex items-center justify-center text-[#C59B27] shrink-0 font-black text-sm">
              {reviews.length > 0 ? `${averageRating}★` : '5.0★'}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-[#C59B27]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                {reviews.length > 0 ? `${reviews.length} Verified Review${reviews.length === 1 ? '' : 's'}` : 'Customer Satisfaction'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EAF3EE] border border-[#133E2B]/20 flex items-center justify-center text-[#133E2B] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#133E2B]">Zero Paraffin</p>
              <p className="text-[11px] text-gray-500 font-semibold">100% Edible Bran</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FEF9EB] border border-[#E6CE8A] flex items-center justify-center text-[#A27B16] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#133E2B]">Naturally Aged</p>
              <p className="text-[11px] text-gray-500 font-semibold">Max Vol. Expansion</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EAF3EE] border border-[#133E2B]/20 flex items-center justify-center text-[#133E2B] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#133E2B]">Verified Buyers</p>
              <p className="text-[11px] text-gray-500 font-semibold">
                {reviews.length > 0 ? `${reviews.length} Published Review${reviews.length === 1 ? '' : 's'}` : '100% Authentic Feedback'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills - Only show if reviews exist */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {[
              { id: 'all', label: `All Reviews (${reviews.length})` },
              { id: '5star', label: '5 Stars ★' },
              { id: 'basmati', label: 'Basmati Rice' },
              { id: 'sona', label: 'Sona Masuri' },
              { id: 'ponni', label: 'Ponni Rice' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-[#133E2B] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Reviews Grid or Empty State */}
        {filteredReviews.length === 0 ? (
          <div className="py-14 px-6 rounded-3xl bg-white border border-[#E6E2D8] text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF3EE] text-[#133E2B] flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-[#133E2B]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#133E2B]">
                {reviews.length === 0 ? 'No customer reviews yet' : 'No reviews match this filter'}
              </h3>
              <p className="text-xs sm:text-sm text-[#56645C] max-w-md mx-auto leading-relaxed">
                {reviews.length === 0
                  ? 'Be the very first customer to review your rice harvest! Share how the grain aroma, cooking fluffiness, and elongation turned out.'
                  : 'Try switching to "All Reviews" or be the first to share your thoughts for this grain variety.'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onOpenWriteReview()}
                className="px-6 py-3 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Star className="w-4 h-4 fill-[#C59B27] text-[#C59B27]" />
                <span>Write a Customer Review</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E6E2D8] hover:border-[#133E2B]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#C59B27]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                  </div>

                  {/* Review Headline & Text */}
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#19241F] leading-snug">
                      "{rev.title}"
                    </h3>
                    <p className="text-xs text-[#56645C] mt-2 leading-relaxed line-clamp-4">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Product Badge */}
                  {rev.productName && (
                    <div className="pt-1">
                      <span className="text-[10px] bg-[#FBF9F5] text-[#133E2B] font-bold px-2 py-1 rounded-md border border-[#E6E2D8] inline-block">
                        🌾 {rev.productName}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-[#EAF3EE] text-[#133E2B] font-semibold px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reviewer Details */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#133E2B] text-[#C59B27] font-serif font-bold text-xs flex items-center justify-center">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#19241F]">{rev.userName}</h4>
                      <p className="text-[10px] text-gray-400">{rev.userLocation}</p>
                    </div>
                  </div>

                  {rev.isVerifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] rounded-3xl p-6 sm:p-8 text-white border border-[#C59B27]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
              Every Grain Matters
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Recently Cooked With Our Harvest?
            </h3>
            <p className="text-xs text-[#C2D7CB] max-w-xl leading-relaxed">
              Tell us how the aroma and grain texture turned out. Your review helps traditional paddy farmers and gives new families confidence.
            </p>
          </div>

          <button
            onClick={() => onOpenWriteReview()}
            className="px-6 py-3.5 rounded-xl bg-[#C59B27] hover:bg-[#d4a832] text-[#0C2B1D] text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-[1.02]"
          >
            <Star className="w-4 h-4 fill-[#0C2B1D] text-[#0C2B1D]" />
            <span>Leave a Review Now</span>
          </button>
        </div>

      </div>
    </section>
  );
}
