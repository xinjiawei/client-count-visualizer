
import { useState } from "react";
import { useLanguage, LanguageType } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Map of languages and their display names in their native language
  const languages: Record<LanguageType, string> = {
    zh: "中文",
    en: "English",
    ja: "日本語",
  };

  const handleSelectLanguage = (value: LanguageType) => {
    setLanguage(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`${isMobile ? 'w-[40px] px-0' : 'w-[40px]'} flex items-center justify-center`}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">选择语言 / Select Language / 言語を選択</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {Object.entries(languages).map(([code, name]) => (
            <Button
              key={code}
              variant={language === code ? "default" : "outline"}
              className="w-full py-6 text-lg"
              onClick={() => handleSelectLanguage(code as LanguageType)}
            >
              {name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSwitcher;
