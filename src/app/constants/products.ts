import type { Product } from "../types";

export const SAMPLE_IMAGE_REPLACEMENTS: Record<string, string> = {
  "/sample-products/tshirt.png": "/sample-products/tshirt.jpg",
  "/sample-products/towel.png": "/sample-products/towel.jpg",
  "/sample-products/badge.png": "/sample-products/badge.jpg",
  "/sample-products/cd.png": "/sample-products/cd.jpg",
  "/sample-products/hoodie.png": "/sample-products/hoodie.jpg",
  "/sample-products/keychain.png": "/sample-products/keychain.jpg",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "オリジナルTシャツ",
    price: 3500,
    stock: 20,
    category: "アパレル",
    imageUrl: "/sample-products/tshirt.jpg",
  },
  {
    id: "2",
    name: "ライブタオル",
    price: 2000,
    stock: 15,
    category: "グッズ",
    imageUrl: "/sample-products/towel.jpg",
  },
  {
    id: "3",
    name: "缶バッジセット",
    price: 800,
    stock: 3,
    category: "グッズ",
    imageUrl: "/sample-products/badge.jpg",
  },
  {
    id: "4",
    name: "特典CD",
    price: 1500,
    stock: 0,
    category: "メディア",
    imageUrl: "/sample-products/cd.jpg",
  },
  {
    id: "5",
    name: "パーカー",
    price: 5500,
    stock: 8,
    category: "アパレル",
    imageUrl: "/sample-products/hoodie.jpg",
  },
  {
    id: "6",
    name: "キーホルダー",
    price: 600,
    stock: 25,
    category: "グッズ",
    imageUrl: "/sample-products/keychain.jpg",
  },
];
