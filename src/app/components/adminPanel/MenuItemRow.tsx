import React, { useState } from 'react';
import { Edit, Trash2, ArrowUp, ArrowDown, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItem } from '@/types/MenuItem';
import { MenuItemCard } from '../menu/MenuItemCard';
import { CustomToggle } from '../ui/CustomToggle';
import { getCurrentLocale } from '@/utils/language';

interface MenuItemRowProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleOutOfStock: (item: MenuItem) => void;
  onUpdatePosition: (item: MenuItem, newPosition: number) => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleOutOfStock,
  onUpdatePosition
}) => {
  const t = useTranslations();
  const currentLocale = getCurrentLocale();
  const isEnglish = currentLocale === 'en';
  const [isEditingPosition, setIsEditingPosition] = useState(false);
  const [tempPosition, setTempPosition] = useState(item.Position.toString());

  const handlePositionEdit = () => {
    setTempPosition(item.Position.toString());
    setIsEditingPosition(true);
  };

  const handlePositionSave = () => {
    const newPosition = parseInt(tempPosition);
    if (!isNaN(newPosition) && newPosition > 0 && newPosition !== item.Position) {
      onUpdatePosition(item, newPosition);
    }
    setIsEditingPosition(false);
  };

  const handlePositionCancel = () => {
    setTempPosition(item.Position.toString());
    setIsEditingPosition(false);
  };

  const handlePositionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePositionSave();
    } else if (e.key === 'Escape') {
      handlePositionCancel();
    }
  };

  const movePosition = (direction: 'up' | 'down') => {
    const newPosition = direction === 'up' ? item.Position - 1 : item.Position + 1;
    if (newPosition > 0) {
      onUpdatePosition(item, newPosition);
    }
  };

  const handleDeleteClick = () => {
    onDelete(item);
  };

  return (
    <>
      {/* Action buttons container */}
      <div className="p-3 rounded-xl" style={{ backgroundColor: '#0f0f0f' }}>
        {/* Desktop layout - single row */}
        <div className="hidden sm:flex sm:justify-between sm:items-center">
          {/* Main item info */}
          <div className="flex items-center space-x-2">
            {/* Position display/editor */}
            <button
              onClick={handlePositionEdit}
              className="cursor-pointer flex items-center space-x-1 text-white hover:text-yellow-400"
            >
              <div className="flex items-center space-x-1">
                <Hash className="w-4 h-4" style={{ marginRight: 1 }} />
                {isEditingPosition ? (
                  <input
                    type="number"
                    value={tempPosition}
                    onChange={(e) => setTempPosition(e.target.value)}
                    onBlur={handlePositionSave}
                    onKeyDown={handlePositionKeyPress}
                    className="w-12 p-2 text-sm text-white bg-[#1a1a1a] rounded-lg focus:outline-none"
                    min="1"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium transition-colors">{item.Position}</span>
                )}
              </div>
            </button>
            <span className="text-sm" style={{ color: '#888888' }}>•</span>

            <span className={`text-sm font-medium text-white truncate ${isEditingPosition ? 'sm:w-44' : 'sm:w-48'} overflow-hidden`} title={isEnglish ? item.NameEn : item.NameUk}>
              {isEnglish ? item.NameEn : item.NameUk}
            </span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Position Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => movePosition('up')}
                disabled={item.Position <= 1}
                className="cursor-pointer p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-5.5 h-5.5 text-yellow-400" />
              </button>
              <button
                onClick={() => movePosition('down')}
                className="cursor-pointer p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-5.5 h-5.5 text-yellow-400" />
              </button>
            </div>
            
            {/* Out of Stock Toggle */}
            <div className="flex items-center space-x-2">
              <CustomToggle
                checked={!item.IsOutOfStock}
                onChange={() => onToggleOutOfStock(item)}
                label=""
                disabled={false}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all text-sm duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>{t('admin.actions.editItem')}</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg transition-all text-sm duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('admin.actions.delete')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile layout - two rows */}
        <div className="sm:hidden space-y-3">
          {/* First row: Main item info and Position Controls */}
          <div className="flex items-center justify-between">
            {/* Main item info */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {/* Position display/editor */}
              <button
                onClick={handlePositionEdit}
                className="cursor-pointer flex items-center space-x-1 text-white hover:text-yellow-400 flex-shrink-0"
              >
                <div className="flex items-center space-x-1">
                  <Hash className="w-4 h-4" style={{ marginRight: 1 }} />
                  {isEditingPosition ? (
                    <input
                      type="number"
                      value={tempPosition}
                      onChange={(e) => setTempPosition(e.target.value)}
                      onBlur={handlePositionSave}
                      onKeyDown={handlePositionKeyPress}
                      className="w-12 p-2 text-sm text-white bg-[#1a1a1a] rounded-lg focus:outline-none"
                      min="1"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium transition-colors">{item.Position}</span>
                  )}
                </div>
              </button>
              <span className="text-sm flex-shrink-0" style={{ color: '#888888' }}>•</span>

              <span className="text-sm font-medium text-white truncate flex-1 min-w-0" title={isEnglish ? item.NameEn : item.NameUk}>
                {isEnglish ? item.NameEn : item.NameUk}
              </span>
            </div>

            {/* Position Controls */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => movePosition('up')}
                disabled={item.Position <= 1}
                className="cursor-pointer p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-5.5 h-5.5 text-yellow-400" />
              </button>
              <button
                onClick={() => movePosition('down')}
                className="cursor-pointer p-1 rounded bg-[#1e1e1e] hover:bg-[#282828] transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-5.5 h-5.5 text-yellow-400" />
              </button>
            </div>
          </div>

          {/* Second row: Out of Stock Toggle and Action Buttons */}
          <div className="flex items-center justify-between">
            {/* Out of Stock Toggle */}
            <div className="flex items-center space-x-2">
              <CustomToggle
                checked={!item.IsOutOfStock}
                onChange={() => onToggleOutOfStock(item)}
                label=""
                disabled={false}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-all text-sm duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>{t('admin.actions.editItem')}</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg transition-all text-sm duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('admin.actions.delete')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu item card */}
      <MenuItemCard item={item} />
    </>
  );
};