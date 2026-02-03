import api from './api';

class InventoryService {
  /**
   * Get all inventory items with optional filters
   * @param {object} params - {search, category, stockStatus, sortBy, sortOrder, page, limit}
   * @returns {Promise<{items: Array, pagination: object, stats: object}>}
   */
  async getItems(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.stockStatus) queryParams.append('stockStatus', params.stockStatus);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/inventory?${queryParams.toString()}`);
    return response.data.data;
  }

  /**
   * Get single inventory item by ID
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async getItemById(id) {
    const response = await api.get(`/inventory/${id}`);
    return response.data.data;
  }

  /**
   * Create new inventory item
   * @param {object} itemData 
   * @returns {Promise<object>}
   */
  async createItem(itemData) {
    const response = await api.post('/inventory', itemData);
    return response.data.data;
  }

  /**
   * Update inventory item
   * @param {string} id 
   * @param {object} itemData 
   * @returns {Promise<object>}
   */
  async updateItem(id, itemData) {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data.data;
  }

  /**
   * Delete inventory item
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deleteItem(id) {
    await api.delete(`/inventory/${id}`);
  }

  /**
   * Update item quantity
   * @param {string} id 
   * @param {number} quantity 
   * @returns {Promise<object>}
   */
  async updateQuantity(id, quantity) {
    const response = await api.patch(`/inventory/${id}/quantity`, { quantity });
    return response.data.data;
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<object>}
   */
  async getStats() {
    const response = await api.get('/inventory/stats/summary');
    return response.data.data;
  }

  /**
   * Get low stock items
   * @returns {Promise<Array>}
   */
  async getLowStockItems() {
    const response = await api.get('/inventory/lowstock/items');
    return response.data.data;
  }
}

export default new InventoryService();
