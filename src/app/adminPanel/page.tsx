'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Edit, Plus, X, Save, Trash2, Upload, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CustomToggle } from '../components/ui/CustomToggle';
import { Dropdown } from '../components/ui/Dropdown';
import { apiClient, MenuItemResponse, MenuItemRequest, ApiError } from '../../lib/apiClient';
import { getCurrentLocale } from '../../utils/language';
import { apiConfig } from '../../config/api';

interface MenuItem {
  Id: number;
  NameEn: string;
  NameUk: string;
  DescriptionEn: string;
  DescriptionUk: string;
  Unit: string;
  Amount: number;
  TimeToCook: number;
  Price: number;
  PromoPrice?: number | null;
  IsNew: boolean;
  IsPromo: boolean;
  ImageUrl?: string;
  Category: string;
}

const categories = ['food', 'drinks', 'desserts'];
const units = ['g', 'ml', 'pcs'];

export default function AdminMenuPanel() {
  const t = useTranslations();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<MenuItem>({
    Id: 0,
    NameEn: '',
    NameUk: '',
    DescriptionEn: '',
    DescriptionUk: '',
    Unit: 'g',
    Amount: 0,
    TimeToCook: 0,
    Price: 0,
    PromoPrice: null,
    IsNew: false,
    IsPromo: false,
    ImageUrl: '',
    Category: 'food'
  });

  // Convert API response to local format
  const convertFromApiResponse = (apiItem: MenuItemResponse): MenuItem => ({
    Id: apiItem.id,
    NameEn: apiItem.nameEn,
    NameUk: apiItem.nameUk,
    DescriptionEn: apiItem.descriptionEn,
    DescriptionUk: apiItem.descriptionUk,
    Unit: apiItem.unit,
    Amount: apiItem.amount,
    TimeToCook: apiItem.timeToCook,
    Price: apiItem.price,
    PromoPrice: apiItem.promoPrice,
    IsNew: apiItem.isNew,
    IsPromo: apiItem.isPromo,
    ImageUrl: apiItem.imageUrl,
    Category: apiItem.category
  });

  // Convert local format to API request
  const convertToApiRequest = (item: MenuItem): MenuItemRequest => ({
    id: item.Id !== 0 ? item.Id : undefined,
    nameEn: item.NameEn,
    nameUk: item.NameUk,
    descriptionEn: item.DescriptionEn,
    descriptionUk: item.DescriptionUk,
    unit: item.Unit,
    amount: item.Amount,
    timeToCook: item.TimeToCook,
    price: item.Price,
    promoPrice: item.PromoPrice,
    isNew: item.IsNew,
    isPromo: item.IsPromo,
    imageUrl: item.ImageUrl,
    category: item.Category
  });

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

  // Prepare dropdown options
  const categoryOptions = categories.map(cat => ({
    value: cat,
    label: t(`categories.${cat}`)
  }));

  const unitOptions = units.map(unit => ({
    value: unit,
    label: unit === 'g' ? t('menuItem.units.grams') 
           : unit === 'ml' ? t('menuItem.units.milliliters') 
           : t('menuItem.units.pieces')
  }));

  // Get current locale and determine which language fields to use
  const currentLocale = getCurrentLocale();
  const isEnglish = currentLocale === 'en';

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      Id: 0,
      NameEn: '',
      NameUk: '',
      DescriptionEn: '',
      DescriptionUk: '',
      Unit: 'g',
      Amount: 0,
      TimeToCook: 0,
      Price: 0,
      PromoPrice: null,
      IsNew: false,
      IsPromo: false,
      ImageUrl: '',
      Category: 'food'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError('');
  };

  const handleInputChange = (field: keyof MenuItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');

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
      setError(apiError.message || 'Failed to save menu item');
      console.error('Failed to save menu item:', apiError);
    } finally {
      setIsSaving(false);
    }
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

  const handleImageUpload = async (file: File) => {
    if (!editingItem) return;
    
    try {
      setUploadingImage(true);
      const response = await apiClient.uploadMenuItemImage(editingItem.Id, file);
      
      // Add API base URL to the response URL if it's a relative path
      const fullImageUrl = response.imageUrl.startsWith('http') 
        ? response.imageUrl 
        : `${apiConfig.baseURL}${response.imageUrl.startsWith('/') ? response.imageUrl : `/${response.imageUrl}`}`;
      
      // Update form data with new image URL
      handleInputChange('ImageUrl', fullImageUrl);
      
      // Update the item in the list
      setMenuItems(prev => prev.map(item => 
        item.Id === editingItem.Id 
          ? { ...item, ImageUrl: fullImageUrl }
          : item
      ));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to upload image');
      console.error('Failed to upload image:', apiError);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
    <div className="min-h-screen text-white" style={{ backgroundColor: '#111111' }}>
      <Header></Header>

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
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t('admin.menuManagement')}</h1>
          <button
            onClick={loadMenuItems}
            disabled={isLoading}
            className="flex items-center cursor-pointer space-x-2 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('admin.actions.refresh')}</span>
          </button>
        </div>

        <div className="rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="space-y-0">
            {menuItems.map((item, index) => (
              <div key={item.Id} className="space-y-3">
                {/* Action buttons container */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-xl space-y-3 sm:space-y-0" style={{ backgroundColor: '#0f0f0f' }}>
                  {/* Main item info */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">#{item.Id}</span>
                    <span className="text-sm" style={{ color: '#888888' }}>•</span>
                    <span className="text-sm font-medium text-white truncate max-w-xs">{isEnglish ? item.NameEn : item.NameUk}</span>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex items-center space-x-2 sm:justify-end">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all text-sm duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{t('admin.actions.editItem')}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.Id)}
                      className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg transition-all text-sm duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t('admin.actions.delete')}</span>
                    </button>
                  </div>
                </div>

                {/* Menu item card */}
                <MenuItemCard item={item} />
                
                {index < menuItems.length - 1 && (
                  <div className="my-4 border-t border-dashed" style={{ borderColor: '#333333' }}></div>
                )}
              </div>
            ))}
            
            {/* Add New Item Button */}
            {menuItems.length > 0 && (
              <div className="my-4 border-t border-dashed" style={{ borderColor: '#333333' }}></div>
            )}
            <button
              onClick={openAddModal}
              className="w-full p-6 sm:p-8 border-2 border-dashed hover:border-yellow-400 transition-colors rounded-lg group"
              style={{ borderColor: '#333333' }}
            >
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div className="p-3 rounded-full group-hover:bg-yellow-400 transition-all duration-200" style={{ backgroundColor: '#333333' }}>
                  <Plus className="w-6 h-6 text-yellow-400 group-hover:text-black transition-all duration-200" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">{t('admin.actions.addNewItem')}</p>
                  <p className="text-sm" style={{ color: '#888888' }}>{t('admin.addNewItemDescription')}</p>
                </div>
              </div>
            </button>

            {/* Empty state */}
            {menuItems.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-lg text-white mb-2">{t('admin.empty.title')}</p>
                <p className="text-sm" style={{ color: '#888888' }}>{t('admin.empty.description')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingItem ? t('admin.modal.editTitle') : t('admin.modal.addTitle')}
              </h2>
              <button
                onClick={closeModal}
                disabled={isSaving}
                className="p-2 rounded-lg transition-colors disabled:opacity-50" 
                style={{ backgroundColor: '#333333' }}
                onMouseEnter={(e) => !isSaving && ((e.target as HTMLButtonElement).style.backgroundColor = '#444444')}
                onMouseLeave={(e) => !isSaving && ((e.target as HTMLButtonElement).style.backgroundColor = '#333333')}
              >
                <X className="w-6 h-6" style={{ color: '#888888' }} />
              </button>
            </div>

            {/* Modal Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Fields - English and Ukrainian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.nameEn')} *
                  </label>
                  <input
                    type="text"
                    value={formData.NameEn}
                    onChange={(e) => handleInputChange('NameEn', e.target.value)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    placeholder={t('admin.form.placeholders.nameEn')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.nameUk')} *
                  </label>
                  <input
                    type="text"
                    value={formData.NameUk}
                    onChange={(e) => handleInputChange('NameUk', e.target.value)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    placeholder={t('admin.form.placeholders.nameUk')}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                  {t('admin.form.fields.category')} *
                </label>
                <Dropdown
                  options={categoryOptions}
                  value={formData.Category}
                  onChange={(value) => handleInputChange('Category', value)}
                />
              </div>

              {/* Description Fields - English and Ukrainian */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.descriptionEn')}
                  </label>
                  <textarea
                    value={formData.DescriptionEn}
                    onChange={(e) => handleInputChange('DescriptionEn', e.target.value)}
                    disabled={isSaving}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    placeholder={t('admin.form.placeholders.descriptionEn')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.descriptionUk')}
                  </label>
                  <textarea
                    value={formData.DescriptionUk}
                    onChange={(e) => handleInputChange('DescriptionUk', e.target.value)}
                    disabled={isSaving}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    placeholder={t('admin.form.placeholders.descriptionUk')}
                  />
                </div>
              </div>

              {/* Amount and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.amount')} *
                  </label>
                  <input
                    type="number"
                    value={formData.Amount}
                    onChange={(e) => handleInputChange('Amount', parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.unit')} *
                  </label>
                  <Dropdown
                    options={unitOptions}
                    value={formData.Unit}
                    onChange={(value) => handleInputChange('Unit', value)}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.price')} *
                  </label>
                  <input
                    type="number"
                    value={formData.Price}
                    onChange={(e) => handleInputChange('Price', parseFloat(e.target.value) || 0)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.promoPrice')}
                  </label>
                  <input
                    type="number"
                    value={formData.PromoPrice || ''}
                    onChange={(e) => handleInputChange('PromoPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    min="0"
                    step="0.01"
                    placeholder={t('admin.form.placeholders.promoPrice')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                    {t('admin.form.fields.cookTime')}
                  </label>
                  <input
                    type="number"
                    value={formData.TimeToCook}
                    onChange={(e) => handleInputChange('TimeToCook', parseInt(e.target.value) || 0)}
                    disabled={isSaving}
                    className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    min="0"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
                  {t('admin.form.fields.imageUrl')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.ImageUrl || ''}
                    onChange={(e) => handleInputChange('ImageUrl', e.target.value)}
                    disabled={isSaving}
                    className="flex-1 px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#111111', borderColor: '#333333' }}
                    placeholder={t('admin.form.placeholders.imageUrl')}
                  />
                  {editingItem && (
                    <>
                      <button 
                        type="button"
                        onClick={handleImageUploadClick}
                        disabled={isSaving || uploadingImage}
                        className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
                        style={{ backgroundColor: '#333333' }}
                        onMouseEnter={(e) => !isSaving && !uploadingImage && ((e.target as HTMLButtonElement).style.backgroundColor = '#444444')}
                        onMouseLeave={(e) => !isSaving && !uploadingImage && ((e.target as HTMLButtonElement).style.backgroundColor = '#333333')}
                      >
                        {uploadingImage ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                {!editingItem && (
                  <p className="text-xs mt-1" style={{ color: '#888888' }}>
                    {t('admin.form.imageUploadAfterSave')}
                  </p>
                )}
              </div>

              {/* Toggles Section */}
              <div>
                <label className="block text-sm font-medium mb-4" style={{ color: '#cccccc' }}>
                  Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg" style={{ backgroundColor: '#111111' }}>
                  <CustomToggle
                    checked={formData.IsNew}
                    onChange={(checked) => handleInputChange('IsNew', checked)}
                    label={t('admin.form.options.markAsNew')}
                    disabled={isSaving}
                  />
                  <CustomToggle
                    checked={formData.IsPromo}
                    onChange={(checked) => handleInputChange('IsPromo', checked)}
                    label={t('admin.form.options.recommended')}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Preview */}
              {formData.NameEn && (
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: '#cccccc' }}>{t('admin.form.preview')}</h3>
                  <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#111111' }}>
                    <MenuItemCard item={formData} />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={!formData.NameEn.trim() || !formData.NameUk.trim() || isSaving}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{t('admin.form.saving')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingItem ? t('admin.actions.updateItem') : t('admin.actions.addItem')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-6 py-3 text-white font-medium rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#333333', borderColor: '#444444' }}
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#444444';
                      (e.target as HTMLButtonElement).style.borderColor = '#555555';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#333333';
                      (e.target as HTMLButtonElement).style.borderColor = '#444444';
                    }
                  }}
                >
                  {t('admin.actions.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer></Footer>
    </div>
  );
}