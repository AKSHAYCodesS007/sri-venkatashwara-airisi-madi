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
  Tag,
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
  const isChennaiPincode = (pin: string) => {
    const cleaned = pin.trim();
    return /^600\d{3}$/.test(cleaned);
  };

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);

  // Guest customer & delivery details (no login or account needed; remembered on device)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('600');
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
      if (!digits.startsWith('600')) {
        setPincodeError('⚠️ Delivery is currently limited ONLY to Chennai (PIN starting with 600xxx).');
      } else {
        setPincodeError('');
      }
    } else if (digits.length > 0 && !'600'.startsWith(digits.slice(0, Math.min(3, digits.length)))) {
      setPincodeError('⚠️ Chennai pincodes begin with 600.');
    } else {
      setPincodeError('');
    }
  };

  if (!isOpen) return null;

  // Subtotal & Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const itemSavings = originalSubtotal - subtotal;

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const platformFee = subtotal > 0 ? 10 : 0; // Discounted from 23 to 10
  const codFee = 0; // Discounted from 10 to 0
  const deliveryFee = subtotal >= storeInfo.freeDeliveryThreshold || subtotal === 0 ? 0 : 70;

  const finalTotal = Math.max(0, subtotal - couponDiscount + platformFee + codFee + deliveryFee);
  const freeShippingDelta = Math.max(0, storeInfo.freeDeliveryThreshold - subtotal);

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'MILL50') {
      if (subtotal < 300) {
        setCouponError('Minimum order of ₹300 required for MILL50');
        return;
      }
      setAppliedCoupon({ code: 'MILL50', discount: 50 });
      setCouponCode('');
    } else if (code === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: 'WELCOME10', discount: disc });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon. Try "MILL50" or "WELCOME10"');
    }
  };

  // Exclusive WhatsApp Order Desk Checkout
  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    if (deliveryPincode && deliveryPincode.length === 6 && !isChennaiPincode(deliveryPincode)) {
      alert(
        'Delivery is strictly limited to Chennai city & suburbs (PIN starting with 600xxx).\n\nFor bulk commercial lorry loads outside Chennai, please contact our managing proprietor directly.'
      );
      return;
    }

    saveGuestDeliveryInfo();
    setIsSubmitting(true);

    let createdOrder: Order | null = null;
    try {
      const orderPayload: Partial<Order> = {
        items: cartItems.map((item) => ({
          name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
        })),
        total: finalTotal,
        deliveryAddress: deliveryAddress.trim()
          ? `${deliveryAddress.trim()}${deliveryArea.trim() ? `, ${deliveryArea.trim()}` : ''}, Chennai - ${deliveryPincode.trim() || '600xxx'}${customerName.trim() ? ` (${customerName.trim()}, ${customerPhone.trim()})` : ''}`
          : 'WhatsApp Order Desk (Doorstep Cash/UPI in Chennai)',
        paymentMethod: 'WhatsApp Order (Cash / UPI on Delivery)',
      };

      createdOrder = await onCreateOrderService(orderPayload);
    } catch (err) {
      console.warn('Could not record WhatsApp order to DB:', err);
    } finally {
      setIsSubmitting(false);
    }

    let text = `🌾 *NEW RICE ORDER — ${storeInfo.name.toUpperCase()}*\n`;
    text += `📍 *Service Area: Exclusively Chennai City & Suburbs*\n`;
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

    text += `\nSubtotal: ₹${subtotal}`;
    if (appliedCoupon) {
      text += `\nCoupon (${appliedCoupon.code}): -₹${appliedCoupon.discount}`;
    }
    text += `\nPlatform Fee: ₹${platformFee} (Special Offer)`;
    text += `\nCOD Fee: ₹0 (FREE)`;
    text += `\nDelivery Fee (Chennai): ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}`;
    text += `\n*TOTAL PAYABLE (COD / UPI): ₹${finalTotal}*`;
    text += `\n\n_Vanakkam! Please confirm dispatch schedule to Chennai doorstep. Payment via Cash/UPI on arrival._`;

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
          <div className="bg-[#0C2B1D] text-white px-6 py-4 flex items-center justify-between border-b border-[#1C523B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C59B27] text-[#0C2B1D] flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-white">Your WhatsApp Order Bag</h3>
                <span className="text-[11px] text-[#AECDBB]">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} bag(s) selected for WhatsApp
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Exclusive Chennai Delivery Notice */}
          <div className="bg-[#EAF3EE] border-b border-[#133E2B]/15 px-6 py-2 flex items-center justify-between text-xs text-[#133E2B]">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
              <span>Doorstep Delivery: <strong>Exclusively Chennai Only</strong></span>
            </div>
            <span className="text-[10px] bg-[#133E2B] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
              PIN 600xxx
            </span>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-[#FEF9EB] border-b border-[#E6CE8A] px-6 py-2 text-xs text-[#A27B16]">
              {freeShippingDelta > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>Add ₹{freeShippingDelta} more for FREE Chennai Delivery!</span>
                    <span>₹{subtotal} / ₹{storeInfo.freeDeliveryThreshold}</span>
                  </div>
                  <div className="w-full bg-[#E6CE8A]/40 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C59B27] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / storeInfo.freeDeliveryThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Congratulations! You unlocked FREE Chennai Doorstep Delivery!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-[#FBF9F5] border border-[#E6E2D8] rounded-xl p-3 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                    <span className="text-[11px] font-semibold text-[#133E2B] bg-[#EAF3EE] px-1.5 py-0.5 rounded inline-block mt-0.5">
                      Pack: {item.weight}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-bold text-gray-900">₹{item.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-gray-400 hover:text-red-600 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EAF3EE] text-[#133E2B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-gray-800">Your WhatsApp Bag is Empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our aged rice varieties and 26kg wholesale sacks to order directly via WhatsApp.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition cursor-pointer"
                >
                  Explore Rice Varieties
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer: Summary & Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#E6E2D8] bg-[#FBF9F5] p-5 space-y-3">
              
              {/* Coupon Engine */}
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon: MILL50 or WELCOME10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full text-xs pl-7 pr-2 py-2 rounded-lg border border-[#E6E2D8] bg-white uppercase font-bold focus:outline-none focus:border-[#133E2B]"
                    />
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discount})</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}

              {/* Price Breakdown */}
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
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount:</span>
                    <span>-₹{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>
                    Platform Fee <span className="line-through text-gray-400">₹23</span>:
                  </span>
                  <span className="font-bold text-[#133E2B]">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    COD Handling <span className="line-through text-gray-400">₹10</span>:
                  </span>
                  <span className="font-bold text-emerald-700">₹0 FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'font-semibold'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-300">
                  <span>Total Payable:</span>
                  <span className="font-serif text-lg text-[#133E2B]">₹{finalTotal}</span>
                </div>
              </div>

              {/* WhatsApp Checkout Section (Exclusive Order Method) */}
              <div className="pt-2 space-y-3">
                {/* Optional Chennai Delivery Details Collapsible */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setShowAddressFields(!showAddressFields)}
                    className="w-full p-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                      <span className="text-xs font-bold text-[#133E2B]">
                        {customerName.trim()
                          ? `Deliver to: ${customerName.trim()} (${deliveryArea.trim() || 'Chennai'})`
                          : 'Add Chennai Delivery Address (Optional)'}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold underline">
                      {showAddressFields ? 'Hide' : customerName.trim() ? 'Change' : '+ Add Address'}
                    </span>
                  </button>

                  {showAddressFields && (
                    <div className="p-3 pt-1 border-t border-gray-100 space-y-2 bg-[#FBF9F5] animate-fade-in">
                      <input
                        type="text"
                        placeholder="Full Name (e.g. Ramesh Babu)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="10-Digit Mobile Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Door No., Street Name, Landmark"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Chennai Area (e.g. Porur)"
                          value={deliveryArea}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B] bg-white"
                        />
                        <input
                          type="text"
                          placeholder="PIN (600xxx)"
                          value={deliveryPincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          maxLength={6}
                          className={`w-full text-xs p-2 rounded-lg border focus:outline-none bg-white ${
                            pincodeError ? 'border-red-500 bg-red-50 text-red-900 font-bold' : 'border-gray-300 focus:border-[#133E2B]'
                          }`}
                        />
                      </div>
                      {pincodeError && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0 text-red-600" />
                          <span>{pincodeError}</span>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-500 italic">
                        Saved details are auto-included in your WhatsApp message.
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary WhatsApp Order Action Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={isSubmitting || Boolean(pincodeError)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>
                    {isSubmitting ? 'Opening WhatsApp...' : `Send Order to WhatsApp • ₹${finalTotal}`}
                  </span>
                </button>

                <div className="p-2 bg-[#EAF3EE] rounded-xl border border-emerald-200/70 text-[11px] text-[#133E2B] flex items-center justify-center gap-1.5 text-center font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Direct Mill Desk (+91 99621 19810) • Cash / UPI on Delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
