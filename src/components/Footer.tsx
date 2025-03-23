
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-8 border-t py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Client Dashboard
        </div>
      </div>
    </footer>
  );
};

export default Footer;
