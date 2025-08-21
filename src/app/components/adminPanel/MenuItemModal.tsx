import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItem, categories, units } from '@/types/MenuItem';
import { MenuItemCard } from '../menu/MenuItemCard';
import { MenuItemForm } from './MenuItemForm';

interface MenuItemModalProps {
  isOpen: boolean;
  editingItem: MenuItem | null;
  defaultPosition: number;
  onClose: () => void;
  onSave: (formData: MenuItem) => Promise<void>;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  editingItem,
  defaultPosition,
  onClose,
  onSave
}) => {
  const t = useTranslations();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
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
    IsOutOfStock: false,
    ImageUrl: '',
    Category: 'food',
    Position: 0
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
    } else {
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
        IsOutOfStock: false,
        ImageUrl: '',
        Category: 'food',
        Position: defaultPosition
      });
    }
    setError('');
    setIsAnimating(false);
  }, [editingItem, defaultPosition]);

  // Handle animation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Trigger animation after component mounts
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      await onSave(formData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
      setError('');
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-40 p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-8 opacity-0 scale-95'
        }`}
        style={{ backgroundColor: '#1a1a1a' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingItem ? t('admin.modal.editTitle') : t('admin.modal.addTitle')}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="cursor-pointer p-2 rounded-lg transition-colors disabled:opacity-50" 
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
          <MenuItemForm
            formData={formData}
            onInputChange={handleInputChange}
            isSaving={isSaving}
            editingItem={editingItem}
          />

          {/* Preview */}
          {formData.NameEn && (
            <div>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#cccccc' }}>
                {t('admin.form.preview')}
              </h3>
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
              className="cursor-pointer flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40"
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
              onClick={handleClose}
              disabled={isSaving}
              className="cursor-pointer px-6 py-3 text-white font-medium rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};