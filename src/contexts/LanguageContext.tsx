
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import Cookies from 'js-cookie';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { LanguageType } from '@/i18n/translations';
import { LANGUAGE_COOKIE, detectBrowserLanguage, translateKey } from '@/i18n/utils';

// Language context type
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { hasConsent } = useCookieConsent();
  const initialStateSet = useRef(false);
  
  // Get initial language from cookie if available and consent is given, otherwise use browser language or Chinese as default
  const getInitialLanguage = (): LanguageType => {
    if (hasConsent) {
      const savedLanguage = Cookies.get(LANGUAGE_COOKIE);
      console.log('Loading language from cookie:', savedLanguage);
      if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en' || savedLanguage === 'ja')) {
        return savedLanguage as LanguageType;
      }
    }
    
    // If no cookie or no consent, try to detect browser language
    return detectBrowserLanguage();
  };

  const [language, setLanguage] = useState<LanguageType>(getInitialLanguage());

  // Update cookie when language changes, but only if consent is given
  // Prevent the initial state setup from immediately overwriting the cookie
  useEffect(() => {
    if (!initialStateSet.current) {
      initialStateSet.current = true;
      return;
    }
    
    if (hasConsent) {
      console.log('Saving language to cookie:', language);
      Cookies.set(LANGUAGE_COOKIE, language, { expires: 365, sameSite: 'strict' });
    }
  }, [language, hasConsent]);

  // Translation function wrapper
  const t = (key: string, params?: Record<string, any>): string => {
    return translateKey(language, key, params);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Re-export the LanguageType
export { LanguageType };
