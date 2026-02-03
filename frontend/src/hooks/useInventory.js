import { useState, useEffect, useCallback } from 'react';
import inventoryService from '../services/inventoryService';

/**
 * Custom hook for inventory operations
 * Manages inventory state, fetching, and CRUD operations
 */
export const useInventory = (initialParams = {}) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch inventory items with filters
   */
  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getItems(params);
      // API returns array directly
      setItems(Array.isArray(data) ? data : (data.items || []));
      setPagination(data.pagination || null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch dashboard stats from API
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await inventoryService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Fetch low stock items from API
   */
  const fetchLowStockItems = useCallback(async () => {
    try {
      const data = await inventoryService.getLowStockItems();
      setLowStockItems(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Create new item
   */
  const createItem = useCallback(async (itemData) => {
    try {
      const newItem = await inventoryService.createItem(itemData);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Update existing item
   */
  const updateItem = useCallback(async (id, itemData) => {
    try {
      const updatedItem = await inventoryService.updateItem(id, itemData);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      throw err;
    }
  }, []);

  /**
   * Delete item
   */
  const deleteItem = useCallback(async (id) => {
    try {
      await inventoryService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      
      // Update pagination count
      if (pagination) {
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
        }));
      }
    } catch (err) {
      throw err;
    }
  }, [pagination]);

  /**
   * Refresh data - useful after mutations
   */
  const refresh = useCallback(async (params = {}) => {
    return fetchItems(params);
  }, [fetchItems]);

  // Initial fetch
  useEffect(() => {
    if (Object.keys(initialParams).length > 0) {
      fetchItems(initialParams);
    }
  }, []); // Only run once on mount

  return {
    items,
    pagination,
    stats,
    lowStockItems,
    loading,
    error,
    fetchItems,
    fetchStats,
    fetchLowStockItems,
    createItem,
    updateItem,
    deleteItem,
    refresh,
    setItems, // Exposed for optimistic updates
  };
};

export default useInventory;
