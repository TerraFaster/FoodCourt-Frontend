import React from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem, categories, units } from '@/types/MenuItem';
import { CustomToggle } from '../ui/CustomToggle';
import { Dropdown } from '../ui/Dropdown';
import { ImageUploadField } from './ImageUploadField';

interface MenuItemFormProps {
  formData: MenuItem;
  onInputChange: (field: keyof MenuItem, value: any) => void;
  isSaving: boolean;
  editingItem: MenuItem | null;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  formData,
  onInputChange,
  isSaving,
  editingItem
}) => {
  const t = useTranslations();

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

  // Helper function to handle number input changes
  const handleNumberChange = (value: string, field: keyof MenuItem, isFloat = false) => {
    if (value === '') {
      // Allow empty string for clearing the field
      onInputChange(field, '');
    } else {
      const numValue = isFloat ? parseFloat(value) : parseInt(value);
      onInputChange(field, isNaN(numValue) ? '' : numValue);
    }
  };

  return (
    <>
      {/* Name Fields - English and Ukrainian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
            {t('admin.form.fields.nameEn')} *
          </label>
          <input
            type="text"
            value={formData.NameEn}
            onChange={(e) => onInputChange('NameEn', e.target.value)}
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
            onChange={(e) => onInputChange('NameUk', e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#111111', borderColor: '#333333' }}
            placeholder={t('admin.form.placeholders.nameUk')}
          />
        </div>
      </div>

      {/* Category and Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
            {t('admin.form.fields.category')} *
          </label>
          <Dropdown
            options={categoryOptions}
            value={formData.Category}
            onChange={(value) => onInputChange('Category', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
            {t('admin.form.fields.position')} *
          </label>
          <input
            type="number"
            value={formData.Position}
            onChange={(e) => handleNumberChange(e.target.value, 'Position')}
            disabled={isSaving}
            className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#111111', borderColor: '#333333' }}
            min="1"
            placeholder="Position in menu"
          />
        </div>
      </div>

      {/* Description Fields - English and Ukrainian */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
            {t('admin.form.fields.descriptionEn')}
          </label>
          <textarea
            value={formData.DescriptionEn}
            onChange={(e) => onInputChange('DescriptionEn', e.target.value)}
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
            onChange={(e) => onInputChange('DescriptionUk', e.target.value)}
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
            onChange={(e) => handleNumberChange(e.target.value, 'Amount')}
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
            onChange={(value) => onInputChange('Unit', value)}
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
            onChange={(e) => handleNumberChange(e.target.value, 'Price', true)}
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
            onChange={(e) => {
              if (e.target.value === '') {
                onInputChange('PromoPrice', null);
              } else {
                const numValue = parseFloat(e.target.value);
                onInputChange('PromoPrice', isNaN(numValue) ? null : numValue);
              }
            }}
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
            onChange={(e) => handleNumberChange(e.target.value, 'TimeToCook')}
            disabled={isSaving}
            className="w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#111111', borderColor: '#333333' }}
            min="0"
          />
        </div>
      </div>

      {/* Image Upload with Drag & Drop */}
      <ImageUploadField
        imageUrl={formData.ImageUrl}
        onImageChange={(url) => onInputChange('ImageUrl', url)}
        isSaving={isSaving}
        editingItem={editingItem}
      />

      {/* Toggles Section */}
      <div>
        <label className="block text-sm font-medium mb-4" style={{ color: '#cccccc' }}>
          {t('admin.form.options.title')}
        </label>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 p-4 rounded-lg" style={{ backgroundColor: '#111111' }}>
          <CustomToggle
            checked={formData.IsNew}
            onChange={(checked) => onInputChange('IsNew', checked)}
            label={t('admin.form.options.markAsNew')}
            disabled={isSaving}
          />
          <CustomToggle
            checked={formData.IsPromo}
            onChange={(checked) => onInputChange('IsPromo', checked)}
            label={t('admin.form.options.recommended')}
            disabled={isSaving}
          />
          <CustomToggle
            checked={formData.IsOutOfStock}
            onChange={(checked) => onInputChange('IsOutOfStock', checked)}
            label={t('admin.form.options.outOfStock')}
            disabled={isSaving}
          />
        </div>
      </div>
    </>
  );
};