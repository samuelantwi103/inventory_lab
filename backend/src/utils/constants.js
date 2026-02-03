/**
 * Constants
 * Application-wide constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const INVENTORY_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Food',
  'Books',
  'Toys',
  'Sports',
  'Other',
];

export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
};
