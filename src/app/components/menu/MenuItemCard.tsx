'use client';

import { Clock, Weight, ThumbsUp, AlertCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';

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

export function MenuItemCard({ item }: { item: MenuItem }) {
  const t = useTranslations();
  const { getCurrentLocale, isHydrated } = useSettingsStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get current locale and determine which language fields to use
  const currentLocale = getCurrentLocale();
  const isEnglish = currentLocale === 'en';
  
  // Use appropriate language fields based on current locale
  const displayName = isEnglish ? item.NameEn : item.NameUk;
  const displayDescription = isEnglish ? item.DescriptionEn : item.DescriptionUk;

  const weightUnit = item.Unit === 'g' ? t('menuItem.units.grams') 
    : item.Unit === 'ml' ? t('menuItem.units.milliliters') 
    : t('menuItem.units.pieces');

  const openPopup = () => {
    setIsPopupOpen(true);
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const closePopup = () => {
    setIsAnimating(false);
    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 300);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPopupOpen) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  // Show a loading state if store hasn't hydrated yet
  if (!isHydrated) {
    return (
      <div className="relative rounded-xl overflow-hidden transition-all duration-300 min-h-50 bg-dark-bg">
        <div className="flex h-full">
          <div className="flex-1 p-4 pr-2 flex flex-col justify-between">
            <div className="mb-2">
              <div className="h-6 bg-dark-bg-hover rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-dark-bg-hover rounded w-1/4"></div>
            </div>
            <div className="h-12 bg-dark-bg-hover rounded mb-3 w-3/4"></div>
            <div className="flex space-x-3">
              <div className="h-4 bg-dark-bg-hover rounded w-16"></div>
              <div className="h-4 bg-dark-bg-hover rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Card */}
      <div 
        className="group relative rounded-xl overflow-hidden transition-all duration-300 min-h-50 cursor-pointer bg-dark-bg hover:bg-dark-bg-hover" 
        onClick={openPopup}
      >
        <div className="flex h-full">
          {/* Left content area */}
          <div className={`flex-1 p-4 pr-2 flex flex-col justify-between transition-all duration-300 ${item.ImageUrl ? 'mr-28 md:mr-40 md:group-hover:mr-50' : ''}`}>
            {/* Top section with name and price */}
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white leading-tight font-menu-item">{displayName}</h3>
                <span className="text-sm invisible sm:visible" style={{ color: '#888888' }}>•</span>
                <span className="text-xs px-2 py-1 rounded-full mb-auto ml-auto sm:m-0" style={{ 
                  backgroundColor: '#333333', 
                  color: '#cccccc' 
                }}>
                  {t(`categories.${item.Category}`)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.PromoPrice ? (
                  <>
                    <span className="text-l font-bold line-through" style={{ color: '#888888' }}>{item.Price} ₴</span>
                    <span className="text-xl font-bold text-yellow-400">{item.PromoPrice} ₴</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-yellow-400">{item.Price} ₴</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            {displayDescription && (
              <p className="text-[0.925rem] leading-relaxed mb-3 line-clamp-2 font-menu-item" style={{ color: '#cccccc' }}>
                {displayDescription}
              </p>
            )}
            
            {/* Bottom info */}
            <div className="flex items-center flex-wrap gap-3 text-sm mt-auto" style={{ color: '#888888' }}>
              <div className="flex items-center space-x-1">
                <Weight className="w-3 h-3" />
                <span>{item.Amount}{weightUnit}</span>
              </div>
              
              {item.TimeToCook > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.TimeToCook}{t('menuItem.units.minutes')}</span>
                </div>
              )}
              
              <div className="flex flex-wrap items-center space-x-4">
                {item.IsNew && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-yellow-500"/>
                    <span className="text-m font-medium text-yellow-500">
                      {t('menuItem.badges.new')}
                    </span>
                  </div>
                )}
                
                {item.IsPromo && (
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-yellow-500"/>
                    <span className="text-m font-medium text-yellow-500">
                      {t('menuItem.badges.recommended')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right image area */}
          {item.ImageUrl && (
            <div className="absolute top-0 right-0 w-28 md:w-40 md:group-hover:w-50 transition-all duration-300 h-full rounded-r-2xl overflow-hidden">
              <img
                src={item.ImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div 
          className={`fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closePopup}
        >
          <div 
            className={`rounded-3xl max-w-md sm:max-w-lg md:max-w-l w-full max-h-[90vh] overflow-hidden relative transform transition-all duration-300 ease-out ${
              isAnimating 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-8 opacity-0 scale-95'
            }`}
            style={{ backgroundColor: '#1a1a1a' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 cursor-pointer backdrop-blur-sm bg-white/30 hover:bg-white/40 rounded-full p-3.5 transition-all duration-200 shadow-lg backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image at the top */}
            {item.ImageUrl && (
              <div className="w-full h-80 overflow-hidden">
                <img
                  src={item.ImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Name and price */}
              <div className="mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-2xl font-bold text-white leading-tight font-menu-item">{displayName}</h3>
                  <span className="text-xl px-4 py-1 rounded-full mb-auto ml-auto" style={{ 
                    backgroundColor: '#333333', 
                    color: '#cccccc' 
                  }}>
                    {t(`categories.${item.Category}`)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.PromoPrice ? (
                    <>
                      <span className="text-lg font-bold line-through" style={{ color: '#888888' }}>{item.Price} ₴</span>
                      <span className="text-2xl font-bold text-yellow-400">{item.PromoPrice} ₴</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-yellow-400">{item.Price} ₴</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {displayDescription && (
                <p className="leading-relaxed mb-4 font-menu-item" style={{ color: '#cccccc' }}>
                  {displayDescription}
                </p>
              )}

              {/* Details */}
              <div className="flex items-center flex-wrap gap-4 text-sm mb-4" style={{ color: '#888888' }}>
                <div className="flex items-center space-x-1">
                  <Weight className="w-4 h-4" />
                  <span>{item.Amount}{weightUnit}</span>
                </div>
                
                {item.TimeToCook > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.TimeToCook}{t('menuItem.units.minutes')}</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {item.IsNew && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-yellow-500"/>
                    <span className="text-sm font-medium text-yellow-500">
                      {t('menuItem.badges.new')}
                    </span>
                  </div>
                )}
                
                {item.IsPromo && (
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-yellow-500"/>
                    <span className="text-sm font-medium text-yellow-500">
                      {t('menuItem.badges.recommended')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}