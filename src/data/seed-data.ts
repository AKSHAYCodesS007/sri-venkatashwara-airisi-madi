import { StoreInfo, Category, Product, OfferBanner, Order, FaqItem, CustomerAddress, UserProfile, UserReview } from '@/types';

export const STORE_INFO: StoreInfo = {
  name: "SRI VENKATESHWARA ARISI MANDY",
  tamilName: "ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி",
  invocation: "ஸ்ரீ குழந்தை அம்மன் துணை",
  tagline: "Rice Wholesale Merchant • அரிசி மொத்த வியாபாரம்",
  subTagline: "Direct Mill Supply & Wholesale Mandy • Chennai",
  established: "1998",
  heritage: "Over 25+ Years of Rice Milling & Wholesale Excellence",
  whatsappNumber: "919962119810",
  displayPhone: "+91 99621 19810",
  alternatePhone: "+91 95000 14516",
  millPhone: "+91 98402 80459 / +91 83002 30459",
  email: "srivenkateswaraarisimandy@gmail.com",
  address: "No.5, VOC Nagar, Kundrathur Main Road, Chiikkarayapuram, Chennai - 600069",
  mandiAddressTamil: "எண்.5, வ.உ.சி நகர், குன்றத்தூர் மெயின்ரோடு, சிக்கராயபுரம், சென்னை - 600 069",
  millName: "Sri Venkateswara Modern Rice Mill",
  millAddress: "No.1/247, Vanniyar Street, Kolapakkam, Chennai - 600128",
  millAddressTamil: "எண்.1/247, வன்னியர் தெரு, கொளப்பாக்கம், சென்னை - 600 128",
  proprietor: "G. Venkatesan Naicker",
  proprietorTamil: "G. வெங்கடேசன் நாயக்கர்",
  proprietorTitle: "Managing Proprietor / நிர்வாக உரிமையாளர்",
  hours: "Mon - Sat: 7:30 AM - 9:00 PM | Sunday: 8:00 AM - 2:00 PM",
  gstin: "33BDWPJ4019A1ZT",
  freeDeliveryThreshold: 999,
  logo: "/images/logo.png",
  serviceArea: "Exclusively Chennai City & Suburbs (PIN 600xxx)"
};

