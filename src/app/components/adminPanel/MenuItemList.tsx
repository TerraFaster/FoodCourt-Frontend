import React from 'react';
import { useTranslations } from 'next-intl';
import { MenuItem } from '@/types/MenuItem';
import { MenuItemRow } from './MenuItemRow';
import { AddNewItemButton } from './AddNewItemButton';

interface MenuItemListProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: number) => void;
  onToggleOutOfStock: (item: MenuItem) => void;
  onAddNew: () => void;
}

export const MenuItemList: React.FC<MenuItemListProps> = ({
  menuItems,
  onEdit,
  onDelete,
  onToggleOutOfStock,
  onAddNew
}) => {
  const t = useTranslations();

  return (
    <div className="rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="space-y-0">
        {menuItems.map((item, index) => (
          <div key={item.Id} className="space-y-3">
            <MenuItemRow
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleOutOfStock={onToggleOutOfStock}
            />
            
            {index < menuItems.length - 1 && (
              <div className="my-4 border-t border-dashed" style={{ borderColor: '#333333' }}></div>
            )}
          </div>
        ))}
        
        {/* Add New Item Button */}
        {menuItems.length > 0 && (
          <div className="my-4 border-t border-dashed" style={{ borderColor: '#333333' }}></div>
        )}
        
        <AddNewItemButton onClick={onAddNew} />

        {/* Empty state */}
        {menuItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-white mb-2">{t('admin.empty.title')}</p>
            <p className="text-sm" style={{ color: '#888888' }}>{t('admin.empty.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
};