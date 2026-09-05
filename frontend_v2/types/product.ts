export type ProductCategory =
  | 'BIRTHDAY_CAKES'
  | 'WEDDING_CAKES'
  | 'CUSTOM_DESIGN'
  | 'CUPCAKES'
  | 'PASTRIES'
  | 'COOKIES'
  | 'DESSERTS'
  | 'BREADS';

export interface Product {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory | string;
  imageUrl?: string;
  isEggless: boolean;
  inStock: boolean;
  preparationTimeHours?: number;
  weightGrams?: number;
  minAdvanceHours?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isEggless: boolean;
  inStock: boolean;
  preparationTimeHours?: number;
  weightGrams?: number;
}
