
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

// Available languages
export type LanguageType = 'zh' | 'en' | 'ja';

// Language resources structure
export interface LanguageResources {
  dashboard: {
    title: string;
    refreshButton: string;
    refreshing: string;
    sortByVersion: string;
    sortAscending: string;
    sortDescending: string;
    noData: string;
    loading: string;
    error: string;
    retry: string;
    rawData: string;
    version: string;
    clientCount: string;
    fetchError: string;
    dataRefreshed: string;
  };
  summary: {
    totalClients: string;
    versionCount: string;
    popularVersion: string;
    latestVersion: string;
    clients: string;
  };
  chart: {
    showingVersions: string;
    displayCount: string;
    clientCount: string;
  };
  preferences: {
    saved: string;
    autoSaved: string;
  };
  cookies: {
    title: string;
    description: string;
    accept: string;
    decline: string;
    settings: string;
    necessary: string;
    preferences: string;
    manage: string;
    footer: string;
    save: string;
    close: string;
  };
}

// Define translations
const translations: Record<LanguageType, LanguageResources> = {
  zh: {
    dashboard: {
      title: '客户端统计面板',
      refreshButton: '刷新数据',
      refreshing: '刷新中...',
      sortByVersion: '版本排序',
      sortAscending: '数量升序',
      sortDescending: '数量降序',
      noData: '没有数据',
      loading: '加载中...',
      error: '出错了',
      retry: '重试',
      rawData: '原始数据',
      version: '版本',
      clientCount: '客户端数量',
      fetchError: '获取数据失败',
      dataRefreshed: '数据已刷新',
    },
    summary: {
      totalClients: '总客户端数',
      versionCount: '版本数量',
      popularVersion: '最常用版本',
      latestVersion: '最新版本',
      clients: '客户端',
    },
    chart: {
      showingVersions: '显示 {count} 个版本 (共 {total} 个)',
      displayCount: '显示数量',
      clientCount: '客户端数量',
    },
    preferences: {
      saved: '设置已保存',
      autoSaved: '您的偏好设置已自动保存',
    },
    cookies: {
      title: '管理 Cookie 喜好设定',
      description: '我们使用 cookie 来保存您的设置偏好。请选择是否同意使用 cookie。',
      accept: '接受所有 Cookie',
      decline: '仅必要 Cookie',
      settings: 'Cookie 设置',
      necessary: '必要 Cookie',
      preferences: '偏好设置 Cookie',
      manage: '管理 Cookie 设置',
      footer: 'Cookie 设置',
      save: '保存设置',
      close: '关闭',
    },
  },
  en: {
    dashboard: {
      title: 'Client Dashboard',
      refreshButton: 'Refresh Data',
      refreshing: 'Refreshing...',
      sortByVersion: 'Sort by Version',
      sortAscending: 'Sort Ascending',
      sortDescending: 'Sort Descending',
      noData: 'No Data',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      rawData: 'Raw Data',
      version: 'Version',
      clientCount: 'Client Count',
      fetchError: 'Failed to fetch data',
      dataRefreshed: 'Data refreshed',
    },
    summary: {
      totalClients: 'Total Clients',
      versionCount: 'Version Count',
      popularVersion: 'Most Popular Version',
      latestVersion: 'Latest Version',
      clients: 'clients',
    },
    chart: {
      showingVersions: 'Showing {count} of {total} versions',
      displayCount: 'Display Count',
      clientCount: 'Client Count',
    },
    preferences: {
      saved: 'Settings Saved',
      autoSaved: 'Your preferences have been automatically saved',
    },
    cookies: {
      title: 'Manage Cookie Preferences',
      description: 'We use cookies to save your preferences. Please choose whether you consent to the use of cookies.',
      accept: 'Accept All Cookies',
      decline: 'Necessary Cookies Only',
      settings: 'Cookie Settings',
      necessary: 'Necessary Cookies',
      preferences: 'Preference Cookies',
      manage: 'Manage Cookie Settings',
      footer: 'Cookie Settings',
      save: 'Save Settings',
      close: 'Close',
    },
  },
  ja: {
    dashboard: {
      title: 'クライアントダッシュボード',
      refreshButton: 'データを更新',
      refreshing: '更新中...',
      sortByVersion: 'バージョンで並べ替え',
      sortAscending: '昇順で並べ替え',
      sortDescending: '降順で並べ替え',
      noData: 'データなし',
      loading: '読み込み中...',
      error: 'エラー',
      retry: '再試行',
      rawData: '生データ',
      version: 'バージョン',
      clientCount: 'クライアント数',
      fetchError: 'データの取得に失敗しました',
      dataRefreshed: 'データが更新されました',
    },
    summary: {
      totalClients: '合計クライアント',
      versionCount: 'バージョン数',
      popularVersion: '最も人気のバージョン',
      latestVersion: '最新バージョン',
      clients: 'クライアント',
    },
    chart: {
      showingVersions: '{total}バージョン中{count}を表示',
      displayCount: '表示数',
      clientCount: 'クライアント数',
    },
    preferences: {
      saved: '設定が保存されました',
      autoSaved: '設定が自動的に保存されました',
    },
    cookies: {
      title: 'Cookieの設定を管理',
      description: '当サイトでは設定を保存するためにCookieを使用しています。Cookieの使用に同意するかどうかを選択してください。',
      accept: 'すべてのCookieを受け入れる',
      decline: '必要なCookieのみ',
      settings: 'Cookie設定',
      necessary: '必要なCookie',
      preferences: '設定用Cookie',
      manage: 'Cookie設定を管理',
      footer: 'Cookie設定',
      save: '設定を保存',
      close: '閉じる',
    },
  },
};

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

// Cookie name for storing language preference
const LANGUAGE_COOKIE = 'preferred_language';

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { hasConsent } = useCookieConsent();
  
  // Get initial language from cookie if available and consent is given, otherwise use browser language or Chinese as default
  const getInitialLanguage = (): LanguageType => {
    if (hasConsent) {
      const savedLanguage = Cookies.get(LANGUAGE_COOKIE) as LanguageType | undefined;
      if (savedLanguage) return savedLanguage;
    }
    
    // If no cookie or no consent, try to detect browser language
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

  const [language, setLanguage] = useState<LanguageType>(getInitialLanguage());

  // Update cookie when language changes, but only if consent is given
  useEffect(() => {
    if (hasConsent) {
      Cookies.set(LANGUAGE_COOKIE, language, { expires: 365 });
    }
  }, [language, hasConsent]);

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
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
