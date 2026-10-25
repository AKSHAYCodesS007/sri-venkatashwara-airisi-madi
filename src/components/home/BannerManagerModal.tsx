'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { OfferBanner, Product } from '@/types';

interface BannerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: OfferBanner[];
  products: Product[];
  onSaveBanner: (banner: OfferBanner) => Promise<void>;
  onDeleteBanner: (id: string) => Promise<void>;
  onResetBanners: () => Promise<void>;
}

export default function BannerManagerModal({
  isOpen,
  onClose,
  banners,
  products,
  onSaveBanner,
  onDeleteBanner,
  onResetBanners,
}: BannerManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'basmati-royal-1121');
  const [selectedWeight, setSelectedWeight] = useState<string>('5kg');
  const [headline, setHeadline] = useState('');
  const [discount, setDiscount] = useState('FLAT 30% OFF');
  const [brand, setBrand] = useState('Heritage Mill Direct');
  const [badge, setBadge] = useState('Festive Harvest');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const currentSelectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setSelectedWeight(prod.defaultWeight || prod.weights[0]?.weight || '5kg');
      if (!headline) {
        setHeadline(`${prod.name} Direct Mill Special`);
      }
      setBrand(prod.origin ? `Direct from ${prod.origin}` : 'Heritage Mill Direct');
      if (!imageUrl) {
        setImageUrl(prod.image);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      setStatusMsg('Please provide a headline for this offer.');
      return;
    }
    const finalImage = imageUrl.trim() || currentSelectedProduct?.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80';

    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const newBanner: OfferBanner = {
        id: 'banner_' + Date.now(),
        productId: selectedProductId,
        weight: selectedWeight,
        headline: headline.trim(),
        discount: discount.trim() || 'Direct Mill Price',
        brand: brand.trim() || 'Mill Fresh',
        badge: badge.trim(),
        image: finalImage,
      };

      await onSaveBanner(newBanner);
      setStatusMsg('Offer banner uploaded and linked successfully!');
      setActiveTab('list');
      // Reset form
      setHeadline('');
      setImageUrl('');
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save banner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#C59B27]/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] text-white px-6 py-4 flex items-center justify-between border-b border-[#C59B27]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C59B27] text-[#0C2B1D] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manage Spotlight Offer Banners</span>
                <span className="text-[10px] bg-[#C59B27]/20 text-[#FFD875] border border-[#C59B27]/50 px-2 py-0.5 rounded uppercase">
                  Home Spotlight
                </span>
              </h3>
              <p className="text-xs text-[#AECDBB]">
                Upload custom banners and link them directly to specific rice products &amp; pack weights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#E6E2D8] bg-[#FBF9F5] px-6 pt-3">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'create'
                ? 'border-[#133E2B] text-[#133E2B]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Banner</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#133E2B] text-[#133E2B]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Active Banners ({banners.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#19241F]">
          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Linked Product Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#133E2B]" />
                  <span>Link to Rice Variety (Opens on Banner Click)</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] bg-white focus:outline-none focus:border-[#133E2B]"
                >
                  {products.length === 0 ? (
                    <option value="">No products in catalog</option>
                  ) : (
                    products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category}) — {p.origin}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Pack Weight Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Default Pack Weight to Preselect:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentSelectedProduct?.weights?.map((w) => (
                    <button
                      type="button"
                      key={w.weight}
                      onClick={() => setSelectedWeight(w.weight)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                        selectedWeight === w.weight
                          ? 'bg-[#133E2B] text-white border-[#133E2B]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {w.weight} (₹{w.price})
                    </button>
                  ))}
                  {(!currentSelectedProduct || !currentSelectedProduct.weights || currentSelectedProduct.weights.length === 0) && (
                    <span className="text-xs text-gray-400 italic">No pack sizes available</span>
                  )}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Offer Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Kurnool Royal Sona Masuri — Super Harvest Deal"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] focus:outline-none focus:border-[#133E2B]"
                />
              </div>

              {/* Discount Tag & Badge Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Discount Pill Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 30% OFF or DIRECT MILL PRICE"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] focus:outline-none focus:border-[#133E2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Authenticity Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2 Yrs Naturally Aged"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] focus:outline-none focus:border-[#133E2B]"
                  />
                </div>
              </div>

              {/* Brand / Heritage Subtitle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brand / Milling Collective Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g., Andhra Agmark Certified Godown Stock"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] focus:outline-none focus:border-[#133E2B]"
                />
              </div>

              {/* Banner Image Source */}
              <div className="p-4 bg-[#FBF9F5] border border-[#E6E2D8] rounded-xl space-y-3">
                <label className="block text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>Banner Image Source</span>
                  <span className="text-[11px] text-gray-500 font-normal">Upload or paste image URL</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] bg-white rounded-lg p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5">
                    <Upload className="w-5 h-5 text-[#C59B27]" />
                    <span className="text-xs font-semibold text-gray-700">Choose Image File</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG or WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[11px] text-gray-500 mb-1">Or direct web URL:</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6E2D8] bg-white focus:outline-none focus:border-[#133E2B]"
                    />
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200">
                    <img
                      src={imageUrl}
                      alt="Banner Preview"
                      className="w-16 h-12 object-cover rounded border"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#133E2B] block">Image Ready</span>
                      <span className="text-[10px] text-gray-500">Will be featured on the Spotlight Carousel</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>{isSubmitting ? 'Saving...' : 'Add to Spotlight Offers'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Active Banners List */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <p className="text-xs text-gray-600">
                  Total Active Spotlight Banners: <strong>{banners.length}</strong>
                </p>
                <button
                  onClick={async () => {
                    if (confirm('Reset offer banners to default mill selection?')) {
                      await onResetBanners();
                      setStatusMsg('Reset to factory seed banners.');
                    }
                  }}
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>

              <div className="space-y-3">
                {banners.map((b, idx) => {
                  const linkedProd = products.find((p) => p.id === b.productId);
                  return (
                    <div
                      key={b.id || idx}
                      className="bg-white border border-[#E6E2D8] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-[#133E2B] transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={b.image}
                          alt={b.headline}
                          className="w-20 h-14 object-cover rounded-lg border flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold bg-[#C59B27] text-[#0C2B1D] px-1.5 py-0.5 rounded">
                              {b.discount}
                            </span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                              Pack: {b.weight}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900">{b.headline}</h4>
                          <p className="text-[11px] text-gray-500">
                            Links to: <strong className="text-[#133E2B]">{linkedProd?.name || b.productId}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={async () => {
                            if (confirm(`Delete banner "${b.headline}"?`)) {
                              await onDeleteBanner(b.id);
                              setStatusMsg(`Deleted "${b.headline}".`);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