export const CATEGORIES: Category[] = [
  { id: "all", name: "All", icon: "🌾", count: 0, desc: "Complete collection of aged paddy varieties" },
  { id: "boiled-rice", name: "Boiled Rice", icon: "boiled", count: 0, image: "/images/products/aks-bullet.jpg", desc: "Parboiled aged grains, nutrient-rich & firm texture" },
  { id: "steam-rice", name: "Steam Rice", icon: "steam", count: 0, image: "/images/products/uk-balaji-steam-rice.jpg", desc: "Steam-cured grains, pristine white, extra fluffy & tender" },
  { id: "raw-rice", name: "Raw Rice", icon: "raw", count: 0, image: "/images/products/mrn-old-raw-rice.jpg", desc: "Pure natural raw paddy, authentic sweet taste & aroma" },
  { id: "basmati-rice", name: "Basmati Rice", icon: "sparkles", count: 0, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", desc: "Long grain aromatic royal grains with royal elongation" },
  { id: "idly-rice", name: "Idly Rice", icon: "idly", count: 0, image: "/images/products/orange-idly-rice.jpg", desc: "Short round grains high in starch for cloud-soft batter" },
  { id: "broken-rice", name: "Broken Rice", icon: "broken", count: 0, image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80", desc: "Economical short-cut broken grains for khichdi & kanji" },
  { id: "organic-rice", name: "Organic Rice", icon: "heart-pulse", count: 0, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80", desc: "Certified chemical-free, low-GI brown & heritage grains" }
];

export const PRODUCTS: Product[] = [
  {
    id: "aks-bullet-26kg",
    name: "AKS BULLET",
    category: "boiled-rice",
    origin: "Sri Velmurugan Modern Rice Mill, Vandavasi",
    aging: "Naturally Aged Boiled Rice",
    description: "AKS Bullet Brand Rajabogam Premium Boiled Rice from Sri Velmurugan Modern Rice Mill, Kilkodungalore, Vandavasi TK. Specially cleaned and cured for superior fluffiness, aroma, and delicious everyday family meals.",
    image: "/images/products/aks-bullet.jpg",
    badge: "Mill Direct",
    rating: 4.9,
    reviewCount: 48,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1830, originalPrice: 1950, inStock: true }
    ]
  },
  {
    id: "maharaja-eeyarakai-26kg",
    name: "MAHARAJA EEYARAKAI BRAND",
    category: "boiled-rice",
    origin: "Maharajha Rice Mills Private Limited",
    aging: "Naturally Aged Old Crop",
    description: "King of Rice — Maharajha Eeyarakai Brand Premium Rice from Maharajha Rice Mills Private Limited. 100% genuine old crop boiled rice with exceptional grain elongation, delicious taste, and wholesome everyday nutrition.",
    image: "/images/products/maharaja-eeyarakai.jpg",
    badge: "King of Rice",
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    defaultWeight: "26kg",
    weights: [
      { weight: "26kg", price: 2050, originalPrice: 2250, inStock: true }
    ]
  },
  {
    id: "krishna-gold-26kg",
    name: "KRISHNA GOLD",
    category: "boiled-rice",
    origin: "VIP Special Sortex Processors",
    aging: "100% Sortex Cleaned",
    description: "Krishna Gold No.1 VIP Special 100% Sortex Rice. Stone-less, broken and black grains completely removed. Features lingering natural aroma and fine soft texture for family meals.",
    image: "/images/products/krishna-gold.jpg",
    badge: "100% Sortex",
    rating: 4.8,
    reviewCount: 52,
    inStock: true,
    defaultWeight: "26kg",
    weights: [
      { weight: "26kg", price: 1600, originalPrice: 1750, inStock: true }
    ]
  },
  {
    id: "aks-special-ponni-26kg",
    name: "AKS SPECIAL POONI RICE",
    category: "boiled-rice",
    origin: "Sri Velmurugan Modern Rice Mill, Vandavasi",
    aging: "Aged Boiled Ponni",
    description: "AKS Special Best Premium Ponni Rice from Sri Velmurugan Modern Rice Mill, Kilkodungalore, Vandavasi Tk. Fine selected paddy grains with great fluffiness, natural fragrance, and zero stickiness.",
    image: "/images/products/aks-special-ponni.jpg",
    badge: "Premium Ponni",
    rating: 4.8,
    reviewCount: 71,
    inStock: true,
    defaultWeight: "26kg",
    weights: [
      { weight: "26kg", price: 1780, originalPrice: 1920, inStock: true }
    ]
  },
  {
    id: "aks-hmt-akshaya-ponni-26kg",
    name: "AKS HMT AKSHAYA PONNI RICE",
    category: "boiled-rice",
    origin: "Sri Velmurugan Modern Rice Mill, Vandavasi",
    aging: "Premium HMT Cured",
    description: "AKS Brand Premium HMT Akshaya Ponni Rice manufactured & marketed by Sri Velmurugan Modern Rice Mill, Kilkodungalore, Vandavasi Tk. Delicate slender texture, high volume yield, and rich traditional flavor.",
    image: "/images/products/aks-hmt-akshaya-ponni.jpg",
    badge: "HMT Akshaya",
    rating: 4.9,
    reviewCount: 93,
    inStock: true,
    defaultWeight: "26kg",
    weights: [
      { weight: "26kg", price: 1930, originalPrice: 2100, inStock: true }
    ]
  },
  {
    id: "roja-ponni-26kg",
    name: "ROJA PONNI",
    category: "boiled-rice",
    origin: "Arni, Tamil Nadu",
    aging: "Naturally Aged Arni Ponni",
    description: "Arni Roja Brand No.1 Super Fine Rice. Carefully destoned and sortex cleaned with broken & black grains removed. Known for pure aroma, tenderness, and exceptional fluffiness for daily family meals.",
    image: "/images/products/roja-ponni.jpg",
    badge: "Super Fine",
    rating: 4.8,
    reviewCount: 57,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1750, originalPrice: 1900, inStock: true }
    ]
  },
  {
    id: "nagaraja-777-ponni-26kg",
    name: "NAGARAJA 777 BRAND PONNI",
    category: "boiled-rice",
    origin: "R. Jeevagan Nagaraja Modern Rice Mill, Arni",
    aging: "Triple 777 Aged Special",
    description: "Arni Triple Seven 777 Brand No.1 Special V.I.P. Ponni Rice from Nagaraja Modern Rice Mill, Arni. Premium grade aged boiled rice renowned for long slender grain structure and authentic homestyle taste.",
    image: "/images/products/nagaraja-777-ponni.jpg",
    badge: "777 Special VIP",
    rating: 4.9,
    reviewCount: 82,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 2030, originalPrice: 2200, inStock: true }
    ]
  },
  {
    id: "nagaraja-gold-white-ponni-26kg",
    name: "NAGARAJA GOLD WHITE PONNI",
    category: "boiled-rice",
    origin: "R. Jeevagan Nagaraja Modern Rice Mill, Arni",
    aging: "Superior White Ponni Aged",
    description: "Nagaraja Gold Fine Rice — Pure Vellai Ponni (White Ponni) from Nagaraja Modern Rice Mill, Arni. Top-tier signature grade with bright white color, pristine non-sticky grains, and exquisite dining satisfaction.",
    image: "/images/products/nagaraja-gold-white-ponni.jpg",
    badge: "Gold Vellai Ponni",
    rating: 4.9,
    reviewCount: 114,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 2300, originalPrice: 2500, inStock: true }
    ]
  },
  {
    id: "vkr-sivaji-brand-26kg",
    name: "VKR SIVAJI BRAND",
    category: "boiled-rice",
    origin: "V.K.R. Venkatesan Modern Mill",
    aging: "VIP No.1 Quality Aged",
    description: "V.K.R. Venkatesan Sivaji Brand VIP Rice — No. 1 Premium Quality Rice. Naturally aged boiled rice with superior cooking expansion, distinct aroma, and tender texture for family meals.",
    image: "/images/products/vkr-sivaji-brand.jpg",
    badge: "VIP No.1",
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 2150, originalPrice: 2350, inStock: true }
    ]
  },
  {
    id: "sunflower-brand-sona-26kg",
    name: "SUNFLOWER BRAND SONA 26KGS",
    category: "boiled-rice",
    origin: "Sunflower Grain Mills",
    aging: "Naturally Cured Sona",
    description: "Sunflower Brand Sona Premium Rice. Quality assured grains enriched with natural nutrients. Fluffs into lightweight, easily digestible grains that pair wonderfully with sambar, dal, and curries.",
    image: "/images/products/sunflower-brand-sona.jpg",
    badge: "Quality Assured",
    rating: 4.8,
    reviewCount: 61,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1730, originalPrice: 1900, inStock: true }
    ]
  },
  {
    id: "sbm-kichadi-ponni-26kg",
    name: "SBM KICHADI PONNI",
    category: "boiled-rice",
    origin: "Sri Balaji Mills (Rice)",
    aging: "Silky Sorted Aged",
    description: "SBM Rajabogam Kitchadi Ponni Rice processed and packed by Sri Balaji Mills. 100% silky and sorted premium quality rice with soft grain texture, non-sticky fluffiness, and authentic taste.",
    image: "/images/products/sbm-kichadi-ponni.jpg",
    badge: "Silky & Sorted",
    rating: 4.8,
    reviewCount: 69,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1850, originalPrice: 2000, inStock: true }
    ]
  },
  {
    id: "royal-jet-26kg",
    name: "ROYAL JET",
    category: "boiled-rice",
    origin: "R. Jeevagan & Sons, Arni",
    aging: "Long Rice Aged",
    description: "Royal Jet Symbol of Best Quality — Royal Rice Premium Quality Rice in Tamil Nadu from R. Jeevagan & Sons, Arni. Features extra long rice grains with rich enticing aroma and first-class culinary texture.",
    image: "/images/products/royal-jet.jpg",
    badge: "Royal Quality",
    rating: 4.9,
    reviewCount: 95,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 2050, originalPrice: 2250, inStock: true }
    ]
  },
  {
    id: "orange-idly-rice-26kg",
    name: "ORANGE IDLY RICE",
    category: "idly-rice",
    origin: "Orange Gold Mills",
    aging: "Optimal Fermentation Aged",
    description: "Orange Gold Premium Quality Special Idly & Dosa Rice. High-starch short round grains selected for superior batter fermentation, delivering cloud-soft fluffy idlis and crispy golden dosas.",
    image: "/images/products/orange-idly-rice.jpg",
    badge: "Idly & Dosa Special",
    rating: 4.8,
    reviewCount: 46,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1140, originalPrice: 1300, inStock: true }
    ]
  },
  {
    id: "aks-old-idly-rice-26kg",
    name: "AKS OLD IDLY RICE",
    category: "idly-rice",
    origin: "Sri Velmurugan Modern Rice Mill, Vandavasi",
    aging: "Old Crop Cured",
    description: "AKS Brand No. 1 Old Idly Rice (100% Sortex Cleaned) from Sri Velmurugan Modern Rice Mill, Kilkodungalore, Vandavasi Tk. Naturally aged old crop yielding maximum batter rise, soft texture, and authentic South Indian breakfast flavor.",
    image: "/images/products/aks-old-idly-rice.jpg",
    badge: "Sortex No.1",
    rating: 4.9,
    reviewCount: 68,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1280, originalPrice: 1450, inStock: true }
    ]
  },
  {
    id: "mrn-old-raw-rice-26kg",
    name: "MRN OLD RAW RICE",
    category: "raw-rice",
    origin: "M.R.N. Agro Industries, Raichur",
    aging: "Double Old Sona Aged",
    description: "MRN Agro Industries Double Old Sona Raw Rice from Raichur. Naturally aged double-old crop raw rice with rich aroma, 100% pure quality, and delicate sweet flavor that fluffs up beautifully for daily family dining.",
    image: "/images/products/mrn-old-raw-rice.jpg",
    badge: "Double Old Sona",
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 2000, originalPrice: 2200, inStock: true }
    ]
  },
  {
    id: "hamsa-raw-rice-26kg",
    name: "HAMSA RAW RICE",
    category: "raw-rice",
    origin: "Vijayalakshmi Rice Industries, Nellore",
    aging: "Satake Japan 100% Sortex Cured",
    description: "Hamsa A Symbol of Purity — Premium Raw Rice processed with Satake Japan 100% Sortex technology by Vijayalakshmi Rice Industries, Nellore. Pristine white raw grains with sweet taste and tempting aroma.",
    image: "/images/products/hamsa-raw-rice.jpg",
    badge: "100% Sortex",
    rating: 4.8,
    reviewCount: 62,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1730, originalPrice: 1900, inStock: true }
    ]
  },
  {
    id: "aks-raw-rice-26kg",
    name: "AKS RAW RICE",
    category: "raw-rice",
    origin: "Sri Velmurugan Modern Rice Mill, Vandavasi",
    aging: "Naturally Aged Pacharisi (Old Crop)",
    description: "AKS Special Nayam Pacharisi (Premium Raw Rice) from Hi-Tech Modern Processing. Carefully sortex-cleaned aged raw grains, ideal for authentic South Indian pongal, sweets, and daily lunch meals.",
    image: "/images/products/aks-raw-rice.jpg",
    badge: "Nayam Pacharisi",
    rating: 4.9,
    reviewCount: 75,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1730, originalPrice: 1900, inStock: true }
    ]
  },
  {
    id: "uk-balaji-steam-rice-26kg",
    name: "UK BALAJI STEAM RICE",
    category: "steam-rice",
    origin: "Sri Ramanjaneya Modern Rice Mill, Nellore",
    aging: "Kurnool Sona Steam Cured",
    description: "UK Balaji Steam Rice from Sri Ramanjaneya Modern Rice Mill. Premium quality steam cured grains offering bright white appearance, fluffiness, and distinct non-sticky texture for everyday dining.",
    image: "/images/products/uk-balaji-steam-rice.jpg",
    badge: "Direct Mill",
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1850, originalPrice: 2000, inStock: true }
    ]
  },
  {
    id: "mrn-steam-rice-26kg",
    name: "MRN OLD SONA STEAM RICE",
    category: "steam-rice",
    origin: "M.R.N. Agro Industries, Raichur",
    aging: "Old Sona Steam Aged",
    description: "MRN Agro Industries Old Sona Steam Rice from Raichur. Genuine old sona steam processed rice with uniform elongated grains, rich aroma, and soft non-sticky texture.",
    image: "/images/products/mrn-steam-rice.jpg",
    badge: "Old Sona Steam",
    rating: 4.9,
    reviewCount: 56,
    inStock: true,
    defaultWeight: "26 kg",
    weights: [
      { weight: "26 kg", price: 1950, originalPrice: 2150, inStock: true }
    ]
  },
  {
    id: "hamsa-gold-steam-rice-26kg",
    name: "HAMSA GOLD STEAM RICE",
    category: "steam-rice",
    origin: "Vijayalakshmi Rice Industries, Nellore",
    aging: "Satake Japan 100% Sortex Steam",
    description: "Hamsa Gold A Symbol of Purity Steam Rice from Vijayalakshmi Rice Industries, Nellore. Processed with Satake Japan 100% sortex technology for spotless white, fluffy grains that stay fresh for hours.",
    image: "/images/products/hamsa-gold-steam-rice.jpg",
    badge: "Satake 100% Sortex",
    rating: 4.8,
    reviewCount: 39,
    inStock: true,
    defaultWeight: "25kg",
    weights: [
      { weight: "25kg", price: 1850, originalPrice: 2050, inStock: true }
    ]
  },
  {
    id: "classic-muthayam-rice-26kg",
    name: "VARALAKSHMI MUTHYAM CLASSIC",
    category: "steam-rice",
    origin: "Varalakshmi Muthyam Super Premium Rice",
    aging: "Super Premium Pearl Cured",
    description: "Varalakshmi Muthyam Classic Super Premium Rice. A true taste of rice awaits for you. Lustrous pearl grains that cook to perfection with exquisite aroma, lightweight mouthfeel, and excellent elongation.",
    image: "/images/products/classic-muthayam-rice.jpg",
    badge: "Super Premium",
    rating: 4.9,
    reviewCount: 68,
    inStock: true,
    defaultWeight: "25KG",
    weights: [
      { weight: "25KG", price: 2000, originalPrice: 2200, inStock: true }
    ]
  },
  {
    id: "aruna-steam-rice-26kg",
    name: "ARUNA PLATINUM STEAM RICE",
    category: "steam-rice",
    origin: "Siddeswara Rice Mill, Sullurpeta",
    aging: "100% Sortex Platinum Cured",
    description: "VR Aruna Platinum Super Premium Steam Rice from Siddeswara Rice Mill, Sullurpeta, Nellore Dist. Extra long grain 100% sortex quality steam rice meticulously cured for pristine whiteness and rich flavor.",
    image: "/images/products/aruna-steam-rice.jpg",
    badge: "Platinum Sortex",
    rating: 4.8,
    reviewCount: 51,
    inStock: true,
    defaultWeight: "25kg",
    weights: [
      { weight: "25kg", price: 2000, originalPrice: 2200, inStock: true }
    ]
  }
];

