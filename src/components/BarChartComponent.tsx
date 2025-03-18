
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ClientData } from "@/types/clientData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortType } from "@/components/ClientDashboard";
import { useLanguage } from "@/contexts/LanguageContext";

interface BarChartComponentProps {
  data: ClientData;
  sortType: SortType;
}

interface FormattedData {
  version: string;
  count: number;
}

// Cookie keys
const COOKIE_VISIBLE_ITEMS = "client_dashboard_visible_items";
const COOKIE_EXPIRY = 30; // Days until cookie expires

const BarChartComponent = ({ data, sortType }: BarChartComponentProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Format data for recharts
  const formattedData: FormattedData[] = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }));

  // Load preferences from cookies or use defaults
  const initialVisibleItems = Number(Cookies.get(COOKIE_VISIBLE_ITEMS)) || 20;

  // States
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleData, setVisibleData] = useState<FormattedData[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Sort data based on sort type
  const getSortedData = () => {
    let sortedData = [...formattedData];
    
    if (sortType === "default") {
      // Sort by version (default)
      sortedData.sort((a, b) => a.version.localeCompare(b.version));
    } else if (sortType === "asc") {
      // Sort by count ascending
      sortedData.sort((a, b) => a.count - b.count);
    } else if (sortType === "desc") {
      // Sort by count descending
      sortedData.sort((a, b) => b.count - a.count);
    }
    
    return sortedData;
  };

  // Get sorted data for the current sort type
  const sortedData = getSortedData();

  // Measure container width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Reset scroll position when sort type changes
  useEffect(() => {
    setScrollPosition(0);
  }, [sortType]);

  // Auto-save preferences to cookies whenever they change
  useEffect(() => {
    Cookies.set(COOKIE_VISIBLE_ITEMS, visibleItems.toString(), { expires: COOKIE_EXPIRY });
    
    // Optional: Show a subtle toast notification
    toast({
      title: "设置已保存",
      description: "您的偏好设置已自动保存",
      duration: 1500,
    });
  }, [visibleItems, toast]);

  // Calculate dynamic bar width based on container width and number of items
  const calculateBarWidth = () => {
    if (containerWidth === 0) return 40; // Default fallback
    
    // Reserve some space for margins and axes (approximately 80px)
    const availableWidth = Math.max(containerWidth - 80, 300);
    
    // Calculate width per bar with some spacing between bars
    let width = Math.floor(availableWidth / visibleItems) - 5;
    
    // Ensure the width is within reasonable bounds
    return Math.max(10, Math.min(width, 60));
  };
  
  // Update visible data when sort type, scroll position or visible items change
  useEffect(() => {
    const sortedData = getSortedData();
    const maxScrollPosition = Math.max(0, sortedData.length - visibleItems);
    const normalizedPosition = Math.min(scrollPosition, maxScrollPosition);
    
    const slicedData = sortedData.slice(
      normalizedPosition, 
      normalizedPosition + visibleItems
    );
    
    setVisibleData(slicedData);
  }, [formattedData, scrollPosition, visibleItems, sortType]);

  // Handle slider change for scrolling
  const handleScrollChange = (values: number[]) => {
    setScrollPosition(Math.floor(values[0]));
  };

  // Handle visible items change
  const handleVisibleItemsChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setVisibleItems(numValue);
    setScrollPosition(0); // Reset scroll position when changing visible items
  };

  // Calculate maximum possible scroll position
  const maxScroll = Math.max(0, sortedData.length - visibleItems);
  const barWidth = calculateBarWidth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">{t('chart.displayCount')}</span>
          <Select 
            value={visibleItems.toString()} 
            onValueChange={handleVisibleItemsChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={visibleItems.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[330px] w-full border rounded-lg p-4">
        <div 
          ref={chartContainerRef} 
          className="w-full"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={visibleData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={barWidth}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name={t('chart.clientCount')} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ScrollArea>
      
      <div className="text-sm text-muted-foreground text-center mt-2 mb-2">
        {t('chart.showingVersions', { count: visibleItems, total: formattedData.length })}
      </div>
      
      {maxScroll > 0 && (
        <div className="pt-2">
          <Slider 
            defaultValue={[0]} 
            max={maxScroll} 
            step={1} 
            value={[scrollPosition]}
            onValueChange={handleScrollChange}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{sortedData[0]?.version}</span>
            {maxScroll > 0 && sortedData.length > 1 && (
              <span>{sortedData[sortedData.length - 1]?.version}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
