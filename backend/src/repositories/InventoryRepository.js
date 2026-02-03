import BaseRepository from './BaseRepository.js';
import InventoryItem from '../models/InventoryItem.js';

/**
 * Inventory Repository
 * Handles data access for InventoryItem model
 * Extends BaseRepository for common CRUD operations
 */
class InventoryRepository extends BaseRepository {
  constructor() {
    super(InventoryItem);
  }

  /**
   * Find items by category
   */
  async findByCategory(category, options = {}) {
    return await this.findAll({ category }, options);
  }

  /**
   * Find low stock items
   */
  async findLowStock(options = {}) {
    const items = await this.model.find().sort(options.sort || '-createdAt');
    
    // Filter items where quantity <= lowStockThreshold
    const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold);
    
    return {
      items: lowStockItems,
      count: lowStockItems.length,
    };
  }

  /**
   * Search items by name or SKU
   */
  async search(searchTerm, options = {}) {
    const regex = new RegExp(searchTerm, 'i');
    const filters = {
      $or: [
        { name: regex },
        { sku: regex },
        { description: regex },
      ],
    };
    
    return await this.findAll(filters, options);
  }

  /**
   * Update item quantity
   */
  async updateQuantity(id, quantity) {
    return await this.updateById(id, { quantity });
  }

  /**
   * Check if SKU exists
   */
  async skuExists(sku) {
    const item = await this.model.findOne({ sku });
    return !!item;
  }
}

export default new InventoryRepository();