export const SAMPLE_PRODUCTS: Product[] = PRODUCTS;

export const DEFAULT_OFFER_BANNERS: OfferBanner[] = [
  {
    id: "banner-cat-boiled",
    category: "boiled-rice",
    categoryName: "Boiled Rice (புழுங்கல் அரிசி)",
    productId: "aks-bullet-26kg",
    weight: "26 kg",
    badge: "🔥 CHENNAI DAILY STAPLE",
    headline: "King of Daily Family Meals — Aged Boiled Rice 26kg Sacks",
    subtitle: "Naturally godown-cured for over 14 months. Pearlescent, stone-less grains with superior elongation. Zero stickiness — absorbs rasam & sambar without getting mushy.",
    discount: "MILL DIRECT FROM ₹1,830",
    brand: "AKS BULLET & MAHARAJA EEYARAKAI",
    image: "/images/products/aks-bullet.jpg",
    highlights: ["🌾 14 Mo. Godown Ageing", "🍚 Non-Sticky & Fluffy", "📦 Sealed 26kg Heavy Sack"]
  },
  {
    id: "banner-cat-steam",
    category: "steam-rice",
    categoryName: "Steam Rice (ஸ்டீம் அரிசி)",
    productId: "uk-balaji-steam-rice-26kg",
    weight: "26 kg",
    badge: "✨ PURE PRISTINE WHITE",
    headline: "Snow-White, Cloud Tender Steam Rice — Pure Dining Elegance",
    subtitle: "Cured with pressurized steam to seal in natural paddy bran vitamins. Grains cook separate, snow-white, and stay warm and tender for hours.",
    discount: "WHOLESALE SACK ₹1,720",
    brand: "UK BALAJI STEAM RICE",
    image: "/images/products/uk-balaji-steam-rice.jpg",
    highlights: ["✨ 100% Sortex Cleaned", "🍲 Cloud Tender Grains", "🌿 Natural Sweet Fragrance"]
  },
  {
    id: "banner-cat-raw",
    category: "raw-rice",
    categoryName: "Raw Rice & Sona Masuri (பச்சரிசி)",
    productId: "mrn-old-raw-rice-26kg",
    weight: "26 kg",
    badge: "🌾 18-MONTH CURED",
    headline: "18-Month Aged Natural Godown Raw Rice — Sweet Traditional Aroma",
    subtitle: "Pure unadulterated raw paddy from Andhra & Cauvery river basins. Featherlight on the stomach, non-sticky fluffiness, and authentic traditional godown aroma.",
    discount: "SAVE ₹220 (₹1,950)",
    brand: "MRN OLD RAW RICE",
    image: "/images/products/mrn-old-raw-rice.jpg",
    highlights: ["⏳ 18+ Mo. Naturally Aged", "🌾 Featherlight Digestion", "🍯 Authentic Sweet Taste"]
  },
  {
    id: "banner-cat-idly",
    category: "idly-rice",
    categoryName: "Idly & Batter Rice (இட்லி அரிசி)",
    productId: "orange-idly-rice-26kg",
    weight: "26 kg",
    badge: "☁️ 3X FERMENTATION BATTER",
    headline: "Cloud-Soft Idlis & Crispy Golden Dosas — 26kg Batter Master",
    subtitle: "High-starch, plump sortex grains engineered for superior batter fermentation volume. Produces cloud-soft idlis and restaurant-style crispy roast dosas.",
    discount: "DIRECT MANDY ₹1,250",
    brand: "ORANGE IDLY RICE",
    image: "/images/products/orange-idly-rice.jpg",
    highlights: ["☁️ Maximum Fermentation", "🥞 Golden Roast Dosas", "💯 Zero Stones & Impurities"]
  },
  {
    id: "banner-cat-basmati",
    category: "basmati-rice",
    categoryName: "Royal Basmati (பாசுமதி அரிசி)",
    productId: "royal-1121-xxl-basmati",
    weight: "5kg & 25kg",
    badge: "👑 24MM GRAIN ELONGATION",
    headline: "Royal 1121 XXL Aromatic Basmati — Signature Biryani Masterpiece",
    subtitle: "Aged for 2 full years in Himalayan foothills. Extra-long slender grains that elongate up to 24mm without breaking. The undisputed choice for dum biryani masters.",
    discount: "ROYAL CHEF HARVEST",
    brand: "ROYAL 1121 XXL BASMATI",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    highlights: ["👑 24mm Grain Length", "🍛 Signature Dum Biryani", "✨ Delicate Godown Scent"]
  }
];

