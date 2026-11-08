'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, StoreInfo, Order } from '@/types';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  storeInfo: StoreInfo;
  onOrderPlaced: (order: Order, whatsappUrl?: string) => void;
  onCreateOrderService: (orderData: Partial<Order>) => Promise<Order>;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  storeInfo,
  onOrderPlaced,
  onCreateOrderService,
}: CartDrawerProps) {
  const isIndianPincode = (pin: string) => {
    const cleaned = pin.trim();
    return /^[1-9][0-9]{5}$/.test(cleaned);
  };

  const [showAddressFields, setShowAddressFields] = useState(false);

  // Guest customer & delivery details (no login or account needed; remembered on device)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved guest details from device localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rice_guest_delivery_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) setCustomerName(parsed.name);
          if (parsed.phone) setCustomerPhone(parsed.phone);
          if (parsed.address) setDeliveryAddress(parsed.address);
          if (parsed.area) setDeliveryArea(parsed.area);
          if (parsed.pincode) setDeliveryPincode(parsed.pincode);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveGuestDeliveryInfo = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'rice_guest_delivery_info',
          JSON.stringify({
            name: customerName,
            phone: customerPhone,
            address: deliveryAddress,
            area: deliveryArea,
            pincode: deliveryPincode,
          })
        );
      } catch (e) {
        // ignore
      }
    }
  };

  const handlePincodeChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    setDeliveryPincode(digits);
    if (digits.length === 6) {
      if (!/^[1-9][0-9]{5}$/.test(digits)) {
        setPincodeError('⚠️ Please enter a valid 6-digit Indian PIN code.');
      } else {
        setPincodeError('');
      }
    } else {
      setPincodeError('');
    }
  };

  if (!isOpen) return null;

  // Subtotal & Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const itemSavings = originalSubtotal - subtotal;
  const finalTotal = subtotal;

  // Exclusive WhatsApp Order Desk Checkout
  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    if (deliveryPincode && deliveryPincode.length === 6 && !isIndianPincode(deliveryPincode)) {
      alert('Please enter a valid 6-digit Indian PIN code for Pan-India doorstep delivery.');
      return;
    }

    setIsSubmitting(true);
    saveGuestDeliveryInfo();

    const formattedAddress = deliveryAddress.trim()
      ? `${deliveryAddress.trim()}${deliveryArea.trim() ? `, ${deliveryArea.trim()}` : ''}${deliveryPincode.trim() ? ` - PIN: ${deliveryPincode.trim()}` : ''}${customerName.trim() ? ` (${customerName.trim()}, ${customerPhone.trim()})` : ''}`
      : 'Doorstep Delivery (All Over India)';

    const orderPayload: Partial<Order> = {
      items: cartItems.map((item) => ({
        name: item.name,
        weight: item.weight,
        quantity: item.quantity,
        price: item.price,
      })),
      total: finalTotal,
      deliveryAddress: formattedAddress,
      paymentMethod: 'WhatsApp Order (Cash / UPI on Delivery)',
    };

    let createdOrder: Order | null = null;
    try {
      createdOrder = await onCreateOrderService(orderPayload);
    } catch (e) {
      console.warn('Local offline order fallback:', e);
      createdOrder = {
        orderId: 'RS' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: orderPayload.items || [],
        total: finalTotal,
        status: 'Order Placed',
        currentStep: 1,
        deliveryAddress: formattedAddress,
        paymentMethod: 'WhatsApp Order (Cash / UPI on Delivery)',
        trackingUpdates: [
          {
            status: 'Order Registered & Verified',
            location: 'Chiikkarayapuram Mandi Hub, Chennai',
            time: 'Just now',
          },
        ],
      };
    } finally {
      setIsSubmitting(false);
    }

    // Build Clean Direct WhatsApp Message
    let text = `🌾 *NEW RICE ORDER — ${storeInfo.name.toUpperCase()}*\n`;
    text += `📍 *Service Area: All Over India (Pan-India Delivery)*\n`;
    if (createdOrder?.orderId) {
      text += `🔖 *Order Tracking ID:* #${createdOrder.orderId}\n`;
    }
    if (customerName.trim()) {
      text += `👤 *Customer:* ${customerName.trim()}${customerPhone.trim() ? ` (${customerPhone.trim()})` : ''}\n`;
    }
    if (deliveryAddress.trim()) {
      text += `🏠 *Delivery Address:* ${deliveryAddress.trim()}${deliveryArea.trim() ? `, ${deliveryArea.trim()}` : ''}, Chennai - ${deliveryPincode.trim() || '600xxx'}\n`;
    }
    text += `\n*ITEMS ORDERED:*\n`;

    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (${item.weight})\n   Qty: ${item.quantity} bag(s) @ ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });

    text += `\n*TOTAL PAYABLE (COD / UPI): ₹${finalTotal}*`;
    text += `\n\n_Vanakkam! Please confirm dispatch and shipping schedule to delivery address. Payment via Cash / UPI on arrival._`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${storeInfo.whatsappNumber}?text=${encoded}`;

    if (createdOrder) {
      onOrderPlaced(createdOrder, url);
    }
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col text-[#19241F]">
          
          {/* Header */}
          <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#52B82E]" />
              <h3 className="font-serif font-bold text-base">Shopping Bag</h3>
              <span className="text-xs bg-[#52B82E] text-white px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded hover:bg-white/10 transition cursor-pointer flex items-center gap-1"
                  title="Remove all items from bag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Exclusive Chennai Delivery Notice */}
          <div className="bg-[#FAF5E9] border-b border-[#EADFC7] px-6 py-2.5 flex items-center justify-between text-xs text-[#222E26]">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#52B82E] flex-shrink-0" />
              <span>Doorstep Delivery: <strong>All Over India (Pan-India)</strong></span>
            </div>
            <span className="text-[10px] bg-[#111827] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
              All PIN Codes
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 items-center shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-100 flex-shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate uppercase">{item.name}</h4>
                    <span className="text-[11px] font-semibold text-[#111827] bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      Pack: {item.weight}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-bold text-[#F39C12]">₹{item.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId || `${item.productId}_${item.weight}`)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 transition px-2 py-1 rounded-lg cursor-pointer flex items-center gap-1 border border-red-100 hover:border-red-200"
                      title="Delete item from bag"
                      aria-label="Delete item from bag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Delete</span>
                    </button>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId || `${item.productId}_${item.weight}`, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-black hover:bg-gray-200 rounded cursor-pointer transition"
                        title={item.quantity === 1 ? 'Delete item' : 'Decrease quantity'}
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-red-500" />
                        ) : (
                          '-'
                        )}
                      </button>
                      <span className="text-xs font-bold px-1.5 min-w-[20px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId || `${item.productId}_${item.weight}`, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-black hover:bg-gray-200 rounded cursor-pointer transition"
                        title="Increase quantity"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-600 text-sm font-semibold">Your shopping bag is empty.</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#52B82E] text-white text-xs font-bold cursor-pointer hover:bg-[#439E23] transition"
                >
                  Browse Rice Varieties
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer: Summary & Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-[#FAF8F5] p-5 space-y-3">
              
              {/* Clean Price Breakdown without fake fees */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                {itemSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Direct Mill Savings:</span>
                    <span>-₹{itemSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-300">
                  <span>Total Payable:</span>
                  <span className="font-serif text-lg text-[#F39C12] font-black">₹{finalTotal}</span>
                </div>
              </div>

              {/* WhatsApp Checkout Section */}
              <div className="pt-2 space-y-3">
                {/* Optional Chennai Delivery Details Collapsible */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setShowAddressFields(!showAddressFields)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-gray-700 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#52B82E]" />
                      <span>Delivery Address (Pan-India)</span>
                    </span>
                    <span className="text-[10px] text-[#52B82E] font-bold">
                      {showAddressFields ? 'Hide ▲' : 'Add Details ▼'}
                    </span>
                  </button>

                  {showAddressFields && (
                    <div className="p-3.5 pt-1 space-y-2.5 border-t border-gray-100 bg-[#FCFBF8] text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                          Your Name:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Anand Kumar"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#52B82E]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                            Phone Number:
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 98401xxxxx"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#52B82E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                            PIN Code (6 Digits):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 560001, 110001, 600001"
                            value={deliveryPincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-mono focus:outline-none focus:border-[#52B82E]"
                            maxLength={6}
                          />
                        </div>
                      </div>

                      {pincodeError && (
                        <p className="text-[10px] text-red-600 font-semibold">{pincodeError}</p>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                          Door / Flat No. &amp; Street:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. No. 12, Gandhi Road"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#52B82E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                          City, State & Landmark (All Over India):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai, Maharashtra or Bengaluru, Karnataka"
                          value={deliveryArea}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#52B82E]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary WhatsApp Checkout Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={isSubmitting || (deliveryPincode.length === 6 && !isIndianPincode(deliveryPincode))}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>
                    {isSubmitting ? 'Logging Order...' : `Proceed to WhatsApp Checkout • ₹${finalTotal}`}
                  </span>
                </button>

                <p className="text-[11px] text-gray-500 text-center font-medium">
                  Pan-India Doorstep Delivery Across All Over India • Cash or UPI on Arrival
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
