'use client';

import { useTranslations } from 'next-intl';

export function Footer({ InnerComponent }: { InnerComponent?: React.ComponentType }) {
  const t = useTranslations();
  
  const mainContainerClasses = InnerComponent
    ? "max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12"
    : "max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6";

  const copyrightClasses = InnerComponent 
    ? "mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm" 
    : "text-center text-sm";
  
  const copyrightStyles = InnerComponent 
    ? { borderTop: '1px solid #333333', color: '#888888' }
    : { color: '#888888' };

  return (
    <footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333333' }}>
      <div className={mainContainerClasses}>
        {InnerComponent && <InnerComponent />}
        
        <div className={copyrightClasses} style={copyrightStyles}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}