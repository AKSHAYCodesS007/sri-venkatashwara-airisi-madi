'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import {
  Sparkles,
  Utensils,
  Flame,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Star
} from 'lucide-react';

interface RiceMatcherProps {
  products: Product[];
  onSelectProduct: (productId: string, weight?: string) => void;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
}

interface MatchQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    targetCategory: string;
    preferredProductId?: string;
  }[];
}

const QUESTIONS: MatchQuestion[] = [
  {
    id: 'dish',
    question: '1. What signature dish are you preparing?',
    subtitle: 'Rice texture and starch ratio vary dramatically across recipes.',
    options: [
      {
        label: 'Hyderabadi Dum Biryani / Festive Pulao',
        description: 'Requires extra-long grain elongation, zero stickiness, and rich aroma.',
        targetCategory: 'basmati-rice',
        preferredProductId: 'basmati-royal-1121', // Royal 1121 XXL
      },
      {
        label: 'Daily Family Meals (Sambar, Dal, Rasam, Curd)',
        description: 'Requires soft, easy-to-digest, naturally aged grains that absorb gravies well.',
        targetCategory: 'raw-rice',
        preferredProductId: 'kurnool-sona-masuri-aged', // Kurnool Sona Masuri
      },
      {
        label: 'Diabetic Nutrition / Low-GI Lifestyle',
        description: 'Requires low glycemic index, sustained energy, and mineral retention.',
        targetCategory: 'organic-rice',
        preferredProductId: 'organic-brown-sona-masuri', // Unpolished Brown Rice
      },
      {
        label: 'Heritage Sweets (Payasam, Pongal, Kheer)',
        description: 'Requires rich short grain that releases natural starches and fragrant oils.',
        targetCategory: 'basmati-rice',
        preferredProductId: 'traditional-gobindobhog', // Gobindobhog
      },
      {
        label: 'Crispy Dosa, Fluffy Idli & Fermentation Batter',
        description: 'Requires high amylose parboiled grains for crisp golden edges.',
        targetCategory: 'idly-rice',
        preferredProductId: 'salem-gundu-idli-rice', // Salem Idli Rice
      },
    ],
  },
  {
    id: 'texture',
    question: '2. What grain texture does your family prefer?',
    subtitle: 'Aging determines grain elongation and moisture retention.',
    options: [
      {
        label: 'Separate, Slender & Non-Sticky',
        description: 'Each grain stands distinctly alone when served.',
        targetCategory: 'basmati-rice',
      },
      {
        label: 'Tender, Light & Fluffy',
        description: 'Melts softly with ghee, dal, and spicy curries.',
        targetCategory: 'steam-rice',
      },
      {
        label: 'Intensely Fragrant Petite Grains',
        description: 'Small heirloom pearls infused with herbal aromas.',
        targetCategory: 'boiled-rice',
      },
      {
        label: 'Wholesome Nutty Bran Layer',
        description: 'Rich in dietary fiber and natural germ nutrients.',
        targetCategory: 'organic-rice',
      },
    ],
  },
  {
    id: 'method',
    question: '3. What is your primary cooking method?',
    subtitle: 'Ensures recommended rice handles your heat style reliably.',
    options: [
      {
        label: 'Pressure Cooker (Quick 2-3 whistles)',
        description: 'Retains steam and cooks in 12-15 minutes.',
        targetCategory: 'steam-rice',
      },
      {
        label: 'Open Pot Water Drain (Traditional)',
        description: 'Removes excess surface starches for lighter digestion.',
        targetCategory: 'basmati-rice',
      },
      {
        label: 'Electric Automatic Rice Cooker',
        description: 'Gentle uniform warming and automatic shutoff.',
        targetCategory: 'raw-rice',
      },
    ],
  },
];