export const SAMPLE_OFFER_BANNERS: OfferBanner[] = [
  {
    id: "banner-1",
    productId: "basmati-royal-1121",
    weight: "5kg",
    badge: "NEW",
    headline: "24-Month Aged Grains Meet Royal Biryani Dum",
    discount: "UP TO 20% OFF",
    brand: "ROYAL 1121 BASMATI",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "banner-2",
    productId: "kurnool-sona-masuri-aged",
    weight: "25kg",
    badge: "BESTSELLER",
    headline: "Light Digestive Texture Meets Daily Sambar Meals",
    discount: "FLAT ₹150 OFF ON 25KG SACK",
    brand: "KURNOOL SONA MASURI",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "banner-3",
    productId: "salem-gundu-idli-rice",
    weight: "5kg",
    badge: "TRADITIONAL PURE",
    headline: "Cauvery Delta Moisture Meets Spongy Cloud Idlis",
    discount: "UP TO 25% OFF",
    brand: "THANJAVUR PONNI & IDLI",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "banner-4",
    productId: "seeraga-samba-dindigul",
    weight: "5kg",
    badge: "FESTIVAL SPECIAL",
    headline: "Tiny Fragrant Pearls Meet Authentic Dum Mutton",
    discount: "EXTRA ₹100 OFF WITH CODE: MILL50",
    brand: "DINDIGUL SEERAGA SAMBA",
    image: "https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?auto=format&fit=crop&w=1200&q=80"
  }
];

