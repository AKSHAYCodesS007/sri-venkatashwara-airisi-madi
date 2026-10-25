import {
  Product,
  Category,
  OfferBanner,
  Order,
  CustomerAddress,
  UserProfile,
  StoreInfo,
  FaqItem,
  UserReview
} from '@/types';
import {
  STORE_INFO,
  CATEGORIES,
  PRODUCTS,
  DEFAULT_OFFER_BANNERS,
  SAMPLE_ORDERS,
  INITIAL_USER,
  INITIAL_ADDRESSES,
  FAQS,
  DEFAULT_REVIEWS
} from '@/data/seed-data';
import { supabase } from './supabase';

// =============================================================================
// DATABASE MAPPERS (Translates Supabase SQL snake_case to Frontend camelCase)
// =============================================================================

function mapOrderFromRow(row: any): Order {
  return {
    orderId: row.order_id,
    date: row.date,
    items: Array.isArray(row.items) ? row.items : [],
    total: Number(row.total || 0),
    status: row.status || 'Order Placed',
    currentStep: Number(row.current_step || 1),
    deliveryAddress: row.delivery_address || '',
    paymentMethod: row.payment_method || 'Cash on Delivery',
    trackingUpdates: Array.isArray(row.tracking_updates) ? row.tracking_updates : []
  };
}

function mapOrderToRow(order: Order): any {
  return {
    order_id: order.orderId,
    date: order.date,
    items: order.items || [],
    total: order.total || 0,
    status: order.status || 'Order Placed',
    current_step: order.currentStep || 1,
    delivery_address: order.deliveryAddress || '',
    payment_method: order.paymentMethod || 'Cash on Delivery',
    tracking_updates: order.trackingUpdates || []
  };
}

function mapReviewFromRow(row: any): UserReview {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    userName: row.user_name,
    userLocation: row.user_location || 'Chennai',
    rating: Number(row.rating || 5),
    title: row.title,
    comment: row.comment,
    date: row.date,
    tags: Array.isArray(row.tags) ? row.tags : [],
    isVerifiedBuyer: Boolean(row.is_verified_buyer)
  };
}

function mapReviewToRow(review: UserReview): any {
  return {
    id: review.id,
    product_id: review.productId || null,
    product_name: review.productName || null,
    user_name: review.userName,
    user_location: review.userLocation || 'Chennai',
    rating: review.rating || 5,
    title: review.title,
    comment: review.comment,
    date: review.date,
    tags: review.tags || [],
    is_verified_buyer: review.isVerifiedBuyer ?? true
  };
}

function mapBannerFromRow(row: any): OfferBanner {
  const defaultMatch = DEFAULT_OFFER_BANNERS.find(b => b.id === row.id || b.productId === row.product_id);
  return {
    id: row.id,
    productId: row.product_id || defaultMatch?.productId || '',
    category: row.category || defaultMatch?.category || 'boiled-rice',
    categoryName: row.category_name || defaultMatch?.categoryName || 'Boiled Rice',
    weight: row.weight || defaultMatch?.weight || '26 kg',
    headline: row.headline || defaultMatch?.headline || '',
    subtitle: row.subtitle || defaultMatch?.subtitle || undefined,
    discount: row.discount || defaultMatch?.discount || '',
    brand: row.brand || defaultMatch?.brand || '',
    badge: row.badge || defaultMatch?.badge || undefined,
    image: row.image || defaultMatch?.image || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : defaultMatch?.highlights
  };
}

function mapBannerToRow(banner: OfferBanner): any {
  return {
    id: banner.id,
    product_id: banner.productId,
    weight: banner.weight,
    headline: banner.headline,
    discount: banner.discount,
    brand: banner.brand,
    badge: banner.badge || null,
    image: banner.image
  };
}

// =============================================================================
// STORE & CATALOG SERVICES
// =============================================================================

export async function getStoreInfo(): Promise<StoreInfo> {
  return STORE_INFO;
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES.map(cat => {
    if (cat.id === 'all') {
      return { ...cat, count: PRODUCTS.length };
    }
    return {
      ...cat,
      count: PRODUCTS.filter(p => p.category === cat.id).length
    };
  });
}

