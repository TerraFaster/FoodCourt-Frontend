'use client';

import { ChevronDown, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '../../store/settingsStore';

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { language, setLanguage } = useSettingsStore();

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const languages = [
    { code: 'English', label: 'English', flag: '🇺🇸', shortCode: 'en' },
    { code: 'Ukrainian', label: 'Українська', flag: '🇺🇦', shortCode: 'uk' }
  ] as const;

  const handleLanguageChange = (lang: 'English' | 'Ukrainian') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language);
  const displayCode = isHydrated ? (currentLanguage?.shortCode || 'en') : 'en';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 text-white hover:text-yellow-400 transition-all duration-300 rounded-xl hover:bg-white/5"
      >
        <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-medium uppercase">{displayCode}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown with slide animation */}
      <div className={`absolute right-0 mt-2 rounded-2xl shadow-2xl z-50 min-w-40 sm:min-w-44 backdrop-blur-sm border border-gray-600/30 overflow-hidden transition-all duration-200 ease-out origin-top-right ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`} 
           style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center cursor-pointer gap-3 w-full text-left px-4 sm:px-5 py-3 text-xs sm:text-sm transition-all duration-200 relative transform ${
              isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            } ${
              isHydrated && language === lang.code 
                ? 'text-yellow-400 bg-yellow-400/10 border-l-4 border-yellow-400' 
                : 'text-white hover:bg-white/10'
            } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === languages.length - 1 ? 'rounded-b-2xl' : ''}`}
            style={{
              transitionDelay: isOpen ? `${index * 30}ms` : '0ms'
            }}
            onMouseEnter={(e) => {
              if (!isHydrated || language !== lang.code) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isHydrated || language !== lang.code) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="font-medium">{lang.label}</span>
            {isHydrated && language === lang.code && (
              <div className="absolute right-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 h-screen" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333333' }}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden flex items-center justify-center">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t('header.title')}</h1>
          </Link>
          
          {/* Language Dropdown */}
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
}