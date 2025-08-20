'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Twitter, Facebook, Instagram } from 'lucide-react';

export function MenuFooter() {
  const t = useTranslations();

  return (
    <div>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 font-[IgraSans]">
        {/* Contact Info */}
        <div className="flex flex-col sm:items-center">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.contact.title')}</h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base" style={{ color: '#888888' }}>
            <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <p>{t('footer.contact.address')}</p>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <p>{t('footer.contact.phone')}</p>
            </div> */}
            <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <p>{t('footer.contact.email')}</p>
            </div>
          </div>
        </div>
        
        {/* Hours */}
        <div className="flex flex-col sm:items-center">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.hours.title')}</h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base" style={{ color: '#888888' }}>
            <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <p>{t('footer.hours.weekdays')}</p>
            </div>
            {/* <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <p>{t('footer.hours.weekend')}</p>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <p>{t('footer.hours.sunday')}</p>
            </div> */}
          </div>
        </div>
        
        {/* Social */}
        <div className="flex flex-col sm:items-center">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('footer.social.title')}</h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base" style={{ color: '#888888' }}>
            {/* <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Twitter className="w-6 h-6" />
              </div>
              <p>{t('footer.social.twitter')}</p>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Facebook className="w-6 h-6" />
              </div>
              <p>{t('footer.social.facebook')}</p>
            </div> */}
            <div className="flex items-center gap-2">
              <div className="bg-[#111111] p-2 rounded-lg">
                <Instagram className="w-6 h-6" />
              </div>
              <p>{t('footer.social.instagram')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-[#888888] mt-4">
        <p className="italic">{t("footer.aiWarning")}</p>
      </div>
    </div>
  );
}