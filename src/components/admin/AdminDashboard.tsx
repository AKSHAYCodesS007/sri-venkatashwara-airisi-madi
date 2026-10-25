'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Order, StoreInfo, OfferBanner } from '@/types';
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
  Settings
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
}

const STATUS_STAGES = [
  { step: 1, label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { step: 2, label: 'Paddy Cleaned & Milled', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { step: 3, label: 'In Transit via Logistics', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { step: 4, label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
];

export default function AdminDashboard({
  orders,
  storeInfo,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBackToStore,
  onOpenBannerManager,
  offerBanners = [],
}: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

        {/* Secret Dashboard - Spotlight Banner Controller Card */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#143D2B] to-[#0C2B1D] p-4 sm:p-5 rounded-2xl border border-[#C59B27]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center text-[#FFD875] shrink-0">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-[#C59B27] text-[#0C2B1D] font-black uppercase px-2 py-0.5 rounded">
                  Private Admin Tool
                </span>
                <span className="text-xs text-[#FFD875] font-bold">
                  {offerBanners.length} Live Spotlight Banners
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-white mt-0.5">
                Spotlight Offer Banners &amp; Category Slides
              </h3>
              <p className="text-xs text-[#D5E6DC]">
                Add or edit slides, update headline discounts, link products, or reset to mill defaults safely from this dashboard.
              </p>
            </div>
          </div>

          {onOpenBannerManager && (
            <button
              onClick={onOpenBannerManager}
              className="px-5 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#dfb441] text-[#0C2B1D] text-xs font-black transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
            >
              <Settings className="w-4 h-4" />
              <span>Launch Banner Manager</span>
            </button>
          )}
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
    </div>
  );
}
