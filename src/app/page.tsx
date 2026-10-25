'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/navbar/Navbar';
import SpotlightCarousel from '@/components/home/SpotlightCarousel';
import BannerManagerModal from '@/components/home/BannerManagerModal';
import HeroSection from '@/components/home/HeroSection';
import CategoriesGrid from '@/components/catalog/CategoriesGrid';
import CatalogView from '@/components/catalog/CatalogView';
import ProductCard from '@/components/catalog/ProductCard';
import ProductModal from '@/components/catalog/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import dynamic from 'next/dynamic';
import OrderTrackingView from '@/components/tracking/OrderTrackingView';

// Code-splitting & hiding admin chunk from normal customer bundles
const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex items-center justify-center p-8 bg-[#FBF9F5]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#133E2B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-semibold">Securing Admin Channel...</span>
      </div>
    </div>
  ),
});
import Footer from '@/components/common/Footer';
import SelectProductsPromptModal from '@/components/common/SelectProductsPromptModal';
import CustomerReviewsSection from '@/components/reviews/CustomerReviewsSection';
import WriteReviewModal from '@/components/reviews/WriteReviewModal';
import OrderConfirmationModal from '@/components/common/OrderConfirmationModal';
import {
  Product,
  Category,
  OfferBanner,
  CartItem,
  Order,
  FaqItem,
  StoreInfo,
  UserReview,
} from '@/types';
import {
  getStoreInfo,
  getCategories,
  getProducts,
  saveProduct,
  deleteProduct,
  resetProducts,
  getOfferBanners,
  saveOfferBanner,
  deleteOfferBanner,
  resetOfferBanners,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getFaqs,
  getReviews,
  saveReview,
} from '@/lib/data-service';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, HeartHandshake, ShoppingCart } from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

import {
  STORE_INFO,
  CATEGORIES,
  PRODUCTS,
  DEFAULT_OFFER_BANNERS,
  SAMPLE_ORDERS,
  FAQS,
  DEFAULT_REVIEWS,
} from '@/data/seed-data';

const CART_STORAGE_KEY = 'rice_ecommerce_cart_v3';

