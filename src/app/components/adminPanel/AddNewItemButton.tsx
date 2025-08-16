import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddNewItemButtonProps {
  onClick: () => void;
}

export const AddNewItemButton: React.FC<AddNewItemButtonProps> = ({ onClick }) => {
  const t = useTranslations();

  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-full p-6 sm:p-8 border-2 border-dashed hover:border-yellow-400 transition-colors rounded-lg group"
      style={{ borderColor: '#333333' }}
    >
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <div className="p-3 rounded-full group-hover:bg-yellow-400 transition-all duration-200" style={{ backgroundColor: '#333333' }}>
          <Plus className="w-6 h-6 text-yellow-400 group-hover:text-black transition-all duration-200" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
            {t('admin.actions.addNewItem')}
          </p>
          <p className="text-sm" style={{ color: '#888888' }}>
            {t('admin.addNewItemDescription')}
          </p>
        </div>
      </div>
    </button>
  );
};