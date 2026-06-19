export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
  deliveryType?: "immediate" | "shipping" | "other";
}

export type SalesStyle = "single" | "team";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: Date;
  items: CartItem[];
  total: number;
  paymentMethod: "cash" | "qr";
  receivedAmount?: number;
  change?: number;
  isCancelled?: boolean;
  cancelReason?: string;
  shippingItems?: ShippingItem[];
}

export interface ShippingItem {
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  isShipped: boolean;
  shippedAt?: Date;
}

export interface Settings {
  qrCodeImage?: string;
  ownerPin: string;
  isOwnerMode: boolean;
  isTestMode: boolean;
}
