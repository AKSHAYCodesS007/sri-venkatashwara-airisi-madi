'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Order, StoreInfo, OfferBanner, Product, Category, ProductWeight } from '@/types';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Home,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Settings,
  RotateCcw,
  ShoppingBag,
  Edit3,
  Upload,
  Tag,
  Check,
  X,
  Image as ImageIcon,
  DollarSign,
  Percent
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface AdminDashboardProps {
  orders: Order[];
  storeInfo: StoreInfo;
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: string,
    newStep: number,
    logMessage?: string,
    location?: string
  ) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
  onBackToStore: () => void;
  onOpenBannerManager?: () => void;
  offerBanners?: OfferBanner[];
  onDeleteBanner?: (id: string) => Promise<void>;
  onResetBanners?: () => Promise<void>;
  products?: Product[];
  categories?: Category[];
  onSaveProduct?: (product: Product) => Promise<void>;
  onDeleteProduct?: (id: string) => Promise<void>;
  onResetProducts?: () => Promise<void>;
}

const STATUS_STAGES = [
  { step: 1, label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { step: 2, label: 'Paddy Cleaned & Milled', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { step: 3, label: 'In Transit via Logistics', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { step: 4, label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
];

const PRODUCT_IMAGE_PRESETS = [
  { label: 'AKS Bullet Boiled Rice', url: '/images/products/aks-bullet.jpg' },
  { label: 'Maharaja Eeyarakai Rice', url: '/images/products/maharaja-eeyarakai.jpg' },
  { label: 'Krishna Gold Sortex Rice', url: '/images/products/krishna-gold.jpg' },
  { label: 'UK Balaji Steam Rice', url: '/images/products/uk-balaji-steam-rice.jpg' },
  { label: 'MRN Old Raw Rice', url: '/images/products/mrn-old-raw-rice.jpg' },
  { label: 'Orange Idly Rice', url: '/images/products/orange-idly-rice.jpg' },
  { label: 'Royal Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Broken Rice / Kanji', url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80' },
  { label: 'Organic Red / Brown Rice', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80' },
];

const STANDARD_CATEGORIES = [
  { id: 'boiled-rice', name: 'Boiled Rice (புழுங்கல் அரிசி)' },
  { id: 'steam-rice', name: 'Steam Rice (ஸ்டீம் அரிசி)' },
  { id: 'raw-rice', name: 'Raw Rice (பச்சரிசி)' },
  { id: 'basmati-rice', name: 'Basmati Rice (பாஸ்மதி)' },
  { id: 'idly-rice', name: 'Idly Rice (இட்லி அரிசி)' },
  { id: 'broken-rice', name: 'Broken Rice (குருணை அரிசி)' },
  { id: 'organic-rice', name: 'Organic / Heritage (பாரம்பரிய அரிசி)' },
];

export default function AdminDashboard({
  orders,
  storeInfo,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBackToStore,
  onOpenBannerManager,
  offerBanners = [],
  onDeleteBanner,
  onResetBanners,
  products = [],
  categories = [],
  onSaveProduct,
  onDeleteProduct,
  onResetProducts,
}: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Admin Section Tab ('orders' | 'products' | 'banners')
  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'banners'>('orders');
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  // Product Catalog Management State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Inline Quick Price Editing
  const [quickEditProductId, setQuickEditProductId] = useState<string | null>(null);
  const [quickPriceInput, setQuickPriceInput] = useState<string>('');
  const [quickOriginalPriceInput, setQuickOriginalPriceInput] = useState<string>('');

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('boiled-rice');
  const [formOrigin, setFormOrigin] = useState('');
  const [formAging, setFormAging] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formWeights, setFormWeights] = useState<ProductWeight[]>([
    { weight: '26 kg', price: 1850, originalPrice: 2000, inStock: true }
  ]);

  // Dashboard Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Custom Dispatch Log State
  const [activeLogOrderId, setActiveLogOrderId] = useState<string | null>(null);
  const [customLogMessage, setCustomLogMessage] = useState('');
  const [customLogLocation, setCustomLogLocation] = useState('Chiikkarayapuram Mandi Hub, Chennai');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Check existing session via secure server endpoint
  useEffect(() => {
    async function checkServerSession() {
      try {
        const res = await fetch('/api/admin/verify');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        // Not authenticated
      }
    }
    checkServerSession();
  }, []);

  // Secure Server-Side Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passcodeInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasscodeInput('');
        setUsernameInput('');
      } else {
        setAuthError(data.error || 'Invalid administrative credentials. Access denied.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    setPasscodeInput('');
    setUsernameInput('');
  };

  // Status Change Handler
  const handleStatusChange = async (orderId: string, stage: typeof STATUS_STAGES[0]) => {
    setIsUpdating(orderId);
    try {
      await onUpdateOrderStatus(
        orderId,
        stage.label,
        stage.step,
        `Status updated to: ${stage.label}`,
        'Chiikkarayapuram Mandi Hub, Chennai'
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating order status');
    } finally {
      setIsUpdating(null);
    }
  };

  // Custom Log Submission
  const handleAddCustomLog = async (orderId: string) => {
    if (!customLogMessage.trim()) return;
    setIsUpdating(orderId);
    try {
      const order = orders.find((o) => o.orderId === orderId);
      const step = order ? order.currentStep : 3;
      const status = order ? order.status : 'In Transit via Logistics';

      await onUpdateOrderStatus(
        orderId,
        status,
        step,
        customLogMessage.trim(),
        customLogLocation.trim() || 'Chennai Logistics Route'
      );

      setCustomLogMessage('');
      setActiveLogOrderId(null);
    } catch (err) {
      console.error('Failed to add custom log:', err);
      alert('Error adding tracking log');
    } finally {
      setIsUpdating(null);
    }
  };

  // Delete Order Handler
  const handleDelete = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) {
      await onDeleteOrder(orderId);
    }
  };

  // Delete Banner Handler
  const handleDeleteBannerItem = async (bannerId: string, headline?: string) => {
    if (window.confirm(`Are you sure you want to permanently remove the banner "${headline || 'this banner'}" from the storefront?`)) {
      if (onDeleteBanner) {
        setDeletingBannerId(bannerId);
        try {
          await onDeleteBanner(bannerId);
        } catch (e) {
          console.error(e);
          alert('Failed to remove banner. Please try again.');
        } finally {
          setDeletingBannerId(null);
        }
      }
    }
  };

  // Reset Banners Handler
  const handleResetBannersAction = async () => {
    if (window.confirm('Reset all offer banners back to the default factory mill slides?')) {
      if (onResetBanners) {
        try {
          await onResetBanners();
        } catch (e) {
          console.error(e);
          alert('Failed to reset banners. Please try again.');
        }
      }
    }
  };

  // ===========================================================================
  // PRODUCT CATALOG MANAGEMENT HANDLERS
  // ===========================================================================

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = productSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      const matchCategory =
        productCategoryFilter === 'ALL' || p.category === productCategoryFilter;

      const matchStock =
        productStockFilter === 'ALL' ||
        (productStockFilter === 'IN_STOCK' ? p.inStock : !p.inStock);

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, productSearchQuery, productCategoryFilter, productStockFilter]);

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('boiled-rice');
    setFormOrigin('Sri Venkateswara Modern Rice Mill, Kolapakkam');
    setFormAging('Naturally Aged Old Crop');
    setFormBadge('Direct Mill');
    setFormDescription('Pure sortex-cleaned aged rice direct from mill.');
    setFormImage('/images/products/aks-bullet.jpg');
    setFormInStock(true);
    setFormWeights([
      { weight: '26 kg', price: 1850, originalPrice: 2000, inStock: true }
    ]);
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormOrigin(prod.origin || '');
    setFormAging(prod.aging || '');
    setFormBadge(prod.badge || '');
    setFormDescription(prod.description || '');
    setFormImage(prod.image);
    setFormInStock(prod.inStock);
    setFormWeights(
      prod.weights && prod.weights.length > 0
        ? prod.weights.map((w) => ({ ...w }))
        : [{ weight: prod.defaultWeight || '26 kg', price: 1850, originalPrice: 2000, inStock: true }]
    );
    setIsProductModalOpen(true);
  };

  // File Upload to DataURL
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add / Remove / Update weight rows in Modal
  const handleAddWeightRow = () => {
    setFormWeights((prev) => [
      ...prev,
      { weight: '10 kg', price: 800, originalPrice: 900, inStock: true }
    ]);
  };

  const handleRemoveWeightRow = (idx: number) => {
    if (formWeights.length <= 1) {
      alert('A product must have at least one weight package.');
      return;
    }
    setFormWeights((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateWeightRow = (idx: number, field: keyof ProductWeight, val: any) => {
    setFormWeights((prev) =>
      prev.map((w, i) => (i === idx ? { ...w, [field]: val } : w))
    );
  };

  // Save Product (Submit Modal)
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!formImage.trim()) {
      alert('Please provide or upload a product image');
      return;
    }
    if (formWeights.length === 0 || formWeights.some((w) => !w.weight.trim() || Number(w.price) <= 0)) {
      alert('Please provide at least one package with a valid price greater than 0.');
      return;
    }

    setIsSavingProduct(true);
    try {
      const prodId = editingProduct
        ? editingProduct.id
        : formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

      const updatedProduct: Product = {
        id: prodId,
        name: formName.trim().toUpperCase(),
        category: formCategory,
        origin: formOrigin.trim() || 'Direct Mill Supply, Chennai',
        aging: formAging.trim() || 'Naturally Aged Old Crop',
        description: formDescription.trim() || `${formName} freshly milled direct from Sri Venkateswara Modern Rice Mill.`,
        image: formImage.trim(),
        badge: formBadge.trim(),
        rating: editingProduct?.rating || 4.9,
        reviewCount: editingProduct?.reviewCount || 1,
        inStock: formInStock,
        defaultWeight: formWeights[0]?.weight || '26 kg',
        weights: formWeights.map((w) => ({
          weight: w.weight.trim(),
          price: Number(w.price),
          originalPrice: Number(w.originalPrice || w.price),
          inStock: w.inStock !== false,
        })),
      };

      if (onSaveProduct) {
        await onSaveProduct(updatedProduct);
      }
      setIsProductModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Fast In-Stock Toggle
  const handleToggleProductStock = async (product: Product) => {
    if (onSaveProduct) {
      const updated = { ...product, inStock: !product.inStock };
      await onSaveProduct(updated);
    }
  };

  // Quick Price Update (Inline on card)
  const handleStartQuickPrice = (product: Product) => {
    setQuickEditProductId(product.id);
    const primaryWeight = product.weights[0];
    setQuickPriceInput(String(primaryWeight?.price || ''));
    setQuickOriginalPriceInput(String(primaryWeight?.originalPrice || primaryWeight?.price || ''));
  };

  const handleSaveQuickPrice = async (product: Product) => {
    const newPrice = Number(quickPriceInput);
    const newOriginalPrice = Number(quickOriginalPriceInput);
    if (!newPrice || newPrice <= 0 || isNaN(newPrice)) {
      alert('Please enter a valid price');
      return;
    }

    if (onSaveProduct) {
      const updatedWeights = product.weights.map((w, idx) => {
        if (idx === 0) {
          return {
            ...w,
            price: newPrice,
            originalPrice: newOriginalPrice > 0 ? newOriginalPrice : Math.max(newPrice, w.originalPrice),
          };
        }
        return w;
      });
      const updated: Product = { ...product, weights: updatedWeights };
      await onSaveProduct(updated);
    }
    setQuickEditProductId(null);
  };

  // Delete Product
  const handleDeleteProductAction = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to permanently remove "${productName}" from the storefront catalog?`)) {
      if (onDeleteProduct) {
        setDeletingProductId(productId);
        try {
          await onDeleteProduct(productId);
        } catch (e) {
          console.error(e);
          alert('Failed to delete product.');
        } finally {
          setDeletingProductId(null);
        }
      }
    }
  };

  // Reset Products to Defaults
  const handleResetProductsAction = async () => {
    if (window.confirm('Reset all catalog products back to original factory mill items? Any custom products will be reverted.')) {
      if (onResetProducts) {
        try {
          await onResetProducts();
        } catch (e) {
          console.error(e);
          alert('Failed to reset products.');
        }
      }
    }
  };

  // WhatsApp Customer Notifier
  const handleNotifyCustomerWhatsApp = (order: Order) => {
    const phoneMatch = order.deliveryAddress.match(/\b\d{10}\b/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    let text = `🌾 *SRI VENKATESHWARA ARISI MANDY — ORDER UPDATE*\n\n`;
    text += `Namaste! Update regarding your 26kg Rice Order *#${order.orderId}*:\n`;
    text += `📦 *Current Status:* ${order.status}\n`;
    text += `🚚 *Delivery Address:* ${order.deliveryAddress}\n`;
    text += `💰 *Total Amount:* ₹${order.total} (${order.paymentMethod})\n\n`;
    text += `Our logistics van is coordinating dispatch across Chennai. For inquiries, call us at 99621 19810. Thank you!`;

    const encoded = encodeURIComponent(text);
    const url = phone ? `https://wa.me/91${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const inTransitCount = orders.filter(
      (o) => o.status.toLowerCase().includes('transit') || o.currentStep === 3
    ).length;
    const deliveredCount = orders.filter(
      (o) => o.status.toLowerCase().includes('deliver') || o.currentStep === 4
    ).length;
    const pendingCount = totalOrders - deliveredCount;

    return { totalOrders, totalRevenue, inTransitCount, deliveredCount, pendingCount };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedStatusFilter === 'ALL') return true;
      if (selectedStatusFilter === 'PLACED') return o.currentStep === 1;
      if (selectedStatusFilter === 'MILLED') return o.currentStep === 2;
      if (selectedStatusFilter === 'TRANSIT') return o.currentStep === 3;
      if (selectedStatusFilter === 'DELIVERED') return o.currentStep === 4;

      return true;
    });
  }, [orders, searchQuery, selectedStatusFilter]);

  // 1. SECURE LOGIN SCREEN (Shown if not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FBF9F5]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#C59B27]/40 shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#0C2B1D] text-white p-6 text-center border-b border-[#1C523B]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#133E2B] border border-[#C59B27] flex items-center justify-center text-[#C59B27] mb-3 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
              Management Portal
            </span>
            <h2 className="font-serif text-xl font-bold text-white mt-1.5">
              Admin &amp; Logistics Login
            </h2>
            <p className="text-xs text-[#AECDBB] mt-1">
              Sri Venkateshwara Arisi Mandy • Chiikkarayapuram Hub
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Identifier
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                autoComplete="off"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5] font-semibold"
                placeholder="Enter authorized administrator ID"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Secret Passphrase / Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-[#FBF9F5] font-semibold tracking-wider"
                  placeholder="••••••••••••••••••••••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-black cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Protected by server-side encrypted authentication.</span>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#C59B27] animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-[#C59B27]" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToStore}
                className="text-xs text-gray-500 hover:text-[#133E2B] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F4F1EA] py-8 px-4 sm:px-6 lg:px-8 text-[#19241F]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Command Bar */}
        <div className="bg-[#0C2B1D] text-white p-5 sm:p-6 rounded-3xl border border-[#1C523B] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#133E2B] border border-[#C59B27] flex items-center justify-center text-[#C59B27] shadow-sm flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  Admin Command Center
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Authenticated
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {storeInfo.name} — Logistics &amp; Delivery Controller
              </h1>
              <p className="text-xs text-[#AECDBB]">
                Control real-time dispatch, update customer delivery stages, and broadcast status.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Session</span>
            </div>

            {onOpenBannerManager && (
              <button
                onClick={onOpenBannerManager}
                className="px-3.5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Manage customer spotlight banners, headline texts, images & offers"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0C2B1D]" />
                <span>Manage Spotlight Banners</span>
              </button>
            )}

            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Storefront</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Orders vs Products vs Spotlight Banners */}
        <div className="flex items-center gap-2 border-b border-[#E6E2D8] pb-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
              adminTab === 'orders'
                ? 'bg-[#133E2B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-[#133E2B] border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4 text-[#C59B27]" />
            <span>Orders &amp; Dispatch</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                adminTab === 'orders'
                  ? 'bg-[#C59B27] text-[#0C2B1D]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
              adminTab === 'products'
                ? 'bg-[#133E2B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-[#133E2B] border border-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
            <span>Products &amp; Pricing</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                adminTab === 'products'
                  ? 'bg-[#C59B27] text-[#0C2B1D]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('banners')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shrink-0 ${
              adminTab === 'banners'
                ? 'bg-[#133E2B] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:text-[#133E2B] border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C59B27]" />
            <span>Spotlight Banners</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                adminTab === 'banners'
                  ? 'bg-[#C59B27] text-[#0C2B1D]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {offerBanners.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS & PRICING CONTROLLER */}
        {adminTab === 'products' && (
          <div className="space-y-5 animate-fade-in">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#0C2B1D] via-[#143D2B] to-[#0C2B1D] p-5 sm:p-6 rounded-3xl border border-[#C59B27]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center text-[#FFD875] shrink-0">
                  <ShoppingBag className="w-6 h-6 text-[#C59B27]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-[#C59B27] text-[#0C2B1D] font-black uppercase px-2 py-0.5 rounded">
                      Live Storefront Catalog
                    </span>
                    <span className="text-xs text-[#FFD875] font-bold">
                      {products.length} Products Active
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl text-white mt-1">
                    Rice Catalog &amp; Wholesale Pricing Manager
                  </h2>
                  <p className="text-xs text-[#D5E6DC]">
                    Add new varieties with images, change selling &amp; MRP prices, update descriptions, or toggle stock availability.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {onResetProducts && (
                  <button
                    type="button"
                    onClick={handleResetProductsAction}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Restore default factory mill products"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Reset Defaults</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#0C2B1D]" />
                  <span>+ Add New Product</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E6E2D8] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Catalog</span>
                <span className="font-serif text-xl font-bold text-[#133E2B]">{products.length} Items</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E6E2D8] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">In Stock Ready</span>
                <span className="font-serif text-xl font-bold text-emerald-700">
                  {products.filter((p) => p.inStock).length} Available
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E6E2D8] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Out of Stock</span>
                <span className="font-serif text-xl font-bold text-red-600">
                  {products.filter((p) => !p.inStock).length} Sold Out
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E6E2D8] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Categories</span>
                <span className="font-serif text-xl font-bold text-[#C59B27]">
                  {new Set(products.map((p) => p.category)).size} Varieties
                </span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search by Rice Name, Mill Origin, Category..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>

                {/* Stock Filter */}
                <div className="flex items-center gap-1.5 w-full md:w-auto text-xs font-bold">
                  <span className="text-gray-400 text-[11px] mr-1 hidden sm:inline">Stock:</span>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      productStockFilter === 'ALL'
                        ? 'bg-[#133E2B] text-white border-[#133E2B]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('IN_STOCK')}
                    className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      productStockFilter === 'IN_STOCK'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    In Stock ({products.filter((p) => p.inStock).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter('OUT_OF_STOCK')}
                    className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      productStockFilter === 'OUT_OF_STOCK'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    Out of Stock ({products.filter((p) => !p.inStock).length})
                  </button>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
                <span className="text-gray-400 text-[11px] shrink-0 mr-1">Category:</span>
                <button
                  type="button"
                  onClick={() => setProductCategoryFilter('ALL')}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                    productCategoryFilter === 'ALL'
                      ? 'bg-[#C59B27] text-[#0C2B1D] font-black'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Varieties
                </button>
                {STANDARD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                      productCategoryFilter === cat.id
                        ? 'bg-[#C59B27] text-[#0C2B1D] font-black'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => {
                  const isDeleting = deletingProductId === prod.id;
                  const isQuickEditing = quickEditProductId === prod.id;
                  const primaryWeight = prod.weights[0] || { weight: '26kg', price: 0, originalPrice: 0 };
                  const savings = (primaryWeight.originalPrice || primaryWeight.price) - primaryWeight.price;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-[#E6E2D8] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                    >
                      {/* Product Image & Badges */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-gray-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#0C2B1D] text-[#C59B27] px-2 py-0.5 rounded shadow-sm border border-[#C59B27]/40">
                            {prod.category}
                          </span>
                          {prod.badge && (
                            <span className="text-[10px] font-bold bg-[#C59B27] text-[#0C2B1D] px-2 py-0.5 rounded shadow-sm">
                              {prod.badge}
                            </span>
                          )}
                        </div>

                        {/* In Stock Status Pill */}
                        <div className="absolute top-2 right-2">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStock(prod)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md cursor-pointer transition flex items-center gap-1 ${
                              prod.inStock
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            title="Click to toggle In Stock / Out of Stock"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${prod.inStock ? 'bg-white animate-pulse' : 'bg-white'}`} />
                            <span>{prod.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </div>

                        {/* Weight Pill */}
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[10px] font-bold bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono">
                            {prod.weights.length > 1 ? `${prod.weights.length} Packs` : primaryWeight.weight}
                          </span>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="font-serif font-bold text-sm text-[#133E2B] leading-snug line-clamp-2">
                            {prod.name}
                          </h3>

                          <p className="text-[11px] text-[#A27B16] font-semibold truncate">
                            📍 {prod.origin || 'Sri Venkateswara Modern Rice Mill'}
                          </p>

                          <p className="text-[11px] text-gray-500 line-clamp-2">
                            {prod.description}
                          </p>
                        </div>

                        {/* Price & Weight Box */}
                        <div className="bg-[#FBF9F5] p-3 rounded-xl border border-[#E6E2D8] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-gray-400">
                              Wholesale Price ({primaryWeight.weight}):
                            </span>
                            {savings > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Save ₹{savings}
                              </span>
                            )}
                          </div>

                          {isQuickEditing ? (
                            <div className="space-y-2 pt-1 animate-fade-in">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">
                                    Selling Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={quickPriceInput}
                                    onChange={(e) => setQuickPriceInput(e.target.value)}
                                    className="w-full text-xs font-bold p-1.5 border rounded-lg bg-white focus:outline-none focus:border-[#133E2B]"
                                    autoFocus
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] uppercase font-bold text-gray-500 block mb-0.5">
                                    MRP / Original (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={quickOriginalPriceInput}
                                    onChange={(e) => setQuickOriginalPriceInput(e.target.value)}
                                    className="w-full text-xs font-bold p-1.5 border rounded-lg bg-white focus:outline-none focus:border-[#133E2B]"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setQuickEditProductId(null)}
                                  className="px-2 py-1 text-[11px] text-gray-500 hover:text-black rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickPrice(prod)}
                                  className="px-3 py-1 bg-[#133E2B] text-white text-[11px] font-bold rounded-lg hover:bg-[#1C523B]"
                                >
                                  Save Price
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="font-serif font-black text-lg text-[#133E2B]">
                                  ₹{primaryWeight.price}
                                </span>
                                {primaryWeight.originalPrice > primaryWeight.price && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{primaryWeight.originalPrice}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleStartQuickPrice(prod)}
                                className="text-[11px] font-bold text-[#A27B16] hover:text-[#133E2B] flex items-center gap-1 cursor-pointer underline"
                                title="Quick update price"
                              >
                                <Tag className="w-3 h-3" />
                                <span>Quick Price</span>
                              </button>
                            </div>
                          )}

                          {/* Extra weights preview if any */}
                          {prod.weights.length > 1 && (
                            <div className="pt-1.5 border-t border-gray-200/60 flex items-center gap-1.5 flex-wrap">
                              {prod.weights.map((w, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-medium"
                                >
                                  {w.weight}: <strong>₹{w.price}</strong>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions Bar */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#133E2B] text-gray-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs flex-1 justify-center"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#C59B27]" />
                            <span>Edit Details &amp; Prices</span>
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDeleteProductAction(prod.id, prod.name)}
                            className="p-2 rounded-xl text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 transition cursor-pointer disabled:opacity-50"
                            title="Delete this product from catalog"
                          >
                            {isDeleting ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#C59B27]/60" />
                <h3 className="font-serif font-bold text-base text-[#133E2B]">
                  No Products Match Your Search
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Try clearing your search query or switching categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setProductSearchQuery('');
                    setProductCategoryFilter('ALL');
                    setProductStockFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#133E2B] text-white text-xs font-bold hover:bg-[#1C523B] transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPOTLIGHT BANNERS CONTROLLER & REMOVAL VIEW */}
        {adminTab === 'banners' && (
          <div className="space-y-5 animate-fade-in">
            {/* Banner Management Header Card */}
            <div className="bg-gradient-to-r from-[#0C2B1D] via-[#143D2B] to-[#0C2B1D] p-5 sm:p-6 rounded-3xl border border-[#C59B27]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center text-[#FFD875] shrink-0">
                  <Sparkles className="w-6 h-6 text-[#C59B27]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-[#C59B27] text-[#0C2B1D] font-black uppercase px-2 py-0.5 rounded">
                      Live Storefront Controller
                    </span>
                    <span className="text-xs text-[#FFD875] font-bold">
                      {offerBanners.length} Active Slides
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl text-white mt-1">
                    Manage &amp; Remove Spotlight Banners
                  </h2>
                  <p className="text-xs text-[#D5E6DC]">
                    Remove unwanted slides, upload new promotions, or restore factory defaults. Changes sync instantly to customers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {onResetBanners && (
                  <button
                    type="button"
                    onClick={handleResetBannersAction}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Restore default mill slides"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Reset Defaults</span>
                  </button>
                )}

                {onOpenBannerManager && (
                  <button
                    type="button"
                    onClick={onOpenBannerManager}
                    className="px-4 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#0C2B1D]" />
                    <span>+ Add New Banner</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Active Banners with One-Click Remove Button */}
            {offerBanners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offerBanners.map((banner, index) => {
                  const isDeleting = deletingBannerId === banner.id;
                  return (
                    <div
                      key={banner.id || index}
                      className="bg-white rounded-2xl border border-[#E6E2D8] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                    >
                      {/* Banner Image Preview */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-gray-100">
                        <img
                          src={banner.image}
                          alt={banner.headline}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#C59B27] text-[#0C2B1D] px-2 py-0.5 rounded shadow-sm">
                            {banner.discount || 'Special Offer'}
                          </span>
                          {banner.badge && (
                            <span className="text-[10px] font-bold bg-[#133E2B] text-white px-2 py-0.5 rounded shadow-sm">
                              {banner.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[10px] font-bold bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono">
                            Slide #{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Banner Information Body */}
                      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="font-semibold text-[#133E2B] truncate">
                              {banner.brand || 'Heritage Mill'}
                            </span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-[10px] text-gray-700">
                              Pack: {banner.weight || '26kg'}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-sm text-[#133E2B] leading-snug line-clamp-2">
                            {banner.headline}
                          </h3>

                          <div className="pt-1 text-[11px] text-gray-600 bg-[#FBF9F5] p-2 rounded-lg border border-gray-200/80">
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">
                              Linked Product:
                            </span>
                            <span className="font-semibold text-[#133E2B] truncate block">
                              {banner.productId}
                            </span>
                          </div>
                        </div>

                        {/* Banner Action Bar */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live on Storefront
                          </span>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDeleteBannerItem(banner.id, banner.headline)}
                            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            title="Remove this banner from homepage spotlight carousel"
                          >
                            {isDeleting ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Banner</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500 space-y-3">
                <Sparkles className="w-12 h-12 mx-auto text-[#C59B27]/60" />
                <h3 className="font-serif font-bold text-base text-[#133E2B]">
                  No Spotlight Banners Found
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  All banners have been removed. You can create a new spotlight banner or restore the mill default slides.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  {onResetBanners && (
                    <button
                      type="button"
                      onClick={handleResetBannersAction}
                      className="px-4 py-2 rounded-xl bg-[#133E2B] text-white text-xs font-bold hover:bg-[#1C523B] transition cursor-pointer"
                    >
                      Restore Factory Defaults
                    </button>
                  )}
                  {onOpenBannerManager && (
                    <button
                      type="button"
                      onClick={onOpenBannerManager}
                      className="px-4 py-2 rounded-xl bg-[#C59B27] text-[#0C2B1D] text-xs font-black hover:bg-[#dfb441] transition cursor-pointer"
                    >
                      + Add New Banner
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS & DELIVERY DISPATCH CONTROLLER */}
        {adminTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Banner Status Strip */}
            <div className="bg-gradient-to-r from-[#0C2B1D] via-[#143D2B] to-[#0C2B1D] p-4 rounded-2xl border border-[#C59B27]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center text-[#FFD875] shrink-0">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-[#C59B27] text-[#0C2B1D] font-black uppercase px-1.5 py-0.5 rounded">
                      Spotlight Offers
                    </span>
                    <span className="text-xs text-[#FFD875] font-bold">
                      {offerBanners.length} Live Banners Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D5E6DC]">
                    Need to remove or edit promotional slides on the storefront?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdminTab('banners')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#0C2B1D]" />
                  <span>View &amp; Remove Banners</span>
                </button>
              </div>
            </div>

            {/* Real-time Order Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E6E2D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                  <span>Total Orders</span>
                  <Package className="w-4 h-4 text-[#C59B27]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#133E2B]">
                  {metrics.totalOrders}
                </div>
                <p className="text-[11px] text-gray-400">Lifetime mill orders logged</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E2D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                  <span>Total Sales Volume</span>
                  <span className="text-[#133E2B] font-bold">₹</span>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-[#133E2B]">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">Doorstep COD / UPI collections</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E2D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                  <span>In Transit / Pending</span>
                  <Truck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-purple-700">
                  {metrics.pendingCount}
                </div>
                <p className="text-[11px] text-purple-600 font-semibold">{metrics.inTransitCount} currently en route</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E2D8] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                  <span>Completed Deliveries</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-black text-emerald-700">
                  {metrics.deliveredCount}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">Successfully handed over</p>
              </div>
            </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6E2D8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by Order ID, Area, Customer, Rice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto text-xs font-bold">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-[#133E2B] text-white border-[#133E2B]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('PLACED')}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedStatusFilter === 'PLACED'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              1. Placed
            </button>
            <button
              onClick={() => setSelectedStatusFilter('MILLED')}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedStatusFilter === 'MILLED'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              2. Milled
            </button>
            <button
              onClick={() => setSelectedStatusFilter('TRANSIT')}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedStatusFilter === 'TRANSIT'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
              }`}
            >
              3. In Transit
            </button>
            <button
              onClick={() => setSelectedStatusFilter('DELIVERED')}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                selectedStatusFilter === 'DELIVERED'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              4. Delivered
            </button>
          </div>
        </div>

        {/* Orders List / Controller Cards */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const currentStage =
                STATUS_STAGES.find((s) => s.step === order.currentStep) || STATUS_STAGES[0];
              const isUpdatingThis = isUpdating === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-[#E6E2D8] shadow-sm hover:shadow-md transition p-5 sm:p-6 space-y-4 relative"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-serif text-xl font-bold text-[#133E2B]">
                        #{order.orderId}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.date}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentStage.color}`}
                      >
                        ● {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Price Badge */}
                      <span className="font-serif font-black text-lg text-[#133E2B]">
                        ₹{order.total}
                      </span>
                      <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                        {order.paymentMethod}
                      </span>

                      {/* WhatsApp Notify Button */}
                      <button
                        onClick={() => handleNotifyCustomerWhatsApp(order)}
                        className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ml-2"
                        title="Broadcast status update to customer on WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        <span className="hidden sm:inline">WhatsApp Customer</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(order.orderId)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery & Items Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Destination Address */}
                    <div className="md:col-span-6 bg-[#FBF9F5] p-3.5 rounded-xl border border-gray-200/80 space-y-1">
                      <span className="font-bold text-[#133E2B] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Delivery Address &amp; Customer</span>
                      </span>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {order.deliveryAddress}
                      </p>
                    </div>

                    {/* Sacks & Bags Packed */}
                    <div className="md:col-span-6 bg-[#FBF9F5] p-3.5 rounded-xl border border-gray-200/80 space-y-1">
                      <span className="font-bold text-[#133E2B] flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Bags Ordered ({order.items.reduce((acc, i) => acc + i.quantity, 0)} sacks)</span>
                      </span>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>
                              {item.name} ({item.weight}) × {item.quantity}
                            </span>
                            <span className="font-semibold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DIRECT DELIVERY STATUS CONTROLLER (One-Click Actions) */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#133E2B] uppercase tracking-wider">
                        Set Current Delivery Stage (Live Customer Update):
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveLogOrderId(activeLogOrderId === order.orderId ? null : order.orderId)
                        }
                        className="text-xs text-[#133E2B] hover:text-[#C59B27] font-bold flex items-center gap-1 underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Custom Transit Log Note</span>
                      </button>
                    </div>

                    {/* 4 Interactive Status Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STATUS_STAGES.map((stage) => {
                        const isCurrent = order.currentStep === stage.step;
                        return (
                          <button
                            key={stage.step}
                            type="button"
                            disabled={isUpdatingThis}
                            onClick={() => handleStatusChange(order.orderId, stage)}
                            className={`p-2.5 rounded-xl border font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                              isCurrent
                                ? 'bg-[#133E2B] text-white border-[#133E2B] shadow-md ring-2 ring-[#C59B27]'
                                : 'bg-[#FBF9F5] text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-white'
                            }`}
                          >
                            {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27]" />}
                            <span>
                              {stage.step}. {stage.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Transit Note Form (Expandable) */}
                  {activeLogOrderId === order.orderId && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2.5 animate-fade-in text-xs">
                      <div className="flex justify-between items-center font-bold text-emerald-900">
                        <span>Add Custom Dispatch / Transit Activity Entry</span>
                        <button
                          onClick={() => setActiveLogOrderId(null)}
                          className="text-gray-500 hover:text-black"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Log message (e.g. Dispatched in Van #4 via Driver Murugan)"
                          value={customLogMessage}
                          onChange={(e) => setCustomLogMessage(e.target.value)}
                          className="p-2 border rounded-lg bg-white focus:outline-none focus:border-[#133E2B]"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Porur Junction / Chiikkarayapuram Mandi)"
                          value={customLogLocation}
                          onChange={(e) => setCustomLogLocation(e.target.value)}
                          className="p-2 border rounded-lg bg-white focus:outline-none focus:border-[#133E2B]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddCustomLog(order.orderId)}
                        disabled={!customLogMessage.trim()}
                        className="px-4 py-2 bg-[#133E2B] hover:bg-[#1C523B] text-white font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
                      >
                        Publish Transit Update to Customer Track Page
                      </button>
                    </div>
                  )}

                  {/* Activity History Preview */}
                  {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3 h-3 text-[#C59B27] flex-shrink-0" />
                        <span className="font-semibold text-gray-800">Latest Log:</span>
                        <span className="truncate">{order.trackingUpdates[0].status}</span>
                        <span className="text-gray-400">({order.trackingUpdates[0].location})</span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                        {order.trackingUpdates[0].time}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 text-xs space-y-2">
              <Package className="w-10 h-10 mx-auto text-gray-300" />
              <p className="font-bold text-gray-700 text-sm">No orders match your filter</p>
              <p>Try clearing your search query or selecting a different status filter.</p>
            </div>
          )}
        </div>
          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#C59B27]/40 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0C2B1D] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#1C523B]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center text-[#FFD875]">
                  <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono bg-[#C59B27] text-[#0C2B1D] font-extrabold uppercase px-1.5 py-0.5 rounded">
                    {editingProduct ? 'Edit Existing Rice Item' : 'New Rice Item'}
                  </span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-0.5">
                    {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Rice Product to Storefront'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProductSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="font-bold text-[#133E2B] block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. MAHARAJA EEYARAKAI BRAND / ROYAL BASMATI"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] font-bold"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#133E2B] block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-white font-semibold"
                  >
                    {STANDARD_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#133E2B] block mb-1">
                    Promotional Badge (e.g. Mill Direct, 100% Sortex, King of Rice)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. 100% Sortex / Best Seller"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                </div>
              </div>

              {/* Image Upload & Presets */}
              <div className="space-y-2 bg-[#FBF9F5] p-3.5 rounded-2xl border border-gray-200">
                <label className="font-bold text-[#133E2B] block">
                  Product Image * (Upload File or Enter Image URL)
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* File Upload */}
                  <label className="flex-1 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] bg-white rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5">
                    <Upload className="w-5 h-5 text-[#C59B27]" />
                    <span className="text-xs font-semibold text-gray-700">Choose Image from Device</span>
                    <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* URL Input */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[11px] text-gray-500 mb-1">Or direct image URL:</span>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="/images/products/aks-bullet.jpg or https://..."
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#133E2B]"
                    />
                  </div>
                </div>

                {/* Popular Presets Quick Selector */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Or select a pre-loaded authentic rice photo:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {PRODUCT_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`px-2 py-1 rounded-lg text-[10px] border whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                          formImage === preset.url
                            ? 'bg-[#133E2B] text-white border-[#133E2B] font-bold'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#C59B27]'
                        }`}
                      >
                        <ImageIcon className="w-2.5 h-2.5 text-[#C59B27]" />
                        <span>{preset.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {formImage && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                    <img
                      src={formImage}
                      alt="Product preview"
                      className="w-16 h-14 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#133E2B] block">Image Ready</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Will be displayed in catalog, search, and cart
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight Packages & Pricing (Multi-pack support) */}
              <div className="space-y-2 bg-[#FBF9F5] p-3.5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-[#133E2B] block">
                      Weight Packages &amp; Pricing *
                    </label>
                    <span className="text-[11px] text-gray-500">
                      Set selling price &amp; MRP. The first weight is the default package shown on catalog.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWeightRow}
                    className="px-2.5 py-1 rounded-lg bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Pack</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formWeights.map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-gray-200 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-4">
                        <label className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">
                          Pack Size (e.g. 26kg)
                        </label>
                        <input
                          type="text"
                          required
                          value={w.weight}
                          onChange={(e) => handleUpdateWeightRow(idx, 'weight', e.target.value)}
                          placeholder="26 kg"
                          className="w-full p-2 border rounded-lg font-bold text-xs focus:outline-none focus:border-[#133E2B]"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={w.price}
                          onChange={(e) => handleUpdateWeightRow(idx, 'price', e.target.value)}
                          placeholder="1850"
                          className="w-full p-2 border rounded-lg font-bold text-xs focus:outline-none focus:border-[#133E2B]"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">
                          MRP Price (₹)
                        </label>
                        <input
                          type="number"
                          required
                          value={w.originalPrice}
                          onChange={(e) => handleUpdateWeightRow(idx, 'originalPrice', e.target.value)}
                          placeholder="2000"
                          className="w-full p-2 border rounded-lg font-bold text-xs focus:outline-none focus:border-[#133E2B]"
                        />
                      </div>

                      <div className="col-span-2 text-right pt-3">
                        {formWeights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWeightRow(idx)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Remove pack"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mill Origin & Aging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#133E2B] block mb-1">
                    Mill Origin / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    placeholder="e.g. Sri Venkateswara Modern Rice Mill, Kolapakkam"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#133E2B] block mb-1">
                    Grain Curing &amp; Aging
                  </label>
                  <input
                    type="text"
                    value={formAging}
                    onChange={(e) => setFormAging(e.target.value)}
                    placeholder="e.g. Naturally Aged Old Crop / 100% Sortex"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="flex items-center gap-2 p-3 bg-[#FBF9F5] rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="formInStock"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-[#133E2B] cursor-pointer"
                />
                <label htmlFor="formInStock" className="font-bold text-[#133E2B] cursor-pointer">
                  In Stock &amp; Available for Chennai Doorstep Delivery
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#133E2B] block mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe aroma, fluffiness, grain elongation, cooking texture, and suitability..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-xl bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C59B27]" />
                      <span>Saving to Storefront...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#C59B27]" />
                      <span>{editingProduct ? 'Update Product Details' : 'Publish New Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