export default function RiceMatcher({
  products,
  onSelectProduct,
  onAddToCart,
}: RiceMatcherProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [matchResult, setMatchResult] = useState<Product | null>(null);

  if (!products || products.length === 0) {
    return (
      <div className="py-12 bg-[#FBF9F5] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl border border-[#E6E2D8] shadow-lg p-10 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#FEF9EB] border border-[#E6CE8A] rounded-full flex items-center justify-center text-3xl">
              🌾
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#133E2B]">Catalog Freshly Reset</h2>
            <p className="text-sm text-[#56645C] leading-relaxed">
              We are currently restocking our store with fresh mill arrivals. No varieties are listed at this moment.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919962119810"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#133E2B] text-white text-sm font-semibold hover:bg-[#0C2B1D] transition shadow-md"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    const updated = { ...answers, [questionId]: optionIndex };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate match
      const dishChoice = QUESTIONS[0].options[updated.dish || 0];
      let matched: Product | undefined;

      if (dishChoice.preferredProductId) {
        matched = products.find((p) => p.id === dishChoice.preferredProductId);
      }
      if (!matched) {
        matched = products.find((p) => p.category === dishChoice.targetCategory);
      }
      if (!matched) {
        matched = products[0];
      }

      setMatchResult(matched);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatchResult(null);
  };

  return (
    <div className="py-12 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9EB] border border-[#E6CE8A] text-[#A27B16] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Interactive Grain Sommelier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#133E2B]">
            Find Your Perfect Rice Match
          </h1>
          <p className="text-xs sm:text-sm text-[#56645C] max-w-xl mx-auto">
            Answer 3 quick culinary questions and our milling experts will pair your dish with the exact paddy variety aged for that recipe.
          </p>
        </div>

        {!matchResult ? (
          /* Questionnaire Card */
          <div className="bg-white rounded-3xl border border-[#E6E2D8] shadow-lg p-6 sm:p-10 space-y-6 animate-fade-in">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Step {currentStep + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Completed</span>
              </div>
              <div className="w-full bg-[#F4F1EA] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#133E2B] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#19241F]">
                {QUESTIONS[currentStep].question}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {QUESTIONS[currentStep].subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {QUESTIONS[currentStep].options.map((opt, idx) => {
                const isSelected = answers[QUESTIONS[currentStep].id] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(QUESTIONS[currentStep].id, idx)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-[#EAF3EE] border-[#133E2B] ring-1 ring-[#133E2B]'
                        : 'bg-[#FBF9F5] border-[#E6E2D8] hover:border-[#C59B27] hover:bg-white'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#133E2B] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {isSelected && <div className="w-3 h-3 rounded-full bg-[#133E2B]" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#19241F]">{opt.label}</h3>
                      <p className="text-xs text-[#56645C] mt-0.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 self-center" />
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            {currentStep > 0 && (
              <div className="pt-2 flex justify-start">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
                >
                  ← Back to Previous Question
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Match Result Card */
          <div className="bg-white rounded-3xl border border-[#C59B27]/40 shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-[#C59B27] text-[#0C2B1D] text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs inline-flex items-center gap-1 mb-2">
                  <Sparkles className="w-3 h-3" />
                  98% Culinary Match
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  Recommended For Your Kitchen
                </h2>
                <p className="text-xs text-[#AECDBB] mt-1">
                  Aged precisely to yield the fluffiness and aroma required by your recipe.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Test Another Dish</span>
              </button>
            </div>

            {/* Match Product Profile */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5">
                <img
                  src={matchResult.image}
                  alt={matchResult.name}
                  className="w-full aspect-square object-cover rounded-2xl border border-gray-200 shadow-md"
                />
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#133E2B] bg-[#EAF3EE] px-2 py-0.5 rounded capitalize">
                      {matchResult.category}
                    </span>
                    <span className="text-xs font-bold text-[#A27B16] bg-[#FEF9EB] px-2 py-0.5 rounded border border-[#E6CE8A]">
                      {matchResult.aging}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#19241F]">
                    {matchResult.name}
                  </h3>
                  <p className="text-xs text-[#56645C] mt-2 leading-relaxed">
                    {matchResult.description}
                  </p>
                </div>

                <div className="bg-[#FBF9F5] border border-[#E6E2D8] rounded-xl p-3.5 space-y-1.5 text-xs text-gray-700">
                  <div className="font-bold text-[#133E2B] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Why this variety excels in your recipe:</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Naturally aged for over {matchResult.aging}, ensuring starch crystallization so grains stay whole, absorb spices without turning mushy, and deliver authentic South Indian &amp; Nizami culinary flavor.
                  </p>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xs text-gray-500 block">Starting pack:</span>
                    <span className="font-serif text-2xl font-black text-[#133E2B]">
                      ₹{matchResult.weights[0].price}
                    </span>
                    <span className="text-xs text-gray-400 line-through ml-2">
                      ₹{matchResult.weights[0].originalPrice}
                    </span>
                  </div>
                </div>

                {/* Match CTAs */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() =>
                      onAddToCart(matchResult, matchResult.defaultWeight || '5kg', 1)
                    }
                    className="flex-1 py-3 px-4 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                    <span>Add 5kg Bag to Cart</span>
                  </button>

                  <button
                    onClick={() =>
                      onSelectProduct(matchResult.id, matchResult.defaultWeight || '5kg')
                    }
                    className="px-4 py-3 rounded-xl border border-[#133E2B] text-[#133E2B] hover:bg-[#EAF3EE] text-xs font-bold transition cursor-pointer"
                  >
                    View Grain Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
