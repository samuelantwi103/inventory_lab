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
  async getAllItems(filters = {}, options = {}) {
    // Handle search
    if (filters.search) {
      return await InventoryRepository.search(filters.search, options);
    }

    // Handle category filter
    if (filters.category) {
      return await InventoryRepository.findByCategory(filters.category, options);
    }

    // Default: get all items
    return await InventoryRepository.findAll({}, options);
  }

  /**
   * Get single inventory item by ID
   */
  async getItemById(id) {
    const item = await InventoryRepository.findById(id, 'createdBy');

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
  async updateItem(id, updateData) {
    // Check if item exists
    const existingItem = await InventoryRepository.findById(id);

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
  async deleteItem(id) {
    // Check if item exists
    const item = await InventoryRepository.findById(id);

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
  async updateQuantity(id, quantity) {
    // Validate quantity
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // Check if item exists
    const item = await InventoryRepository.findById(id);

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
  async getLowStockItems(options = {}) {
    return await InventoryRepository.findLowStock(options);
  }

  /**
   * Get inventory statistics
   */
  async getStatistics() {
    const allItems = await InventoryRepository.findAll();
    const lowStockResult = await InventoryRepository.findLowStock();

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
