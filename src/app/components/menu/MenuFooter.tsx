'use client';

import { useTranslations } from 'next-intl';

export function MenuFooter() {
  const t = useTranslations();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
      {/* Contact Info */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.contact.title')}</h3>
        <div className="space-y-1 sm:space-y-2 text-sm sm:text-base" style={{ color: '#888888' }}>
          <p>📍 {t('footer.contact.address')}</p>
          <p>📞 {t('footer.contact.phone')}</p>
          <p>✉️ {t('footer.contact.email')}</p>
        </div>
      </div>
      
      {/* Hours */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.hours.title')}</h3>
        <div className="space-y-1 sm:space-y-2 text-sm sm:text-base" style={{ color: '#888888' }}>
          <p>{t('footer.hours.weekdays')}</p>
          <p>{t('footer.hours.weekend')}</p>
          <p>{t('footer.hours.sunday')}</p>
        </div>
      </div>
      
      {/* Social */}
      <div className="sm:col-span-2 md:col-span-1">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.social.title')}</h3>
        <div className="space-y-1 sm:space-y-2 text-sm sm:text-base" style={{ color: '#888888' }}>
          <p>📱 {t('footer.social.twitter')}</p>
          <p>👥 {t('footer.social.facebook')}</p>
          <p>📸 {t('footer.social.instagram')}</p>
        </div>
      </div>
    </div>
  );
}