export const INITIAL_USER: UserProfile = {
  name: "Ramesh Kumar",
  phone: "+91 99621 19810",
  email: "ramesh.kumar@gmail.com",
  defaultPincode: "600069",
  memberSince: "Nov 2023",
  loyaltyTier: "Chennai Patron (15 Orders)"
};

export const INITIAL_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    recipientName: "Ramesh Kumar",
    phone: "+91 99621 19810",
    address: "Flat 3B, Sri Sai Enclave, Kundrathur Main Road",
    area: "Chiikkarayapuram",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600069",
    isDefault: true
  },
  {
    id: "addr-2",
    label: "Kitchen / Branch",
    recipientName: "R. Saravanan",
    phone: "+91 98402 80459",
    address: "Door No. 42, Vanniyar Street",
    area: "Kolapakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600128",
    isDefault: false
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    orderId: "RS10245",
    date: "14 May 2024",
    items: [
      { name: "AKS BULLET", weight: "26 kg", quantity: 1, price: 1830 },
      { name: "UK BALAJI STEAM RICE", weight: "26 kg", quantity: 1, price: 1850 }
    ],
    total: 3680,
    status: "In Transit via Logistics",
    currentStep: 3,
    deliveryAddress: "Flat 3B, Sri Sai Enclave, Kundrathur Main Road, Chiikkarayapuram, Chennai - 600069",
    paymentMethod: "Cash on Delivery",
    trackingUpdates: [
      { status: "Order Received & Verified", location: "Chiikkarayapuram Mandi Hub, Chennai", time: "14 May, 09:30 AM" },
      { status: "Quality Inspection Passed", location: "Sri Venkateswara Modern Rice Mill, Kolapakkam", time: "14 May, 11:15 AM" },
      { status: "Loaded on Local Delivery Van", location: "Kundrathur Road Dispatch, Chennai", time: "14 May, 03:45 PM" },
      { status: "Out for Doorstep Delivery in Chennai", location: "Chennai Local Route", time: "15 May, 08:20 AM" }
    ]
  },
  {
    orderId: "RS09812",
    date: "28 April 2024",
    items: [
      { name: "ORANGE IDLY RICE", weight: "26 kg", quantity: 1, price: 1140 }
    ],
    total: 1140,
    status: "Delivered",
    currentStep: 4,
    deliveryAddress: "Door No. 42, Vanniyar Street, Kolapakkam, Chennai - 600128",
    paymentMethod: "WhatsApp Direct UPI",
    trackingUpdates: [
      { status: "Order Received", location: "Chiikkarayapuram Mandi, Chennai", time: "28 Apr, 10:00 AM" },
      { status: "Dispatched via Mill Van", location: "Kolapakkam Hub, Chennai", time: "28 Apr, 02:00 PM" },
      { status: "Delivered to Doorstep", location: "Kolapakkam, Chennai - 600128", time: "28 Apr, 04:30 PM" }
    ]
  }
];

