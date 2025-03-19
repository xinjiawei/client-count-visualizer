
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Cookie consent types
type ConsentStatus = 'pending' | 'accepted' | 'declined';

// Cookie for storing consent status
const CONSENT_COOKIE = 'cookie_consent';

// Context type definition
interface CookieConsentContextType {
  consentStatus: ConsentStatus;
  hasConsent: boolean;
  acceptAll: () => void;
  declineAll: () => void;
  openConsentDialog: () => void;
  closeConsentDialog: () => void;
  isConsentDialogOpen: boolean;
}

// Create the context
const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

// Provider props
interface CookieConsentProviderProps {
  children: ReactNode;
}

// Provider component
export const CookieConsentProvider = ({ children }: CookieConsentProviderProps) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check existing consent on mount - but only once
  useEffect(() => {
    if (!isInitialized) {
      const savedConsent = Cookies.get(CONSENT_COOKIE) as ConsentStatus | undefined;
      
      if (savedConsent) {
        setConsentStatus(savedConsent);
        // Don't show dialog if we already have saved consent
        setIsDialogOpen(false);
      } else {
        // Only show dialog on initial load if no existing consent
        setIsDialogOpen(true);
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Accept all cookies
  const acceptAll = () => {
    setConsentStatus('accepted');
    Cookies.set(CONSENT_COOKIE, 'accepted', { expires: 365 });
    setIsDialogOpen(false);
  };

  // Decline all except necessary cookies
  const declineAll = () => {
    setConsentStatus('declined');
    Cookies.set(CONSENT_COOKIE, 'declined', { expires: 365 });
    setIsDialogOpen(false);
    
    // Remove any preference cookies
    Cookies.remove('client_dashboard_sort_type');
    Cookies.remove('preferred_language');
    // Add other preference cookies to remove here
  };

  // Open the consent dialog
  const openConsentDialog = () => {
    setIsDialogOpen(true);
  };

  // Close the consent dialog
  const closeConsentDialog = () => {
    setIsDialogOpen(false);
  };

  // Determine if we have consent to use preference cookies
  const hasConsent = consentStatus === 'accepted';

  return (
    <CookieConsentContext.Provider 
      value={{
        consentStatus,
        hasConsent,
        acceptAll,
        declineAll,
        openConsentDialog,
        closeConsentDialog,
        isConsentDialogOpen: isDialogOpen && isInitialized,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

// Hook for using cookie consent
export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
