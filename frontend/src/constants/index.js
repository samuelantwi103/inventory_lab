// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://inventory-lab.onrender.com/api';

// Product Categories
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Furniture',
  'Books',
  'Toys',
  'Sports',
  'Other',
];

// Stock Status
export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'inventory_token',
  USER: 'inventory_user',
};
