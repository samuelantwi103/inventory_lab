import asyncHandler from '../middleware/asyncHandler.js';
import InventoryService from '../services/InventoryService.js';

/**
 * Inventory Controller
 * Handles HTTP requests for inventory management
 * Follows Single Responsibility Principle
 */

/**
 * @desc    Get all inventory items
 * @route   GET /api/inventory
 * @access  Private
 */
export const getAllItems = asyncHandler(async (req, res) => {
  const { search, category, page, limit, sort } = req.query;

  const filters = {};
  if (search) filters.search = search;
  if (category) filters.category = category;

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sort || '-createdAt',
  };

  const result = await InventoryService.getAllItems(filters, options);

  res.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get single inventory item
 * @route   GET /api/inventory/:id
 * @access  Private
 */
export const getItemById = asyncHandler(async (req, res) => {
  const item = await InventoryService.getItemById(req.params.id);

  res.status(200).json({
    success: true,
    data: item,
  });
});

/**
 * @desc    Create new inventory item
 * @route   POST /api/inventory
 * @access  Private
 */
export const createItem = asyncHandler(async (req, res) => {
  const item = await InventoryService.createItem(req.body, req.user._id);

  res.status(201).json({
    success: true,
    data: item,
    message: 'Inventory item created successfully',
  });
});

/**
 * @desc    Update inventory item
 * @route   PUT /api/inventory/:id
 * @access  Private
 */
export const updateItem = asyncHandler(async (req, res) => {
  const item = await InventoryService.updateItem(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: item,
    message: 'Inventory item updated successfully',
  });
});

/**
 * @desc    Delete inventory item
 * @route   DELETE /api/inventory/:id
 * @access  Private
 */
export const deleteItem = asyncHandler(async (req, res) => {
  const result = await InventoryService.deleteItem(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
    message: result.message,
  });
});

/**
 * @desc    Update item quantity
 * @route   PATCH /api/inventory/:id/quantity
 * @access  Private
 */
export const updateQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const item = await InventoryService.updateQuantity(req.params.id, quantity);

  res.status(200).json({
    success: true,
    data: item,
    message: 'Quantity updated successfully',
  });
});

/**
 * @desc    Get low stock items
 * @route   GET /api/inventory/lowstock/items
 * @access  Private
 */
export const getLowStockItems = asyncHandler(async (req, res) => {
  const result = await InventoryService.getLowStockItems();

  res.status(200).json({
    success: true,
    data: result.items,
    count: result.count,
  });
});

/**
 * @desc    Get inventory statistics
 * @route   GET /api/inventory/stats/summary
 * @access  Private
 */
export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await InventoryService.getStatistics();

  res.status(200).json({
    success: true,
    data: stats,
  });
});
