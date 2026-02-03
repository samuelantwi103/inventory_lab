import InventoryRepository from '../repositories/InventoryRepository.js';

/**
 * Inventory Service
 * Handles business logic for inventory management
 * Follows Single Responsibility Principle
 */
class InventoryService {
  /**
   * Get all inventory items with filters and pagination
   */
  async getAllItems(filters = {}, options = {}, userId) {
    const baseQuery = { createdBy: userId };

    // Handle search
    if (filters.search) {
      return await InventoryRepository.search(filters.search, baseQuery, options);
    }

    // Handle category filter
    if (filters.category) {
      return await InventoryRepository.findByCategory(filters.category, baseQuery, options);
    }

    // Default: get all items
    return await InventoryRepository.findAll(baseQuery, options);
  }

  /**
   * Get single inventory item by ID
   */
  async getItemById(id, userId) {
    const item = await InventoryRepository.findOne({ _id: id, createdBy: userId }, 'createdBy');

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return item;
  }

  /**
   * Create new inventory item
   */
  async createItem(itemData, userId) {
    // Add createdBy field
    itemData.createdBy = userId;

    // Create item
    const item = await InventoryRepository.create(itemData);

    return item;
  }

  /**
   * Update inventory item
   */
  async updateItem(id, updateData, userId) {
    // Check if item exists and belongs to user
    const existingItem = await InventoryRepository.findOne({ _id: id, createdBy: userId });

    if (!existingItem) {
      throw new Error('Inventory item not found');
    }

    // If SKU is being updated, check for duplicates
    if (updateData.sku && updateData.sku !== existingItem.sku) {
      const skuExists = await InventoryRepository.skuExists(updateData.sku);
      if (skuExists) {
        throw new Error('SKU already exists');
      }
    }

    // Update item
    const updatedItem = await InventoryRepository.updateById(id, updateData);

    return updatedItem;
  }

  /**
   * Delete inventory item
   */
  async deleteItem(id, userId) {
    // Check if item exists and belongs to user
    const item = await InventoryRepository.findOne({ _id: id, createdBy: userId });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    // Delete item
    await InventoryRepository.deleteById(id);

    return { message: 'Inventory item deleted successfully' };
  }

  /**
   * Update item quantity
   */
  async updateQuantity(id, quantity, userId) {
    // Validate quantity
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // Check if item exists and belongs to user
    const item = await InventoryRepository.findOne({ _id: id, createdBy: userId });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    // Update quantity
    const updatedItem = await InventoryRepository.updateQuantity(id, quantity);

    return updatedItem;
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(userId, options = {}) {
    return await InventoryRepository.findLowStock({ createdBy: userId }, options);
  }

  /**
   * Get inventory statistics
   */
  async getStatistics(userId) {
    const allItems = await InventoryRepository.findAll({ createdBy: userId });
    const lowStockResult = await InventoryRepository.findLowStock({ createdBy: userId });

    const totalItems = allItems.pagination.total;
    const totalValue = allItems.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const lowStockCount = lowStockResult.count;
    const outOfStockCount = allItems.items.filter(item => item.quantity === 0).length;

    return {
      totalItems,
      totalValue: totalValue.toFixed(2),
      lowStockCount,
      outOfStockCount,
    };
  }
}

export default new InventoryService();
