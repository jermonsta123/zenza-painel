export interface GalleryImage {
  id: string;
  url: string;
  name: string;
  sizeBytes: number;
  isMain?: boolean;
  order: number;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductDimensions {
  weightKg?: number;       // Peso do produto em kg (ex: 0.45 kg ou 1.2 kg)
  lengthCm?: number;       // Comprimento em cm (ex: 30 cm)
  widthCm?: number;        // Largura em cm (ex: 20 cm)
  heightCm?: number;       // Altura em cm (ex: 8 cm)
  packageType?: string;    // Embalagem (ex: "Caixa Standard Zenza", "Saco Acolchoado", "Estojo Rígido")
}

export type ProductStatus = 'draft' | 'published' | 'archived';
export type SizeCategory = 'clothing' | 'footwear' | 'accessories' | 'none';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  sku: string;
  
  // Categorization
  category: string;             // Category ID (from CATEGORIES_CATALOG)
  categoryName: string;         // Category Display Name
  subcategory: string;          // Subcategory ID
  subcategoryName: string;      // Subcategory Display Name
  
  // Pricing
  price: number;                // Current selling price (AOA / Kz) > 0
  originalPrice?: number;       // Base price before discount (AOA / Kz)
  discountPct?: number;         // Computed/validated % discount
  costPrice?: number;           // Operational cost for margin tracking
  
  // Visual Media
  image: string;                // Main featured image URL (mandatory to publish)
  galleryImages: GalleryImage[];// Additional gallery pictures
  
  // Stock & Inventory
  stockCount: number;           // Integer >= 0
  inStock: boolean;             // Boolean derived / aligned with inventory rules
  lowStockThreshold: number;    // Alert threshold (default: 5)
  trackInventory: boolean;      // Whether stock is strictly tracked
  
  // Content & Details
  description: string;          // Rich text / markdown description própria do produto
  specs: ProductSpec[];         // Key-Value technical specifications
  boxItems: string[];           // What is included in the package / box
  dimensions?: ProductDimensions; // Dimensões físicas e peso próprios do produto
  
  // Variants
  colors: ProductColor[];       // Color choices with name + hex
  hasSizeGuide: boolean;        // Whether size chart should be shown
  sizeCategory: SizeCategory;   // Size categorization mode
  sizes: string[];              // List of sizes available (e.g. S, M, L or 39, 40)
  
  // Controlled / Read-only / Audit fields
  status: ProductStatus;        // Publication status
  rating: number;               // Average customer rating (1.0 to 5.0) - Read-only
  reviewCount: number;          // Total customer reviews count - Read-only
  affiliateCommission?: number; // Commission % for partners (authorized roles only)
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductFormErrors {
  title?: string;
  category?: string;
  subcategory?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  stockCount?: string;
  sku?: string;
  description?: string;
  dimensions?: string;
  specs?: string;
  boxItems?: string;
  colors?: string;
  sizes?: string;
  general?: string;
}