export async function getProducts(options?: {
  category?: string;
  searchQuery?: string;
  maxPrice?: number;
  inStockOnly?: boolean;
}): Promise<Product[]> {
  let list = [...PRODUCTS];

  if (options?.category && options.category !== 'all') {
    list = list.filter(p => p.category === options.category);
  }

  if (options?.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase();
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (options?.maxPrice !== undefined) {
    list = list.filter(p => p.weights[0].price <= options.maxPrice!);
  }

  if (options?.inStockOnly) {
    list = list.filter(p => p.inStock);
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find(p => p.id === id);
}

// =============================================================================
// BANNERS SERVICE (SUPABASE + LOCAL CACHE)
// =============================================================================
const BANNERS_STORAGE_KEY = 'rice_ecommerce_category_banners_v12';

export async function getOfferBanners(): Promise<OfferBanner[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('offer_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const cloudBanners = data.map(mapBannerFromRow);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(cloudBanners));
          } catch {}
        }
        return cloudBanners;
      }
    } catch (e) {
      console.warn('Supabase getOfferBanners error, falling back to local cache:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(BANNERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read banners from localStorage:', e);
    }
  }
  return DEFAULT_OFFER_BANNERS;
}

export async function saveOfferBanner(banner: OfferBanner): Promise<OfferBanner[]> {
  const current = await getOfferBanners();
  const existingIdx = current.findIndex(b => b.id === banner.id);
  let updated: OfferBanner[];

  if (existingIdx >= 0) {
    updated = current.map((b, idx) => (idx === existingIdx ? banner : b));
  } else {
    updated = [banner, ...current];
  }

  if (supabase) {
    try {
      const row = mapBannerToRow(banner);
      await supabase.from('offer_banners').upsert([row]);
    } catch (e) {
      console.warn('Supabase save banner failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save banner to localStorage:', e);
    }
  }

  return updated;
}

export async function deleteOfferBanner(id: string): Promise<OfferBanner[]> {
  const current = await getOfferBanners();
  const updated = current.filter(b => b.id !== id);

  if (supabase) {
    try {
      await supabase.from('offer_banners').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete banner failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete banner from localStorage:', e);
    }
  }

  return updated;
}

export async function resetOfferBanners(): Promise<OfferBanner[]> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(DEFAULT_OFFER_BANNERS));
    } catch (e) {
      console.warn('Failed to reset banners:', e);
    }
  }
  return DEFAULT_OFFER_BANNERS;
}

// =============================================================================
// ORDERS SERVICE (SUPABASE + LOCAL CACHE)
// =============================================================================
const ORDERS_STORAGE_KEY = 'rice_ecommerce_orders_chennai_v1';

