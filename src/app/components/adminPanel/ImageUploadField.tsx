import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItem } from '@/types/MenuItem';
import { apiClient, ApiError } from '@/lib/apiClient';
import { apiConfig } from '@/config/api';

interface ImageUploadFieldProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  isSaving: boolean;
  editingItem: MenuItem | null;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imageUrl,
  onImageChange,
  isSaving,
  editingItem
}) => {
  const t = useTranslations();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      setError('');
      const response = await apiClient.uploadMenuItemImage(file);
      
      // Add API base URL to the response URL if it's a relative path
      const fullImageUrl = response.url.startsWith('http') 
        ? response.url 
        : `${apiConfig.baseURL}${response.url.startsWith('/') ? response.url : `/${response.url}`}`;
      
      onImageChange(fullImageUrl);
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

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Handle file drops
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await handleImageUpload(file);
      }
      return;
    }

    // Handle URL drops
    const droppedText = e.dataTransfer.getData('text/plain');
    if (droppedText) {
      // Check if it's a URL
      try {
        const url = new URL(droppedText);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          onImageChange(droppedText);
        }
      } catch {
        // Not a valid URL, ignore
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#cccccc' }}>
        {t('admin.form.fields.imageUrl')}
      </label>
      
      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
      
      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onClick={handleDropZoneClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mb-3 p-6 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
          dragActive 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-600/5'
        }`}
      >
        {imageUrl ? (
          // Show current image in drop zone
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                // If image fails to load, show default drop zone content
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">{t("admin.form.imageUpload.clickToChange")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange('');
              }}
              className="cursor-pointer absolute top-2 right-2 w-10 h-10 backdrop-blur-sm bg-red-600/30 hover:bg-red-800/40 text-white rounded-full flex items-center justify-center text-xs transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        ) : (
          // Default drop zone content
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-400 mb-1">
              {t("admin.form.imageUpload.dragAndDrop")}
            </p>
            <p className="text-xs text-gray-500">
              {t("admin.form.imageUpload.supportedFormats")}
            </p>
          </div>
        )}
      </div>

      {/* URL Input and Upload Button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={imageUrl || ''}
          onChange={(e) => onImageChange(e.target.value)}
          disabled={isSaving}
          className="flex-1 px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#111111', borderColor: '#333333' }}
          placeholder={t('admin.form.placeholders.imageUrl')}
        />
        <button 
          type="button"
          onClick={handleImageUploadClick}
          disabled={isSaving || uploadingImage}
          className="cursor-pointer px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" 
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
      </div>
    </div>
  );
};