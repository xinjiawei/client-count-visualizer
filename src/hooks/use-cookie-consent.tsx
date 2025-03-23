
import { useState, createContext, useContext, ReactNode } from 'react';

// Context type definition
interface CookieConsentContextType {
  consentStatus: 'accepted';
  hasConsent: true;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Accept all cookies
  const acceptAll = () => {
    console.log('Accept action triggered - no cookies are set');
    setIsDialogOpen(false);
  };

  // Decline all cookies
  const declineAll = () => {
    console.log('Decline action triggered - no cookies are affected');
    setIsDialogOpen(false);
  };

  // Open the consent dialog
  const openConsentDialog = () => {
    setIsDialogOpen(true);
  };

  // Close the consent dialog
  const closeConsentDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <CookieConsentContext.Provider 
      value={{
        consentStatus: 'accepted',
        hasConsent: true,
        acceptAll,
        declineAll,
        openConsentDialog,
        closeConsentDialog,
        isConsentDialogOpen: isDialogOpen,
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
