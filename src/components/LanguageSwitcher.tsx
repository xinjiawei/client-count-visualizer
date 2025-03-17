
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, LanguageType } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

  // Map of languages and their display names in their native language
  const languages: Record<LanguageType, string> = {
    zh: "中文",
    en: "English",
    ja: "日本語",
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={language} onValueChange={(value: LanguageType) => setLanguage(value)}>
        <SelectTrigger className={`${isMobile ? 'w-[80px]' : 'w-[110px]'}`}>
          <span className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder={languages[language]} />
          </span>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
