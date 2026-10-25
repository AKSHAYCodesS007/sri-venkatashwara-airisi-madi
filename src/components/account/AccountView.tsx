'use client';

import React, { useState } from 'react';
import { UserProfile, CustomerAddress, Order, FaqItem, StoreInfo } from '@/types';
import {
  User,
  MapPin,
  Clock,
  HelpCircle,
  FileText,
  ShieldCheck,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Award,
  Phone,
  Mail,
  Home,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface AccountViewProps {
  userProfile: UserProfile;
  addresses: CustomerAddress[];
  orders: Order[];
  faqs: FaqItem[];
  storeInfo: StoreInfo;
  onUpdateProfile: (updated: UserProfile) => Promise<void>;
  onNavigateToTrack: (orderId?: string) => void;
  isLoggedIn?: boolean;
  onOpenLoginPrompt?: () => void;
  onLogout?: () => void;
}

export default function AccountView({
  userProfile,
  addresses,
  orders,
  faqs,
  storeInfo,
  onUpdateProfile,
  onNavigateToTrack,
  isLoggedIn = false,
  onOpenLoginPrompt,
  onLogout,
}: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'faqs' | 'policies'>('profile');

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [defaultPincode, setDefaultPincode] = useState(userProfile.defaultPincode);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Address Management State
  const [addressList, setAddressList] = useState<CustomerAddress[]>(addresses);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null); // address id or 'new'
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrName, setAddrName] = useState('Ramesh Kumar');
  const [addrPhone, setAddrPhone] = useState('+91 99621 19810');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('Chennai');
  const [addrState, setAddrState] = useState('Tamil Nadu');
  const [addrPincode, setAddrPincode] = useState('600069');
  const [addrError, setAddrError] = useState('');

  // FAQs Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Handle Edit Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name,
      phone,
      email,
      defaultPincode,
    };
    await onUpdateProfile(updated);
    setIsEditingProfile(false);
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 2500);
  };

  // Open Edit Address Modal
  const handleOpenEditAddress = (addr?: CustomerAddress) => {
    setAddrError('');
    if (addr) {
      setIsEditingAddress(addr.id);
      setAddrLabel(addr.label);
      setAddrName(addr.recipientName);
      setAddrPhone(addr.phone);
      setAddrStreet(addr.address);
      setAddrArea(addr.area);
      setAddrCity(addr.city || 'Chennai');
      setAddrState(addr.state || 'Tamil Nadu');
      setAddrPincode(addr.pincode);
    } else {
      setIsEditingAddress('new');
      setAddrLabel('Home');
      setAddrName(userProfile.name);
      setAddrPhone(userProfile.phone);
      setAddrStreet('');
      setAddrArea('');
      setAddrCity('Chennai');
      setAddrState('Tamil Nadu');
      setAddrPincode('600069');
    }
  };

  // Save Address (Validated to Chennai)
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = addrPincode.trim();
    if (!pin.startsWith('600') || pin.length !== 6) {
      setAddrError('Delivery is strictly limited to Chennai (pincodes starting with 600xxx).');
      return;
    }
    setAddrError('');

    if (isEditingAddress === 'new') {
      const newAddr: CustomerAddress = {
        id: 'addr_' + Date.now(),
        label: addrLabel,
        recipientName: addrName,
        phone: addrPhone,
        address: addrStreet,
        area: addrArea,
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: pin,
        isDefault: addressList.length === 0,
      };
      setAddressList([...addressList, newAddr]);
    } else {
      setAddressList(
        addressList.map((a) =>
          a.id === isEditingAddress
            ? {
                ...a,
                label: addrLabel,
                recipientName: addrName,
                phone: addrPhone,
                address: addrStreet,
                area: addrArea,
                city: 'Chennai',
                state: 'Tamil Nadu',
                pincode: pin,
              }
            : a
        )
      );
    }
    setIsEditingAddress(null);
  };

  // Delete Address
  const handleDeleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery address?')) {
      setAddressList(addressList.filter((a) => a.id !== id));
    }
  };

  // Set Default Address
  const handleSetDefaultAddress = (id: string) => {
    setAddressList(
      addressList.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <div className="py-12 bg-[#FBF9F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-[#0C2B1D] via-[#133E2B] to-[#0C2B1D] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#C59B27]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C59B27] text-[#0C2B1D] font-serif text-2xl font-bold flex items-center justify-center shadow-md">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold">{userProfile.name}</h1>
                <span className="text-[10px] bg-[#C59B27]/30 text-[#FFD875] border border-[#C59B27]/50 px-2 py-0.5 rounded font-bold uppercase">
                  {userProfile.loyaltyTier}
                </span>
              </div>
              <p className="text-xs text-[#AECDBB] mt-1 flex flex-wrap items-center gap-3">
                <span>{userProfile.phone}</span>
                <span>•</span>
                <span>{userProfile.email}</span>
                <span>•</span>
                <span>Member Since: {userProfile.memberSince}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsEditingProfile(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-2 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Edit Profile</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-xs font-bold text-red-200 hover:text-white transition cursor-pointer"
                    title="Log Out of this session"
                  >
                    <span>Log Out</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onOpenLoginPrompt}
                className="px-4 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#d4a832] text-[#0C2B1D] text-xs font-bold flex items-center gap-2 transition shadow cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Log In with Mobile</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Banner if not logged in */}
        {!isLoggedIn && (
          <div className="p-4 bg-[#EAF3EE] border border-[#133E2B]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#133E2B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C59B27] shrink-0" />
              <p className="font-semibold">
                You are currently browsing as a <strong>Guest</strong>. You can order directly on WhatsApp without signing in, or log in to sync your delivery addresses.
              </p>
            </div>
            {onOpenLoginPrompt && (
              <button
                onClick={onOpenLoginPrompt}
                className="px-4 py-2 bg-[#133E2B] text-white rounded-xl font-bold hover:bg-[#1C523B] transition shrink-0 cursor-pointer shadow-xs"
              >
                Log In Now
              </button>
            )}
          </div>
        )}

        {profileSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E6E2D8] overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#133E2B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-[#133E2B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addressList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#133E2B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'faqs'
                ? 'bg-[#133E2B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'policies'
                ? 'bg-[#133E2B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-[#E6E2D8] hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms, Policies &amp; Licences</span>
          </button>
        </div>

        {/* Tab 1: Profile & Edit Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="font-serif text-xl font-bold text-[#19241F]">
                Customer Profile Information
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs text-[#133E2B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Default Pincode</label>
                  <input
                    type="text"
                    value={defaultPincode}
                    onChange={(e) => setDefaultPincode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#133E2B]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#133E2B] text-white rounded-lg text-xs font-bold hover:bg-[#1C523B] transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl text-xs">
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8]">
                  <span className="text-gray-400 block font-semibold mb-1">Full Name</span>
                  <strong className="text-gray-900 text-sm">{userProfile.name}</strong>
                </div>

                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8]">
                  <span className="text-gray-400 block font-semibold mb-1">Mobile Contact</span>
                  <strong className="text-gray-900 text-sm">{userProfile.phone}</strong>
                </div>

                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8]">
                  <span className="text-gray-400 block font-semibold mb-1">Email Address</span>
                  <strong className="text-gray-900 text-sm">{userProfile.email}</strong>
                </div>

                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E6E2D8]">
                  <span className="text-gray-400 block font-semibold mb-1">Delivery Pincode</span>
                  <strong className="text-gray-900 text-sm">{userProfile.defaultPincode}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses & Edit Address */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#19241F]">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-gray-500">
                  Manage doorstep delivery addresses for 1-click cart checkout.
                </p>
              </div>

              <button
                onClick={() => handleOpenEditAddress()}
                className="px-4 py-2 bg-[#133E2B] hover:bg-[#1C523B] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C59B27]" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Edit Modal / Inline Drawer */}
            {isEditingAddress && (
              <form onSubmit={handleSaveAddress} className="p-5 bg-[#FBF9F5] border border-[#C59B27]/40 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#133E2B]">
                      {isEditingAddress === 'new' ? 'Add New Chennai Address' : 'Edit Delivery Address'}
                    </h3>
                    <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                      📍 Direct Doorstep Delivery Exclusively in Chennai (PIN 600xxx)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(null)}
                    className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Address Label</label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Work / Office">Work / Office</option>
                      <option value="Parents' Home">Parents' Home</option>
                      <option value="Store / Hotel">Store / Hotel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Flat, House No, Building, Street</label>
                  <input
                    type="text"
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    required
                    placeholder="e.g. Door No 12, Kundrathur Main Road"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Area / Locality in Chennai</label>
                    <input
                      type="text"
                      value={addrArea}
                      onChange={(e) => setAddrArea(e.target.value)}
                      required
                      placeholder="e.g. Kundrathur, Porur, Kolapakkam"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City &amp; State</label>
                    <input
                      type="text"
                      value="Chennai, Tamil Nadu"
                      disabled
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-600 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Chennai Pincode (600xxx)</label>
                    <input
                      type="text"
                      value={addrPincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setAddrPincode(val);
                        if (val.length === 6 && !val.startsWith('600')) {
                          setAddrError('Delivery is limited to Chennai (PIN 600xxx).');
                        } else {
                          setAddrError('');
                        }
                      }}
                      maxLength={6}
                      required
                      placeholder="e.g. 600069"
                      className={`w-full text-xs p-2.5 rounded-lg border bg-white ${
                        addrError ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {addrError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{addrError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(null)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#133E2B] text-white rounded-lg text-xs font-bold hover:bg-[#1C523B] transition cursor-pointer"
                  >
                    Save Chennai Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressList.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                    addr.isDefault
                      ? 'bg-[#EAF3EE] border-[#133E2B] ring-1 ring-[#133E2B]/20'
                      : 'bg-white border-[#E6E2D8] hover:border-gray-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {addr.label.toLowerCase().includes('office') || addr.label.toLowerCase().includes('work') ? (
                          <Briefcase className="w-4 h-4 text-[#133E2B]" />
                        ) : (
                          <Home className="w-4 h-4 text-[#133E2B]" />
                        )}
                        <span className="font-bold text-xs text-gray-900">{addr.label}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="bg-[#133E2B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-gray-900">{addr.recipientName}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {addr.address}, {addr.area}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Phone: {addr.phone}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[#133E2B] hover:underline font-bold cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold">Primary Address</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        title="Edit Address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
            <div className="pb-4 border-b">
              <h2 className="font-serif text-xl font-bold text-[#19241F]">
                Your Mill Orders
              </h2>
              <p className="text-xs text-gray-500">
                Review your past rice deliveries, re-order your favorites, and track open dispatches.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-[#FBF9F5] border border-[#E6E2D8] rounded-2xl p-5 space-y-3 hover:border-[#133E2B] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#133E2B]">
                          Order #{order.orderId}
                        </span>
                        <span className="bg-[#FEF9EB] text-[#A27B16] border border-[#E6CE8A] text-[10px] font-bold px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">Placed on: {order.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base font-extrabold text-gray-900">
                        ₹{order.total}
                      </span>
                      <button
                        onClick={() => onNavigateToTrack(order.orderId)}
                        className="px-3 py-1.5 rounded-lg bg-[#133E2B] hover:bg-[#1C523B] text-white text-xs font-bold transition cursor-pointer"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          • {it.name} ({it.weight}) × {it.quantity} bag(s)
                        </span>
                        <span className="font-semibold">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-gray-500 pt-1">
                    Delivered to: {order.deliveryAddress}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-6 sm:p-8 space-y-6 shadow-xs animate-fade-in">
            <div className="pb-4 border-b">
              <h2 className="font-serif text-xl font-bold text-[#133E2B]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500">
                Paddy ageing science, de-stoning practices, storage tips, and delivery details.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E6E2D8] rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 bg-[#FBF9F5] hover:bg-[#F2EFE9] flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#EAF3EE] text-[#133E2B] px-2 py-0.5 rounded uppercase font-mono">
                          {faq.categoryName}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-[#E6E2D8]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Terms, Policies & Licences */}
        {activeTab === 'policies' && (
          <div className="bg-white rounded-3xl border border-[#E6E2D8] p-6 sm:p-8 space-y-8 shadow-xs animate-fade-in">
            <div className="pb-4 border-b">
              <h2 className="font-serif text-xl font-bold text-[#133E2B]">
                Terms, Policies &amp; Mill Licences
              </h2>
              <p className="text-xs text-gray-500">
                Official statutory registrations, consumer protection standards, and doorstep return guarantee.
              </p>
            </div>

            {/* Official Mill Licences */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-[#19241F] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C59B27]" />
                <span>Statutory Food Safety &amp; Milling Licences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#A27B16] uppercase font-bold tracking-wider block">
                    FSSAI Central Licence
                  </span>
                  <strong className="text-sm text-gray-900 block mt-1">#10123999000142</strong>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Food Safety and Standards Authority of India certified godown facility.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#A27B16] uppercase font-bold tracking-wider block">
                    AGMARK Certification
                  </span>
                  <strong className="text-sm text-gray-900 block mt-1">Grade A Reserve</strong>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Directorate of Marketing &amp; Inspection (DMI) authentic agricultural produce.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E6E2D8]">
                  <span className="text-[10px] text-[#A27B16] uppercase font-bold tracking-wider block">
                    AP Agmark &amp; GSTIN
                  </span>
                  <strong className="text-sm text-gray-900 block mt-1">{storeInfo.gstin}</strong>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Registered Agro Processing Corporation under Andhra Pradesh Agricultural Produce Act.
                  </p>
                </div>
              </div>
            </div>

            {/* Doorstep Inspection & Return Policy */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <h3 className="font-serif font-bold text-base text-[#19241F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Doorstep Inspection &amp; 100% Aroma Guarantee</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We take profound pride in the natural purity of our aged grains. If upon doorstep arrival you are unsatisfied with the grain aroma, grain elongation upon trial cooking, or notice any impurities, we will immediately provide a <strong>100% free bag replacement or full refund</strong> with zero questions asked within 7 days of delivery.
              </p>
            </div>

            {/* Terms of Service */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <h3 className="font-serif font-bold text-base text-[#19241F]">
                General Terms of Service &amp; Storage Conditions
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All rice sold through our portal is unpolished and free from paraffin, talcum, or chemical preservatives. To prevent natural weevil incubation in humid weather, customers are advised to store grains in a clean, airtight steel bin or dry plastic drum away from direct moisture, and drop 3-4 natural dried neem leaves or cloves into the container.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
