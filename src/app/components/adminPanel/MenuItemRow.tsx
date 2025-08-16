import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MenuItem } from '@/types/MenuItem';
import { MenuItemCard } from '../menu/MenuItemCard';
import { CustomToggle } from '../ui/CustomToggle';
import { getCurrentLocale } from '@/lib/locale/client';

interface MenuItemRowProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: number) => void;
  onToggleOutOfStock: (item: MenuItem) => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleOutOfStock
}) => {
  const t = useTranslations();
  const currentLocale = getCurrentLocale();
  const isEnglish = currentLocale === 'en';

  return (
    <>
      {/* Action buttons container */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-xl space-y-3 sm:space-y-0" style={{ backgroundColor: '#0f0f0f' }}>
        {/* Main item info */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-white">#{item.Id}</span>
          <span className="text-sm" style={{ color: '#888888' }}>•</span>
          <span className="text-sm font-medium text-white truncate max-w-xs">
            {isEnglish ? item.NameEn : item.NameUk}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-3 sm:justify-end">
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
              onClick={() => onDelete(item.Id)}
              className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg transition-all text-sm duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('admin.actions.delete')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu item card */}
      <MenuItemCard item={item} />
    </>
  );
};