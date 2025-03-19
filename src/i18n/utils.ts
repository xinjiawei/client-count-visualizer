
import { LanguageType, translations } from './translations';

// Cookie name for storing language preference
export const LANGUAGE_COOKIE = 'preferred_language';

// Detect browser language and return a supported language or fallback
export const detectBrowserLanguage = (): LanguageType => {
  try {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'zh' || browserLang === 'en' || browserLang === 'ja') {
      return browserLang as LanguageType;
    }
  } catch (e) {
    console.log('Could not detect browser language');
  }
  
  return 'zh'; // Default to Chinese
};

// Translation function
export const translateKey = (language: LanguageType, key: string, params?: Record<string, any>): string => {
  // Split key by dots to access nested properties
  const keys = key.split('.');
  
  // Get the translation resource
  let translation: any = translations[language];
  
  // Navigate through the nested properties
  for (const k of keys) {
    if (translation && k in translation) {
      translation = translation[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  // Return the translation
  if (typeof translation === 'string') {
    if (params) {
      // Replace placeholders with parameters
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(`{${param}}`, String(value)),
        translation
      );
    }
    return translation;
  }
  
  console.warn(`Invalid translation for key: ${key}`);
  return key;
};
