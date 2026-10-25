'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import { GrainLogoIcon } from '@/components/common/Icons';
import { Product, UserReview, UserProfile } from '@/types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProductId?: string;
  userProfile?: UserProfile;
  onSubmitReview: (review: Omit<UserReview, 'id' | 'date'>) => Promise<void>;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: '5 Stars — Outstanding Aroma, Fluffiness & Elongation',
  4: '4 Stars — Very Good Quality, Highly Recommended',
  3: '3 Stars — Good Everyday Table Rice',
  2: '2 Stars — Average Harvest Experience',
  1: '1 Star — Needs Improvement',
};

const POPULAR_TAGS = [
  '🌾 Authentic Godown Ageing',
  '✨ Zero Chemical Polish',
  '🍚 Fluffy & Non-Sticky',
  '🍛 Biryani Elongation',
  '🚀 Free Doorstep Delivery',
  '👨‍👩‍👧 Daily Family Staple',
  '💯 100% Edible Bran',
  '🌿 Cleaned & De-stoned'
];

export default function WriteReviewModal({
  isOpen,
  onClose,
  products,
  initialProductId,
  userProfile,
  onSubmitReview,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || 'general');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('Chennai');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '🌾 Authentic Godown Ageing',
    '🍚 Fluffy & Non-Sticky'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill user details when opened
  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else {
      setSelectedProductId('general');
    }

    if (userProfile?.name && userProfile.name !== 'Valued Customer') {
      setUserName(userProfile.name);
    } else {
      setUserName('');
    }
  }, [isOpen, initialProductId, userProfile]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a review headline or title');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMsg('Please share a few words about your cooking experience (min 10 characters)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const selectedProd = products.find((p) => p.id === selectedProductId);
      const prodName = selectedProd ? selectedProd.name : 'General Mill Experience';

      await onSubmitReview({
        productId: selectedProductId === 'general' ? undefined : selectedProductId,
        productName: prodName,
        userName: userName.trim() || 'Verified Grain Connoisseur',
        userLocation: userLocation.trim() || 'South India',
        rating,
        title: title.trim(),
        comment: comment.trim(),
        tags: selectedTags,
        isVerifiedBuyer: true,
      });

      // Reset
      setTitle('');
      setComment('');
      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
      setErrorMsg('Unable to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C523B] to-[#0C2B1D] border border-[#C59B27] flex items-center justify-center text-[#C59B27] shadow-sm">
              <GrainLogoIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                Community Feedback
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Share Your Harvest Experience
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#C2D7CB] leading-relaxed">
            Help other Indian households discover pure, naturally aged paddy. Rate aroma, cooking volume, and texture!
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* 1. Star Rating Selector */}
          <div className="bg-[#FBF9F5] p-3.5 rounded-2xl border border-[#E6E2D8] text-center space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Your Overall Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    title={`${star} Star Rating`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? 'fill-[#C59B27] text-[#C59B27]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-bold text-[#133E2B]">
              {RATING_DESCRIPTIONS[hoverRating || rating]}
            </p>
          </div>

          {/* 2. Select Rice Product */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Select Rice Variety
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5] font-semibold text-[#19241F]"
            >
              <option value="general">🌾 General Mill Harvest &amp; Service Experience</option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.origin})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Review Headline / Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Review Headline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Outstanding non-sticky grains, truly aged!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5] font-medium"
            />
          </div>

          {/* 4. Review Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Detailed Experience <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="How was the aroma, grain length elongation, softness, or cooking water ratio? Did your family enjoy it?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5] font-normal leading-relaxed resize-none"
            />
          </div>

          {/* 5. Highlight Tags Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Highlight Highlights:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-[#133E2B] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Reviewer Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Smt. Lakshmi Rao"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5]"
                />
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                City / Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Bengaluru"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5]"
                />
                <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Harvest Review'}</span>
            </button>
          </div>
        </form>

        {/* Footer Guarantee */}
        <div className="bg-[#FBF9F5] px-6 py-2.5 border-t border-gray-200 flex items-center justify-center gap-2 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Mill Customer Feedback • 100% Genuine Household Experiences</span>
        </div>
      </div>
    </div>
  );
}