export default function Home() {
  // Data state initialized with instant seed data for instantaneous SSR & Zero-Flicker render
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(STORE_INFO);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [offerBanners, setOfferBanners] = useState<OfferBanner[]>(DEFAULT_OFFER_BANNERS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQS);
  const [reviews, setReviews] = useState<UserReview[]>(DEFAULT_REVIEWS);
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  // App navigation & filter state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTrackingId, setActiveTrackingId] = useState<string | undefined>(undefined);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductWeight, setSelectedProductWeight] = useState<string | undefined>(undefined);
  const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);
  const [isSelectProductsModalOpen, setIsSelectProductsModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState<string | undefined>(undefined);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [confirmedWhatsAppUrl, setConfirmedWhatsAppUrl] = useState<string>('');
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Data Load
  useEffect(() => {
    async function initData() {
      try {
        const [
          sInfo,
          cats,
          prods,
          banners,
          ords,
          faqList,
          revList,
        ] = await Promise.all([
          getStoreInfo(),
          getCategories(),
          getProducts(),
          getOfferBanners(),
          getOrders(),
          getFaqs(),
          getReviews(),
        ]);

        setStoreInfo(sInfo);
        setCategories(cats);
        setProducts(prods);
        setOfferBanners(banners);
        setOrders(ords);
        setFaqs(faqList);
        setReviews(revList);

        // Load cart from localStorage
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart));
            } catch (e) {
              console.warn('Could not parse cart:', e);
            }
          }

          // Secret admin access via URL parameter (?admin or ?portal or #admin)
          const params = new URLSearchParams(window.location.search);
          if (params.has('admin') || params.has('portal') || window.location.hash === '#admin') {
            setCurrentView('admin');
          }
        }
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setIsClientHydrated(true);
      }
    }

    initData();
  }, []);

  // Save cart to localStorage once hydrated
  useEffect(() => {
    if (typeof window !== 'undefined' && isClientHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isClientHydrated]);

  // Secret Admin Access Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'home' : 'admin'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: Product, weight: string, quantity: number) => {
    const weightObj =
      product.weights.find((w) => w.weight === weight) ||
      product.weights[0] || {
        weight: '5kg',
        price: 300,
        originalPrice: 350,
      };

    const cartItemId = `${product.id}_${weight}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          name: product.name,
          image: product.image,
          weight,
          price: weightObj.price,
          originalPrice: weightObj.originalPrice,
          quantity,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added ${quantity} bag(s) of ${product.name} (${weight}) to WhatsApp Bag!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const cartItemsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  // Click-to-Item Navigation (Opens ProductModal with preselected weight)
  const handleSelectProduct = (productId: string, weight?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      setSelectedProductWeight(weight || prod.defaultWeight || prod.weights[0]?.weight);
    }
  };

  // Direct WhatsApp Order Generator (Registers Order & Shows Order Number to User First)
  const handleDirectWhatsAppProduct = async (
    product: Product,
    weight: string,
    quantity: number = 1
  ) => {
    if (!storeInfo) return;
    const weightObj =
      product.weights.find((w) => w.weight === weight) || product.weights[0];
    const itemTotal = weightObj.price * quantity;
    const deliveryFee = 0; // ₹0 FREE Doorstep Delivery across Chennai
    const platformFee = 0; // ₹0 FREE Platform Fee
    const finalTotal = itemTotal;

    // Retrieve saved guest delivery details if available
    let guestInfo = { name: '', phone: '', address: '', area: '', pincode: '600' };
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rice_guest_delivery_info');
        if (saved) guestInfo = { ...guestInfo, ...JSON.parse(saved) };
      } catch (e) {
        // ignore
      }
    }

    const orderPayload: Partial<Order> = {
      items: [
        {
          name: product.name,
          weight: weight,
          quantity: quantity,
          price: weightObj.price,
        },
      ],
      total: finalTotal,
      deliveryAddress: guestInfo.address.trim()
        ? `${guestInfo.address.trim()}${guestInfo.area.trim() ? `, ${guestInfo.area.trim()}` : ''}, Chennai - ${guestInfo.pincode.trim() || '600xxx'}${guestInfo.name.trim() ? ` (${guestInfo.name.trim()}, ${guestInfo.phone.trim()})` : ''}`
        : 'Doorstep Cash/UPI on Delivery (Chennai City & Suburbs)',
      paymentMethod: 'WhatsApp Order (Cash / UPI on Delivery)',
    };

    let newOrder: Order;
    try {
      newOrder = await createOrder(orderPayload);
    } catch (e) {
      newOrder = {
        orderId: 'RS' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: orderPayload.items || [],
        total: finalTotal,
        status: 'Order Placed',
        currentStep: 1,
        deliveryAddress: orderPayload.deliveryAddress || 'Chennai Doorstep',
        paymentMethod: 'WhatsApp Order (Cash / UPI on Delivery)',
        trackingUpdates: [
          {
            status: 'Order Received & Verified',
            location: 'Chiikkarayapuram Mandi Hub, Chennai',
            time: 'Just now',
          },
        ],
      };
    }

    setOrders((prev) => [newOrder, ...prev.filter((o) => o.orderId !== newOrder.orderId)]);
    setActiveTrackingId(newOrder.orderId);

    // Build WhatsApp Message with the newly generated Order ID
    let text = `🌾 *NEW RICE ORDER — ${storeInfo.name.toUpperCase()}*\n`;
    text += `📍 *Service Area: Exclusively Chennai City & Suburbs*\n`;
    text += `🔖 *Order Tracking ID:* #${newOrder.orderId}\n`;
    if (guestInfo.name.trim()) {
      text += `👤 *Customer:* ${guestInfo.name.trim()}${guestInfo.phone.trim() ? ` (${guestInfo.phone.trim()})` : ''}\n`;
    }
    if (guestInfo.address.trim()) {
      text += `🏠 *Delivery Address:* ${guestInfo.address.trim()}${guestInfo.area.trim() ? `, ${guestInfo.area.trim()}` : ''}, Chennai - ${guestInfo.pincode.trim() || '600xxx'}\n`;
    }
    text += `\n*ITEMS ORDERED:*\n`;
    text += `1. *${product.name}* (${weight})\n   Qty: ${quantity} bag(s) @ ₹${weightObj.price} = ₹${itemTotal}\n`;
    text += `\nSubtotal: ₹${itemTotal}`;
    text += `\nPlatform Fee: ₹0 (FREE)`;
    text += `\nDelivery Fee (Chennai): ₹0 (FREE Doorstep Delivery)`;
    text += `\n*TOTAL PAYABLE (COD / UPI): ₹${finalTotal}*`;
    text += `\n\n_Vanakkam! Please confirm dispatch schedule to Chennai doorstep. Payment via Cash/UPI on arrival._`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${storeInfo.whatsappNumber}?text=${encoded}`;

    // Close product modal if open
    setSelectedProduct(null);

    // Show order confirmation modal with Order Number BEFORE opening WhatsApp!
    setConfirmedOrder(newOrder);
    setConfirmedWhatsAppUrl(url);
    setIsOrderConfirmationOpen(true);
  };

  const handleGeneralWhatsAppOrder = () => {
    if (!storeInfo) return;

    // 1. If cart is empty, ask user to select products on the website first!
    if (cartItems.length === 0) {
      setIsSelectProductsModalOpen(true);
      showToast('Please select your rice products first — we will take them to WhatsApp!');
      return;
    }

    // 2. If cart has products, open cart drawer to review & checkout with Order ID!
    setIsCartOpen(true);
  };

  // Add 1-Click Signature Product to Cart & Directly Take to WhatsApp
  const handleAddToCartAndWhatsApp = (
    product: Product,
    weight: string,
    quantity: number = 1
  ) => {
    handleAddToCart(product, weight, quantity);
    handleDirectWhatsAppProduct(product, weight, quantity);
  };

  // General Mill Desk Inquiry (without pre-selected products)
  const handleGeneralMillInquiry = () => {
    if (!storeInfo) return;
    const msg = `🌾 *MILL DESK INQUIRY — ${storeInfo.name.toUpperCase()}*\n\nNamaste! I would like to inquire about today's freshly milled aged rice varieties and doorstep delivery schedules.`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${storeInfo.whatsappNumber}?text=${encoded}`, '_blank');
  };

  // Banner Manager Handlers
  const handleSaveBanner = async (banner: OfferBanner) => {
    const updated = await saveOfferBanner(banner);
    setOfferBanners(updated);
    showToast('Spotlight Offer Banner saved successfully!');
  };

  const handleDeleteBanner = async (id: string) => {
    const updated = await deleteOfferBanner(id);
    setOfferBanners(updated);
    showToast('Banner removed from Spotlight.');
  };

  const handleResetBanners = async () => {
    const updated = await resetOfferBanners();
    setOfferBanners(updated);
    showToast('Banners restored to factory defaults.');
  };

  // Product Catalog Handlers (Admin)
  const handleSaveProduct = async (productData: Product) => {
    const updated = await saveProduct(productData);
    setProducts(updated);
    const updatedCats = await getCategories(updated);
    setCategories(updatedCats);
    showToast(`Product "${productData.name}" saved successfully!`);
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = await deleteProduct(id);
    setProducts(updated);
    const updatedCats = await getCategories(updated);
    setCategories(updatedCats);
    showToast('Product removed from catalog.');
  };

  const handleResetProducts = async () => {
    const updated = await resetProducts();
    setProducts(updated);
    const updatedCats = await getCategories(updated);
    setCategories(updatedCats);
    showToast('Product catalog restored to factory defaults.');
  };

  // User Review Handlers
  const handleOpenWriteReview = (productId?: string) => {
    setReviewProductId(productId);
    setIsWriteReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData: Omit<UserReview, 'id' | 'date'>) => {
    const newRev = await saveReview(reviewData);
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your harvest review has been published.');
  };

  // Order Placement Handler (from Cart Drawer or other sources)
  const handleOrderPlaced = (newOrder: Order, whatsappUrl?: string) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.orderId !== newOrder.orderId)]);
    setActiveTrackingId(newOrder.orderId);
    showToast(`Order #${newOrder.orderId} registered successfully!`);

    if (whatsappUrl) {
      setConfirmedOrder(newOrder);
      setConfirmedWhatsAppUrl(whatsappUrl);
      setIsOrderConfirmationOpen(true);
    } else {
      setCurrentView('track');
    }
  };

  // Admin Order Status Update Handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    newStep: number,
    logMessage?: string,
    location?: string
  ) => {
    const updated = await updateOrderStatus(orderId, newStatus, newStep, logMessage, location);
    setOrders(updated);
    showToast(`Order #${orderId} delivery status updated to "${newStatus}"!`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const updated = await deleteOrder(orderId);
    setOrders(updated);
    showToast(`Order #${orderId} deleted successfully.`);
  };

  const handleNavigate = (view: string, extra?: Record<string, any>) => {
    const targetView = view === 'account' ? 'home' : view;
    setCurrentView(targetView);
    if (extra?.category) {
      setSelectedCategory(extra.category);
    }
    if (extra?.trackingId) {
      setActiveTrackingId(extra.trackingId);
    } else if (view === 'track') {
      setActiveTrackingId(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#19241F] selection:bg-[#C59B27] selection:text-[#0C2B1D] overflow-x-hidden w-full max-w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#133E2B] text-white border border-[#C59B27] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        totalCartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        storeInfo={storeInfo}
        onWhatsAppOrder={handleGeneralWhatsAppOrder}
      />

      {/* 2. Spotlight Offer Carousel (Positioned Directly Below Navbar on Home View) */}
      {currentView === 'home' && (
        <SpotlightCarousel
          banners={offerBanners}
          onSelectProduct={handleSelectProduct}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            const el = document.getElementById('products-catalog');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              handleNavigate('products', { category: catId });
            }
          }}
          onOpenBannerManager={() => setIsBannerManagerOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* HOME VIEW */}
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onNavigateToCatalog={() => {
                const el = document.getElementById('products-catalog');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('products');
                }
              }}
              onWhatsAppOrder={handleGeneralWhatsAppOrder}
              totalCartCount={totalCartCount}
            />

            {/* Categories Showcase */}
            <CategoriesGrid
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const el = document.getElementById('products-catalog');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('products', { category: catId });
                }
              }}
            />

            {/* Direct Products Catalog on Home Page */}
            <div id="products-catalog" className="scroll-mt-20">
              <CatalogView
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onDirectWhatsApp={(prod, weight) =>
                  handleDirectWhatsAppProduct(prod, weight, 1)
                }
                cartItemsCountMap={cartItemsCountMap}
              />
            </div>

            {/* Customer Reviews Section */}
            <CustomerReviewsSection
              reviews={reviews}
              onOpenWriteReview={handleOpenWriteReview}
            />
          </>
        )}

        {/* PRODUCTS CATALOG VIEW */}
        {currentView === 'products' && (
          <CatalogView
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onDirectWhatsApp={(prod, weight) =>
              handleDirectWhatsAppProduct(prod, weight, 1)
            }
            cartItemsCountMap={cartItemsCountMap}
          />
        )}

        {/* ORDER TRACKING VIEW */}
        {currentView === 'track' && (
          <OrderTrackingView
            orders={orders}
            activeTrackingId={activeTrackingId}
            storeInfo={storeInfo}
            onWriteReview={handleOpenWriteReview}
          />
        )}

        {/* CUSTOMER REVIEWS VIEW */}
        {currentView === 'reviews' && (
          <CustomerReviewsSection
            reviews={reviews}
            onOpenWriteReview={handleOpenWriteReview}
          />
        )}



        {/* ABOUT US VIEW */}
        {currentView === 'about' && (
          <div className="py-16 bg-[#FBF9F5]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              {/* Header with Logo */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white p-2 border-2 border-[#C59B27]/70 shadow-lg flex items-center justify-center">
                  <img
                    src="/images/logo.png"
                    alt="Sri Venkateshwara Arisi Mandy Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-[#C59B27] font-bold block">
                    || {storeInfo.invocation || "ஸ்ரீ குழந்தை அம்மன் துணை"} ||
                  </span>
                  <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#133E2B]">
                    {storeInfo.name}
                  </h1>
                  <h2 className="text-lg sm:text-xl font-bold text-[#133E2B]/80 font-serif">
                    {storeInfo.tamilName || "ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி"}
                  </h2>
                  <p className="text-sm text-[#56645C] max-w-xl mx-auto pt-1">
                    Rice Wholesale Merchant &amp; Modern Rice Mill • Direct Mill Supply in 26kg Sacks
                  </p>
                </div>
              </div>

              {/* Main Profile & Proprietor Card */}
              <div className="bg-white rounded-3xl p-8 border border-[#E6E2D8] shadow-sm space-y-6 text-sm text-[#56645C] leading-relaxed">
                
                {/* Proprietor Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6CE8A]/50 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A27B16] tracking-wider block">
                      Management &amp; Leadership
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#133E2B]">
                      {storeInfo.proprietor || "G. Venkatesan Naicker"}
                    </h3>
                    <p className="text-xs text-[#56645C]">
                      {storeInfo.proprietorTamil || "G. வெங்கடேசன் நாயக்கர்"} — {storeInfo.proprietorTitle || "Managing Proprietor"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">GSTIN Registration</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#133E2B] bg-white px-2 py-1 rounded border border-[#E6E2D8] inline-block">
                      {storeInfo.gstin}
                    </span>
                  </div>
                </div>

                <p>
                  <strong>Sri Venkateshwara Arisi Mandy</strong> and <strong>Sri Venkateswara Modern Rice Mill</strong> stand as trusted names in wholesale rice merchant trade and modern milling across Chennai. Supplying premier 26kg sacks of Boiled Rice, Steam Rice, Raw Rice, and Idly Rice directly to families, caterers, hotels, and retail merchants <strong>exclusively across Chennai city and surrounding suburbs (PIN 600xxx)</strong>.
                </p>

                <div className="p-3 bg-[#EAF3EE] rounded-xl border border-[#133E2B]/20 text-xs text-[#133E2B] flex items-center justify-between">
                  <span className="font-bold">📍 Direct Doorstep Delivery Area:</span>
                  <span className="font-semibold">Exclusively Chennai City &amp; Suburbs (PIN 600001 - 600135)</span>
                </div>

                {/* Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Mandi */}
                  <div className="p-5 bg-gradient-to-br from-[#FBF9F5] to-white rounded-2xl border border-[#E6E2D8] space-y-2.5">
                    <div className="flex items-center gap-2 text-[#133E2B] font-bold text-sm">
                      <span className="w-7 h-7 rounded-lg bg-[#EAF3EE] flex items-center justify-center text-base">
                        🏪
                      </span>
                      <span>Wholesale Mandy (Main Office)</span>
                    </div>
                    <p className="text-xs text-[#56645C] leading-relaxed">
                      {storeInfo.address}
                    </p>
                    <p className="text-xs text-[#56645C] leading-relaxed font-tamil">
                      {storeInfo.mandiAddressTamil}
                    </p>
                    <div className="pt-1 text-xs text-[#133E2B] font-semibold space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span>📞 Phone:</span>
                        <a href="tel:9962119810" className="hover:underline text-[#C59B27] font-bold">99621 19810</a>
                        <span>,</span>
                        <a href="tel:9500014516" className="hover:underline text-[#C59B27] font-bold">95000 14516</a>
                      </div>
                    </div>
                  </div>

                  {/* Mill */}
                  <div className="p-5 bg-gradient-to-br from-[#FBF9F5] to-white rounded-2xl border border-[#E6E2D8] space-y-2.5">
                    <div className="flex items-center gap-2 text-[#133E2B] font-bold text-sm">
                      <span className="w-7 h-7 rounded-lg bg-[#FEF9EB] flex items-center justify-center text-base">
                        🏭
                      </span>
                      <span>Modern Rice Mill</span>
                    </div>
                    <h4 className="font-serif font-bold text-xs text-[#133E2B]">
                      {storeInfo.millName || "Sri Venkateswara Modern Rice Mill"}
                    </h4>
                    <p className="text-xs text-[#56645C] leading-relaxed">
                      {storeInfo.millAddress}
                    </p>
                    <p className="text-xs text-[#56645C] leading-relaxed font-tamil">
                      {storeInfo.millAddressTamil}
                    </p>
                    <div className="pt-1 text-xs text-[#133E2B] font-semibold space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span>📞 Phone:</span>
                        <a href="tel:9840280459" className="hover:underline text-[#C59B27] font-bold">98402 80459</a>
                        <span>,</span>
                        <a href="tel:8300230459" className="hover:underline text-[#C59B27] font-bold">83002 30459</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Quality Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8] text-center">
                    <ShieldCheck className="w-8 h-8 text-[#C59B27] mx-auto mb-2" />
                    <h3 className="font-serif font-bold text-sm text-[#133E2B]">100% Sortex Cleaned</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      High precision color sorting with zero stones, black grains, or impurities.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8] text-center">
                    <HeartHandshake className="w-8 h-8 text-[#133E2B] mx-auto mb-2" />
                    <h3 className="font-serif font-bold text-sm text-[#133E2B]">Wholesale Mill Rates</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct mill pricing on genuine 26kg sacks without retail middleman margins.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8] text-center">
                    <Sparkles className="w-8 h-8 text-[#C59B27] mx-auto mb-2" />
                    <h3 className="font-serif font-bold text-sm text-[#133E2B]">Aged Grains</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Naturally aged old paddy for non-sticky cooking and maximum elongation.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
                      'Vanakkam! I would like to inquire about 26kg rice sacks and wholesale rates at Sri Venkateshwara Arisi Mandy.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Chat with Mill Desk on WhatsApp ({storeInfo.displayPhone})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURE ADMIN DASHBOARD VIEW */}
        {currentView === 'admin' && (
          <AdminDashboard
            orders={orders}
            storeInfo={storeInfo}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onBackToStore={() => handleNavigate('home')}
            onOpenBannerManager={() => setIsBannerManagerOpen(true)}
            offerBanners={offerBanners}
            onDeleteBanner={handleDeleteBanner}
            onResetBanners={handleResetBanners}
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetProducts={handleResetProducts}
          />
        )}
      </main>

      {/* Footer */}
      <Footer storeInfo={storeInfo} onNavigate={handleNavigate} />

      {/* Modals & Drawers */}
      <ProductModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        initialWeight={selectedProductWeight}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={(prod, weight, qty) =>
          handleDirectWhatsAppProduct(prod, weight, qty)
        }
        onWriteReview={handleOpenWriteReview}
      />

      <BannerManagerModal
        isOpen={isBannerManagerOpen}
        onClose={() => setIsBannerManagerOpen(false)}
        banners={offerBanners}
        products={products}
        onSaveBanner={handleSaveBanner}
        onDeleteBanner={handleDeleteBanner}
        onResetBanners={handleResetBanners}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        storeInfo={storeInfo}
        onOrderPlaced={handleOrderPlaced}
        onCreateOrderService={createOrder}
      />

      {/* Select Products Prompt Modal (Shown when ordering via WhatsApp without selected products) */}
      <SelectProductsPromptModal
        isOpen={isSelectProductsModalOpen}
        onClose={() => setIsSelectProductsModalOpen(false)}
        onNavigateToCatalog={() => handleNavigate('products')}
        products={products}
        onAddToCartAndWhatsApp={handleAddToCartAndWhatsApp}
        onGeneralInquiry={handleGeneralMillInquiry}
        storeInfo={storeInfo}
      />

      {/* Write / Submit User Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewModalOpen}
        onClose={() => setIsWriteReviewModalOpen(false)}
        products={products}
        initialProductId={reviewProductId}
        onSubmitReview={handleSubmitReview}
      />

      {/* Order Confirmation Modal — Shows Order Number Before WhatsApp */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmationOpen}
        order={confirmedOrder}
        whatsappUrl={confirmedWhatsAppUrl}
        storeInfo={storeInfo}
        onClose={() => setIsOrderConfirmationOpen(false)}
        onTrackOrder={(orderId) => {
          setActiveTrackingId(orderId);
          setCurrentView('track');
        }}
      />

      {/* Persistent Floating Quick Actions (WhatsApp Order & Cart - Always visible while browsing) */}
      <aside aria-label="Quick Order Actions" className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 pointer-events-auto">
        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#133E2B] hover:bg-[#1C523B] text-white px-3.5 sm:px-4 py-3 rounded-full shadow-2xl border-2 border-[#C59B27] flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer animate-fade-in"
            title="Open WhatsApp Order Bag"
          >
            <ShoppingCart className="w-4 h-4 text-[#C59B27]" />
            <span>Bag ({totalCartCount})</span>
            <span className="bg-[#C59B27] text-[#0C2B1D] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              ₹{cartSubtotal.toLocaleString('en-IN')}
            </span>
          </button>
        )}

        <button
          onClick={handleGeneralWhatsAppOrder}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Order on WhatsApp / Chat with Mill Desk"
        >
          <WhatsAppIcon className="w-5 h-5 text-white shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-bold">
            {totalCartCount > 0 ? `WhatsApp Order (${totalCartCount})` : 'Order on WhatsApp'}
          </span>
          <span className="sm:hidden font-bold">
            {totalCartCount > 0 ? `(${totalCartCount})` : 'WhatsApp'}
          </span>
        </button>
      </aside>
    </div>
  );
}