export const FAQS: FaqItem[] = [
  {
    category: "quality",
    categoryName: "Grain Quality & Aging",
    question: "What does 'Naturally Aged Rice' mean, and why is aged rice superior?",
    answer: "Freshly harvested paddy contains excess moisture (18–22%), causing grains to stick together and cook into a gooey, heavy lump. At our Kurnool and Punjab godowns, paddy is aged in aerated wooden-slat racks for 12 to 24 months. During this natural curing period, the starch retrogrades, reducing moisture to an ideal 12%. When cooked, aged grains expand to over double their length, stay separate, and digest easily without heaviness."
  },
  {
    category: "quality",
    categoryName: "Grain Quality & Aging",
    question: "How can I verify that 1121 Basmati or Sona Masuri is genuinely aged and not chemically bleached?",
    answer: "Genuine aged grains have a subtle, warm off-white or light ivory/golden hue, with tapered needle-like tips and dry surface texture. Chemically bleached or polished rice has an unnatural chalky white glare. When cooked, our naturally aged rice emits a sweet, earthy cereal aroma without any artificial chemical perfuming."
  },
  {
    category: "delivery",
    categoryName: "Delivery & 25kg Sacks",
    question: "How are heavy 10kg and 25kg burlap/laminated sacks delivered to residential apartments?",
    answer: "We employ dedicated logistics partners and local mill dispatch executives who deliver heavy sacks directly to your doorstep, regardless of apartment floor or elevator status. There are ZERO floor surcharges. All 25kg bags are packed in double-stitched moisture-resistant inner liners to protect against dust and transit damage."
  },
  {
    category: "delivery",
    categoryName: "Delivery & 26kg Sacks",
    question: "Which locations do you deliver to, and what are the charges?",
    answer: "We deliver EXCLUSIVELY across Chennai city and its surrounding suburbs (all Chennai pincodes starting with 600xxx, including Kundrathur, Chiikkarayapuram, Porur, Kolapakkam, Tambaram, Chromepet, Guindy, Anna Nagar, T. Nagar, Mylapore, Velachery, OMR, etc.). Delivery is completely FREE on all orders over ₹999. Deliveries are dispatched directly from our Chiikkarayapuram Mandi & Kolapakkam Modern Rice Mill within 24 to 48 hours."
  },
  {
    category: "delivery",
    categoryName: "Delivery & 26kg Sacks",
    question: "Do you deliver outside Chennai?",
    answer: "Our retail doorstep delivery is strictly limited to Chennai city and surrounding suburbs (PIN 600xxx). For bulk commercial truck-load orders (50+ bags of 26kg) outside Chennai across Tamil Nadu, please contact our managing proprietor on WhatsApp at +91 99621 19810."
  },
  {
    category: "ordering",
    categoryName: "WhatsApp & Ordering",
    question: "Can I order directly over WhatsApp instead of online card checkout?",
    answer: "Absolutely! Sri Venkateshwara Arisi Mandy offers direct 1-click WhatsApp mill booking. Simply click 'Order on WhatsApp' on any product, your cart drawer, or checkout. Your entire order summary—including selected grain varieties, 26kg bag weights, delivery address, and final bill amount—is auto-formatted into a message. Send it to our mill desk at +91 99621 19810 and pay via Cash or UPI on arrival."
  },
  {
    category: "storage",
    categoryName: "Cooking & Storage",
    question: "What is the recommended cooking water ratio for Kurnool Sona Masuri and Royal 1121 Basmati?",
    answer: "For Aged Kurnool Sona Masuri (18+ Mo Raw): Use 1 cup rice to 2.25–2.5 cups water. Pressure cook for 3 whistles on medium flame, then let steam settle naturally. For 1121 XXL Basmati: Soak in cold water for 30 minutes before cooking. Use 1 cup rice to 1.75 cups water for open-pot boiling, or 85% water for dum biryani layering."
  },
  {
    category: "storage",
    categoryName: "Cooking & Storage",
    question: "How should I store bulk rice at home to prevent grain pests without harmful chemicals?",
    answer: "Transfer the grain into an airtight stainless steel drum or food-grade HDPE container kept off damp concrete floors. Introduce natural dried neem leaves, dried whole red chillies, and a few whole cloves into the drum. This age-old Indian agricultural technique repels rice weevils naturally without using any toxic synthetic pesticide tablets."
  },
  {
    category: "returns",
    categoryName: "Returns & Replacements",
    question: "What is your return or replacement policy if a bag arrives damaged or wet?",
    answer: "We provide an unconditional 7-Day 'Pure Harvest' Guarantee. If a sack arrives punctured, damp, or if the grain quality is not satisfactory, simply share a quick photograph with our WhatsApp support desk at +91 99621 19810. We will dispatch a fresh replacement sack immediately or process a 100% refund without requiring complicated return shipping paperwork."
  }
];

