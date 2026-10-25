export interface ProductWeight {
  weight: string; // e.g. "1kg", "5kg", "10kg", "25kg"
  price: number;
  originalPrice: number;
  inStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  aging: string;
  description: string;
  image: string;
  badge: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  defaultWeight: string;
  weights: ProductWeight[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
  desc?: string;
}

export interface OfferBanner {
  id: string;
  productId: string;
  category?: string;
  categoryName?: string;
  weight: string;
  headline: string;
  subtitle?: string;
  discount: string;
  brand: string;
  badge?: string;
  image: string;
  highlights?: string[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  desc: string;
}

export interface OrderItem {
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Order Placed' | 'Paddy Cleaned & Milled' | 'In Transit via Logistics' | 'Delivered' | string;
  currentStep: number;
  deliveryAddress: string;
  paymentMethod: string;
  trackingUpdates: {
    status: string;
    location: string;
    time: string;
  }[];
}

export interface CustomerAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  defaultPincode: string;
  memberSince: string;
  loyaltyTier: string;
}

export interface FaqItem {
  category: string;
  categoryName: string;
  question: string;
  answer: string;
}

export interface StoreInfo {
  name: string;
  tamilName?: string;
  invocation?: string;
  tagline: string;
  subTagline?: string;
  established: string;
  heritage: string;
  whatsappNumber: string;
  displayPhone: string;
  alternatePhone?: string;
  millPhone?: string;
  email: string;
  address: string;
  mandiAddressTamil?: string;
  millName?: string;
  millAddress?: string;
  millAddressTamil?: string;
  proprietor?: string;
  proprietorTamil?: string;
  proprietorTitle?: string;
  hours: string;
  gstin: string;
  freeDeliveryThreshold: number;
  logo?: string;
  serviceArea?: string;
}

export interface UserReview {
  id: string;
  productId?: string;
  productName?: string;
  userName: string;
  userLocation: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  tags?: string[];
  isVerifiedBuyer: boolean;
}

