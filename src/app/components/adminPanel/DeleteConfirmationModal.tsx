import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItem } from '@/types/MenuItem';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  menuItem: MenuItem | null;
  onClose: () => void;
  onConfirm: (itemId: number) => Promise<void>;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  menuItem,
  onClose,
  onConfirm
}) => {
  const t = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

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
      if (e.key === 'Escape' && isOpen && !isDeleting) {
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
  }, [isOpen, isDeleting]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!menuItem) return;

    try {
      setIsDeleting(true);
      setError('');
      await onConfirm(menuItem.Id);
      // Close modal after successful deletion
      handleClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing during deletion
    
    setIsAnimating(false);
    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
      setError('');
      onClose();
    }, 300);
  };

  if (!isOpen || !menuItem) return null;

  // Get the display name based on locale or fallback
  const itemName = menuItem.NameEn || menuItem.NameUk || 'Unnamed Item';

  return (
    <div 
      className={`fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`rounded-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-8 opacity-0 scale-95'
        }`}
        style={{ backgroundColor: '#1a1a1a' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {t('admin.modal.deleteTitle')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="cursor-pointer p-2 rounded-lg transition-colors disabled:opacity-50" 
            style={{ backgroundColor: '#333333' }}
            onMouseEnter={(e) => !isDeleting && ((e.target as HTMLButtonElement).style.backgroundColor = '#444444')}
            onMouseLeave={(e) => !isDeleting && ((e.target as HTMLButtonElement).style.backgroundColor = '#333333')}
          >
            <X className="w-5 h-5" style={{ color: '#888888' }} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            {t('admin.modal.deleteConfirmation')}
          </p>
          
          {/* Item Info */}
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
            <div className="flex items-center space-x-3">
              {menuItem.ImageUrl && (
                <img 
                  src={menuItem.ImageUrl} 
                  alt={itemName}
                  className="w-16 h-12 object-cover rounded-lg"
                  style={{ aspectRatio: '4 / 3' }}
                />
              )}
              <div>
                <h3 className="font-medium text-white">{itemName}</h3>
              </div>
            </div>
          </div>
          
          <p className="text-red-400 text-sm mt-4 font-medium">
            {t('admin.modal.deleteWarning')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="cursor-pointer flex-1 px-4 py-3 text-white font-medium rounded-lg transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#333333', borderColor: '#444444' }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#444444';
                (e.target as HTMLButtonElement).style.borderColor = '#555555';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#333333';
                (e.target as HTMLButtonElement).style.borderColor = '#444444';
              }
            }}
          >
            {t('admin.actions.cancel')}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('admin.form.deleting')}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>{t('admin.actions.delete')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};