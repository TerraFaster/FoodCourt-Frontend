'use client'

import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MenuItemList } from '../components/adminPanel/MenuItemList';
import { MenuItemModal } from '../components/adminPanel/MenuItemModal';
import { apiClient, ApiError } from '../../lib/apiClient';
import { MenuItem } from '../../types/MenuItem';
import { convertFromApiResponse, convertToApiRequest } from '@/utils/converters';

export default function AdminMenuPanel() {
  const t = useTranslations();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState('');

  // Load menu items from API
  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const apiItems = await apiClient.getAllMenuItems();
      const convertedItems = apiItems.map(convertFromApiResponse);
      setMenuItems(convertedItems);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load menu items');
      console.error('Failed to load menu items:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  // Quick toggle for out of stock status
  const toggleOutOfStock = async (item: MenuItem) => {
    try {
      const updatedItem = { ...item, IsOutOfStock: !item.IsOutOfStock };
      const apiRequest = convertToApiRequest(updatedItem);
      await apiClient.updateMenuItem(item.Id, apiRequest);
      
      setMenuItems(prev => prev.map(menuItem => 
        menuItem.Id === item.Id ? updatedItem : menuItem
      ));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update out of stock status');
      console.error('Failed to update out of stock status:', apiError);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError('');
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) {
      return;
    }

    try {
      await apiClient.deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.Id !== itemId));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete menu item');
      console.error('Failed to delete menu item:', apiError);
    }
  };

  const handleSaveItem = async (formData: MenuItem) => {
    try {
      const apiRequest = convertToApiRequest(formData);
      
      if (editingItem) {
        // Update existing item
        await apiClient.updateMenuItem(editingItem.Id, apiRequest);
        setMenuItems(prev => prev.map(item => 
          item.Id === editingItem.Id ? formData : item
        ));
      } else {
        // Add new item
        const newItem = await apiClient.createMenuItem(apiRequest);
        const convertedItem = convertFromApiResponse(newItem);
        setMenuItems(prev => [...prev, convertedItem]);
      }
      
      closeModal();
    } catch (err) {
      const apiError = err as ApiError;
      throw new Error(apiError.message || 'Failed to save menu item');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: '#111111' }}>
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-lg">{t('admin.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111111' }}>
      <Header />

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6">
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 sm:w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-[IgraSans]">{t('admin.menuManagement')}</h1>
          <button
            onClick={loadMenuItems}
            disabled={isLoading}
            className="flex items-center cursor-pointer space-x-2 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('admin.actions.refresh')}</span>
          </button>
        </div>

        <MenuItemList
          menuItems={menuItems}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggleOutOfStock={toggleOutOfStock}
          onAddNew={openAddModal}
        />
      </main>

      {/* Modal */}
      {isModalOpen && (
        <MenuItemModal
          isOpen={isModalOpen}
          editingItem={editingItem}
          onClose={closeModal}
          onSave={handleSaveItem}
        />
      )}

      <Footer />
    </div>
  );
}