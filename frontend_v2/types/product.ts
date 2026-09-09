export interface Category {
  id: number;
  shopId: number;
  name: string;
  slug?: string;
  displayOrder: number;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  displayOrder?: number;
}

export interface ProductVariant {
  id?: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface ProductAddon {
  id?: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface Product {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  categoryId?: number | null;
  categoryName?: string | null;
  category: string;
  imageUrl?: string;
  isEggless: boolean;
  inStock: boolean;
  availability?: boolean;
  preparationTimeHours?: number;
  weightGrams?: number;
  minAdvanceHours?: number;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  categoryId?: number | null;
  category?: string;
  imageUrl?: string;
  isEggless?: boolean;
  inStock?: boolean;
  availability?: boolean;
  preparationTimeHours?: number;
  weightGrams?: number;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
}
