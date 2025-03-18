
import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CookieConsentDialog = () => {
  const { isConsentDialogOpen, acceptAll, declineAll } = useCookieConsent();
  const { t } = useLanguage();

  // Prevent scrolling when dialog is open
  useEffect(() => {
    if (isConsentDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isConsentDialogOpen]);

  if (!isConsentDialogOpen) {
    return null;
  }

  return (
    <AlertDialog open={isConsentDialogOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('cookies.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('cookies.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={declineAll}>
            {t('cookies.decline')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={acceptAll}>
            {t('cookies.accept')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CookieConsentDialog;
