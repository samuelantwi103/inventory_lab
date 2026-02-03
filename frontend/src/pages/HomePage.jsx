import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import EmptyState, { EmptyBoxIcon } from '../components/common/EmptyState';
import { CATEGORIES } from '../constants';
import inventoryService from '../services/inventoryService';

const HomePage = () => {
  const { stats, lowStockItems, items, fetchStats, fetchLowStockItems, fetchItems, deleteItem, setItems } = useInventory();
  const { success, error } = useToast();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // View State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'quantity', 'price'
  
  // Filter State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    price: '',
    lowStockThreshold: '10',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Derive unique categories from both constant list and existing items
  const availableCategories = [...new Set([
    ...CATEGORIES, 
    ...(items || []).map(item => item.category)
  ])].sort();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchLowStockItems(),
        fetchItems({
          search: search || undefined,
          category: category || undefined,
          sortBy: sortBy,
          limit: 100, // Increased limit for better UX
        }),
      ]);
    } catch (err) {
      console.error('Error loading data:', err);
      error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      quantity: '',
      price: '',
      lowStockThreshold: '10',
    });
    setFormErrors({});
  };

  const handleAddItem = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      lowStockThreshold: item.lowStockThreshold?.toString() || '10',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleQuickQuantity = async (e, item, change) => {
    e.stopPropagation();
    const newQuantity = item.quantity + change;
    if (newQuantity < 0) return;

    // Optimistic Update
    const originalItems = [...items];
    setItems(currentItems => 
      currentItems.map(i => i._id === item._id ? { ...i, quantity: newQuantity } : i)
    );

    try {
      await inventoryService.updateQuantity(item._id, newQuantity);
      // Background refresh to keep stats in sync, but don't blocking UI
      fetchStats();
    } catch (err) {
      // Revert on failure
      setItems(originalItems);
      error('Failed to update quantity');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.quantity) errors.quantity = 'Quantity is required';
    else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      errors.quantity = 'Must be a positive number';
    }
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Must be a positive number';
    }
    return errors;
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 10,
      };
      
      await inventoryService.createItem(itemData);
      success('Item added successfully');
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (err) {
      error(err.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : 10,
      };
      
      await inventoryService.updateItem(selectedItem._id, itemData);
      success('Item updated successfully');
      setShowEditModal(false);
      resetForm();
      loadData();
    } catch (err) {
      error(err.message || 'Failed to update item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(selectedItem._id);
      success('Item deleted successfully');
      setShowDeleteModal(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      error('Failed to delete item');
    }
  };

  const getStockBadge = (item) => {
    if (item.quantity === 0) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Out</span>;
    }
    if (item.quantity <= item.lowStockThreshold) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Low</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">In Stock</span>;
  };

  if (loading && !items) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header & Stats */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <Button onClick={handleAddItem} className="shadow-sm">
            <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add New Item</span>
            <span className="inline sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
             <div>
               <p className="text-xs sm:text-sm font-medium text-slate-500">Total Inventory Value</p>
               <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                 ${(parseFloat(stats?.totalValue) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
               <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
             <div>
               <p className="text-xs sm:text-sm font-medium text-slate-500">Unique Products</p>
               <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                 {stats?.totalItems || 0}
               </p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
               <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
               </svg>
             </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
             <div>
               <p className="text-sm font-medium text-slate-500">Low Stock</p>
               <p className={`text-2xl font-bold mt-1 ${stats?.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                 {stats?.lowStockCount || 0}
               </p>
             </div>
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats?.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats?.lowStockCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start sm:items-center gap-3">
             <div className="bg-amber-100 p-1.5 rounded-full text-amber-600 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <div className="flex-1">
               <p className="text-sm font-medium text-amber-900">
                 {stats.lowStockCount} items are running low on stock
               </p>
               {lowStockItems.length > 0 && (
                 <div className="mt-2 flex flex-wrap gap-2">
                   {lowStockItems.slice(0, 5).map(item => (
                     <button
                       key={item._id}
                       onClick={() => handleEditItem(item)}
                       className="text-xs bg-white border border-amber-200 text-amber-800 px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                     >
                       {item.name} ({item.quantity})
                     </button>
                   ))}
                   {lowStockItems.length > 5 && (
                     <span className="text-xs text-amber-600 self-center">+{lowStockItems.length - 5} more</span>
                   )}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-y border-slate-200/60 mb-6 sm:bg-transparent sm:border-y-0 sm:py-0 sm:mb-6 sm:static">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px]"
              icon={
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="All Categories"
              options={availableCategories.map(cat => ({ value: cat, label: cat }))}
              className="!w-48 hidden sm:block"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              options={availableCategories.map(cat => ({ value: cat, label: cat }))}
              className="min-w-[120px] sm:hidden"
            />
            
            {/* Mobile Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'name', label: 'By Name' },
                { value: 'quantity', label: 'By Qty' },
                { value: 'price', label: 'By Price' },
              ]}
              className="min-w-[110px] sm:hidden"
            />

            {/* Desktop Sort Buttons */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-1 mr-2 bg-slate-50">
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortBy === 'name' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('quantity')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortBy === 'quantity' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Qty
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${sortBy === 'price' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Price
              </button>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {!items || items.length === 0 ? (
        <Card>
          <EmptyState
            icon={EmptyBoxIcon}
            title="No inventory items"
            description="Get started by adding your first item"
            actionLabel="Add Item"
            onAction={handleAddItem}
          />
        </Card>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto pb-2 sm:pb-0">
                <table className="w-full text-left text-sm min-w-[600px] sm:min-w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 font-semibold text-slate-900">Item Name</th>
                      <th className="hidden sm:table-cell px-6 py-3 font-semibold text-slate-900">Category</th>
                      <th className="hidden md:table-cell px-6 py-3 font-semibold text-slate-900">Status</th>
                      <th className="px-4 py-3 sm:px-6 font-semibold text-slate-900">Stock Level</th>
                      <th className="px-4 py-3 sm:px-6 font-semibold text-slate-900 text-right">Value</th>
                      <th className="px-4 py-3 sm:px-6 font-semibold text-slate-900 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr 
                        key={item._id} 
                        onClick={() => handleEditItem(item)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3 sm:px-6">
                          <div className="font-medium text-slate-900">{item.name}</div>
                          {item.description && (
                             <div className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">{item.description}</div>
                          )}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 text-slate-600">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">
                             {item.category}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4">
                          {getStockBadge(item)}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <div className="flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={(e) => handleQuickQuantity(e, item, -1)}
                              className="w-8 h-8 sm:w-6 sm:h-6 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 active:bg-slate-100 transition-colors"
                              disabled={item.quantity <= 0}
                            >
                              -
                            </button>
                            <span className="w-6 sm:w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                            <button 
                              onClick={(e) => handleQuickQuantity(e, item, 1)}
                              className="w-8 h-8 sm:w-6 sm:h-6 rounded flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-right">
                          <div className="font-medium text-slate-900">${item.price.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">
                             Total: ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEditItem(item); }}
                              className="p-2 sm:p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                              className="p-2 sm:p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map(item => (
                <Card 
                  key={item._id} 
                  hoverable 
                  className="group cursor-pointer flex flex-col h-full active:scale-[0.99] transition-transform sm:active:scale-100"
                  onClick={() => handleEditItem(item)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                       <h3 className="font-semibold text-slate-900 truncate text-base" title={item.name}>{item.name}</h3>
                       <p className="text-sm text-slate-500 mt-0.5">{item.category}</p>
                    </div>
                    {getStockBadge(item)}
                  </div>
                  
                  {item.description && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                          <button 
                             onClick={(e) => handleQuickQuantity(e, item, -1)}
                             className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:text-red-600 hover:shadow-sm disabled:opacity-50 transition-all font-medium"
                             disabled={item.quantity <= 0}
                             title="Decrease stock"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold text-slate-900 w-8 text-center tabular-nums">{item.quantity}</span>
                          <button 
                             onClick={(e) => handleQuickQuantity(e, item, 1)}
                             className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white hover:text-green-600 hover:shadow-sm transition-all font-medium"
                             title="Increase stock"
                          >
                            +
                          </button>
                       </div>
                       <div className="text-right">
                         <div className="font-bold text-slate-900 text-lg">${item.price.toFixed(2)}</div>
                         {item.quantity > 0 && (
                           <div className="text-[10px] text-slate-400 font-medium">Total: ${(item.price * item.quantity).toLocaleString('en', { notation: 'compact' })}</div>
                         )}
                       </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Item"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <Input
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            error={formErrors.name}
            required
            placeholder="e.g., Wireless Mouse"
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600 transition-all hover:border-slate-300"
            />
          </div>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            error={formErrors.category}
            required
            placeholder="Select category"
            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              error={formErrors.quantity}
              required
              min="0"
              placeholder="0"
            />
            <Input
              label={
                <span className="flex items-center gap-1">
                  Price
                  <span className="text-xs font-normal text-slate-500">(per item)</span>
                </span>
              }
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleFormChange}
              error={formErrors.price}
              required
              min="0"
              placeholder="0.00"
            />
          </div>

          <Input
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={handleFormChange}
            min="0"
            placeholder="10"
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} fullWidth>
              Add Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Item"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            error={formErrors.name}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600 transition-all hover:border-slate-300"
            />
          </div>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            error={formErrors.category}
            required
            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              error={formErrors.quantity}
              required
              min="0"
            />
            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleFormChange}
              error={formErrors.price}
              required
              min="0"
            />
          </div>

          <Input
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={handleFormChange}
            min="0"
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} fullWidth>
              Update Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Item"
      >
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete <strong className="text-slate-900">{selectedItem?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} fullWidth>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} fullWidth>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
