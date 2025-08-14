'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Header } from './components/layout/Header';
import { MenuItemCard } from './components/menu/MenuItemCard';
import { Footer } from './components/layout/Footer';
import { MenuFooter } from './components/menu/MenuFooter';
import { apiClient } from '../lib/apiClient';

// Transform API response to match existing component structure
interface TransformedMenuItem {
  Id: number;
  NameEn: string;
  NameUk: string;
  DescriptionEn: string;
  DescriptionUk: string;
  Unit: string;
  Amount: number;
  TimeToCook: number;
  Price: number;
  PromoPrice: number | null;
  IsNew: boolean;
  IsPromo: boolean;
  ImageUrl?: string;
  Category: string;
}

export default function RestaurantSite() {
  const t = useTranslations();
  const locale = useLocale();
  const [menuItems, setMenuItems] = useState<TransformedMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch menu items from the public API
      const publicMenuItems = await apiClient.getPublicMenuItems(locale);
      
      // Transform the API response to match the existing component structure
      // Since the public API doesn't return separate language fields, we'll use
      // the current language values for both En and Uk fields
      const transformedItems: TransformedMenuItem[] = publicMenuItems.map((item, index) => ({
        Id: index + 1, // Generate ID since public API doesn't return it
        NameEn: item.name,
        NameUk: item.name,
        DescriptionEn: item.description,
        DescriptionUk: item.description,
        Unit: item.unit,
        Amount: item.amount,
        TimeToCook: item.timeToCook,
        Price: item.price,
        PromoPrice: item.promoPrice ?? null,
        IsNew: item.isNew,
        IsPromo: item.isPromo,
        ImageUrl: item.imageUrl,
        Category: item.category
      }));

      setMenuItems(transformedItems);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
      setError(err instanceof Error ? err.message : t('menu.errors.load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [locale]);

  if (loading) {
    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: '#111111' }}>
        <Header></Header>
        <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 font-menu-item">{t('menu.title')}</h2>
            <p className="text-sm sm:text-lg font-menu-item" style={{ color: '#888888' }}>{t('menu.subtitle')}</p>
          </div>
          
          <div className="rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">{t('menu.loading')}</p>
                <p className="text-gray-400 text-sm mt-2">{t('menu.loadingDescription')}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer InnerComponent={MenuFooter}></Footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: '#111111' }}>
        <Header></Header>
        <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 font-menu-item">{t('menu.title')}</h2>
            <p className="text-sm sm:text-lg font-menu-item" style={{ color: '#888888' }}>{t('menu.subtitle')}</p>
          </div>
          
          <div className="rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <h3 className="text-white text-lg mb-2">{t('menu.errorTitle')}</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchMenuItems}
                  className="px-4 py-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors"
                >
                  {t('menu.actions.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer InnerComponent={MenuFooter}></Footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#111111' }}>
      <Header></Header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 font-menu-item">{t('menu.title')}</h2>
          <p className="text-sm sm:text-lg font-menu-item" style={{ color: '#888888' }}>{t('menu.subtitle')}</p>
        </div>

        {/* Menu Items List */}
        <div className="rounded-3xl p-3 sm:p-4" style={{ backgroundColor: '#1a1a1a' }}>
          {menuItems.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <h3 className="text-white text-lg mb-2">{t('menu.empty.title')}</h3>
                <p className="text-gray-400">{t('menu.empty.description')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {menuItems.map((item, index) => (
                <div key={item.Id}>
                  <MenuItemCard item={item} />
                  {index < menuItems.length - 1 && (
                    <div className="my-2 sm:my-3 border-t border-dashed" style={{ borderColor: '#333333' }}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer InnerComponent={MenuFooter}></Footer>
    </div>
  );
}