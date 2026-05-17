export type ProductId = 'milk' | 'paneer' | 'curd';

export const PRODUCTS: Array<{ id: ProductId; label: string; unit: string; decimals: number }> = [
  { id: 'milk', label: 'Milk', unit: 'L', decimals: 1 },
  { id: 'paneer', label: 'Paneer', unit: 'kg', decimals: 2 },
  { id: 'curd', label: 'Curd', unit: 'kg', decimals: 2 },
];