export async function getOrders(): Promise<Order[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const cloudOrders = data.map(mapOrderFromRow);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cloudOrders));
          } catch {}
        }
        return cloudOrders;
      }
    } catch (e) {
      console.warn('Supabase getOrders error, falling back to local cache:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to read orders from localStorage:', e);
    }
  }
  return SAMPLE_ORDERS;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const orders = await getOrders();
  
  // Randomly generate a unique 5-digit order ID (e.g., RS74829)
  let generatedId = 'RS' + Math.floor(10000 + Math.random() * 90000);
  while (orders.some((o) => o.orderId.toLowerCase() === generatedId.toLowerCase())) {
    generatedId = 'RS' + Math.floor(10000 + Math.random() * 90000);
  }

  const newOrder: Order = {
    orderId: generatedId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: orderData.items || [],
    total: orderData.total || 0,
    status: 'Order Placed',
    currentStep: 1,
    deliveryAddress: orderData.deliveryAddress || 'Kundrathur Main Road, Chiikkarayapuram, Chennai - 600069',
    paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
    trackingUpdates: [
      {
        status: 'Order Received & Verified',
        location: 'Chiikkarayapuram Mandi Hub, Chennai',
        time: 'Just now'
      }
    ]
  };

  if (supabase) {
    try {
      const row = mapOrderToRow(newOrder);
      const { error } = await supabase.from('orders').insert([row]);
      if (error) console.warn('Supabase insert order error:', error);
    } catch (e) {
      console.warn('Supabase insert order failed:', e);
    }
  }

  const updatedOrders = [newOrder, ...orders.filter(o => o.orderId !== generatedId)];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  newStep: number,
  logMessage?: string,
  location?: string
): Promise<Order[]> {
  const orders = await getOrders();
  const timeNow =
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) +
    ', ' +
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  let updatedTargetOrder: Order | null = null;

  const updatedOrders = orders.map((order) => {
    if (order.orderId.toLowerCase() === orderId.toLowerCase()) {
      const existingUpdates = order.trackingUpdates || [];
      const newUpdate = {
        status: logMessage || `Status changed to: ${newStatus}`,
        location: location || 'Chiikkarayapuram Mandi Hub, Chennai',
        time: timeNow,
      };

      const updated = {
        ...order,
        status: newStatus,
        currentStep: newStep,
        trackingUpdates: [newUpdate, ...existingUpdates],
      };
      updatedTargetOrder = updated;
      return updated;
    }
    return order;
  });

  if (supabase && updatedTargetOrder) {
    try {
      const row = mapOrderToRow(updatedTargetOrder);
      await supabase
        .from('orders')
        .update({
          status: row.status,
          current_step: row.current_step,
          tracking_updates: row.tracking_updates
        })
        .eq('order_id', orderId);
    } catch (e) {
      console.warn('Supabase update order failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    } catch (e) {
      console.warn('Failed to save updated orders:', e);
    }
  }

  return updatedOrders;
}

export async function deleteOrder(orderId: string): Promise<Order[]> {
  const orders = await getOrders();
  const filtered = orders.filter((o) => o.orderId.toLowerCase() !== orderId.toLowerCase());

  if (supabase) {
    try {
      await supabase.from('orders').delete().eq('order_id', orderId);
    } catch (e) {
      console.warn('Supabase delete order failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete order:', e);
    }
  }

  return filtered;
}

// =============================================================================
// USER PROFILE & ADDRESSES
// =============================================================================
const USER_STORAGE_KEY = 'rice_ecommerce_user_chennai_v1';

export async function getUserProfile(): Promise<UserProfile> {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to read user from localStorage:', e);
    }
  }
  return INITIAL_USER;
}

export async function saveUserProfile(user: UserProfile): Promise<UserProfile> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user:', e);
    }
  }
  return user;
}

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  return INITIAL_ADDRESSES;
}

export async function getFaqs(): Promise<FaqItem[]> {
  return FAQS;
}

// =============================================================================
// CUSTOMER REVIEWS SERVICE (SUPABASE + LOCAL CACHE)
// =============================================================================
const REVIEWS_STORAGE_KEY = 'rice_ecommerce_user_reviews_clean_v2';

export async function getReviews(): Promise<UserReview[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const cloudReviews = data.map(mapReviewFromRow);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(cloudReviews));
          } catch {}
        }
        return cloudReviews;
      }
    } catch (e) {
      console.warn('Supabase getReviews error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('rice_ecommerce_user_reviews_v1');
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed: UserReview[] = JSON.parse(saved);
        const legacyIds = new Set(['rev-1', 'rev-2', 'rev-3', 'rev-4', 'rev-5']);
        return parsed.filter(r => !legacyIds.has(r.id));
      }
    } catch (e) {
      console.warn('Failed to read reviews from localStorage:', e);
    }
  }
  return DEFAULT_REVIEWS;
}

export async function saveReview(
  reviewData: Omit<UserReview, 'id' | 'date'>
): Promise<UserReview> {
  const newReview: UserReview = {
    ...reviewData,
    id: 'rev_' + Date.now(),
    date: 'Just now',
  };

  if (supabase) {
    try {
      const row = mapReviewToRow(newReview);
      await supabase.from('user_reviews').insert([row]);
    } catch (e) {
      console.warn('Supabase insert review failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const currentReviews = await getReviews();
      const updated = [newReview, ...currentReviews.filter(r => r.id !== newReview.id)];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save review to localStorage:', e);
    }
  }

  return newReview;
}