export const TRUST_PILLARS = [
  {
    icon: "🌾",
    title: "100% Natural Godown Curing",
    desc: "Zero chemical dryers. Naturally cured in ventilated godowns for 12 to 24 months to ensure non-sticky grains."
  },
  {
    icon: "🚜",
    title: "Direct Traditional Mill Sourcing",
    desc: "Sourced directly from farmer co-operatives and our family mills in Kurnool, Thanjavur, and Punjab."
  },
  {
    icon: "📦",
    title: "Doorstep Delivery of 25kg Sacks",
    desc: "No more carrying heavy sacks from the mandi. Reliable doorstep delivery across India with moisture-proof liners."
  },
  {
    icon: "💬",
    title: "Order Directly on WhatsApp",
    desc: "Prefer chatting over cards? Generate an instant pre-filled order message and complete checkout via WhatsApp."
  },
  {
    icon: "✨",
    title: "Triple Destoner Cleaned",
    desc: "Every batch is passed through 3-stage destoners, gravity separators, and color sortex machines."
  },
  {
    icon: "🤝",
    title: "7-Day Satisfaction Guarantee",
    desc: "If you are not delighted with aroma, elongation, or texture, we provide a 100% replacement or refund."
  }
];

export const TESTIMONIALS: {
  name: string;
  location: string;
  rating: number;
  text: string;
}[] = [];

export const DEFAULT_REVIEWS: UserReview[] = [];
