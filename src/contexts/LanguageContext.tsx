
import React, { createContext, useState, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';

// 支持的语言类型
export type LanguageType = 'zh' | 'en';

// 语言资源定义
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
}

// 中文资源
const zhResources: LanguageResources = {
  dashboard: {
    title: '客户端数量可视化',
    refreshButton: '刷新数据',
    refreshing: '刷新中...',
    sortByVersion: '版本排序',
    sortAscending: '数量升序',
    sortDescending: '数量降序',
    noData: '没有数据',
    loading: '加载数据中...',
    error: '加载数据时出错',
    retry: '重试',
    rawData: '原始数据',
    version: '版本',
    clientCount: '客户端数量',
    fetchError: '获取数据失败',
    dataRefreshed: '数据已更新',
  },
  summary: {
    totalClients: '总客户端数量',
    versionCount: '版本数量',
    popularVersion: '最受欢迎版本',
    latestVersion: '最新的客户端',
    clients: '客户端',
  },
  chart: {
    showingVersions: '显示 {count} 个版本 (共 {total} 个)',
    displayCount: '显示数量:',
    clientCount: '客户端数量',
  },
};

// 英文资源
const enResources: LanguageResources = {
  dashboard: {
    title: 'Client Count Visualization',
    refreshButton: 'Refresh Data',
    refreshing: 'Refreshing...',
    sortByVersion: 'Sort by Version',
    sortAscending: 'Sort Ascending',
    sortDescending: 'Sort Descending',
    noData: 'No Data',
    loading: 'Loading data...',
    error: 'Error loading data',
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
    showingVersions: 'Showing {count} versions (out of {total})',
    displayCount: 'Display count:',
    clientCount: 'Client Count',
  },
};

// 所有资源的映射
const resources: Record<LanguageType, LanguageResources> = {
  zh: zhResources,
  en: enResources,
};

// 语言上下文类型
interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cookie 键名
const LANGUAGE_COOKIE = 'preferred_language';

// 语言提供者组件属性
interface LanguageProviderProps {
  children: ReactNode;
}

// 语言提供者组件
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // 从 Cookie 获取初始语言，默认为中文
  const savedLanguage = Cookies.get(LANGUAGE_COOKIE) as LanguageType;
  const [language, setLanguage] = useState<LanguageType>(savedLanguage || 'zh');

  // 更改语言并存储到 Cookie
  const handleSetLanguage = (lang: LanguageType) => {
    setLanguage(lang);
    Cookies.set(LANGUAGE_COOKIE, lang, { expires: 365 });
  };

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value = resources[language];
    
    for (const k of keys) {
      if (value[k as keyof typeof value]) {
        value = value[k as keyof typeof value];
      } else {
        return key; // 如果找不到键，返回原始键
      }
    }

    let result = value as unknown as string;
    
    // 替换参数
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return result;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
