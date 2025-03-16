
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'zh' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('zh')}
      >
        中文
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
      >
        English
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
