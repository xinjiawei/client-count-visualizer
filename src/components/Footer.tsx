
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { Settings } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  const { openConsentDialog } = useCookieConsent();

  return (
    <footer className="mt-8 border-t py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Client Dashboard
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center mt-4 md:mt-0"
          onClick={openConsentDialog}
        >
          <Settings className="h-3 w-3 mr-1" />
          {t('cookies.footer')}
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
