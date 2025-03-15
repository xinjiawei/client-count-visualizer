
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ClientData } from "@/types/clientData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, SortAsc, SortDesc } from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

interface BarChartComponentProps {
  data: ClientData;
}

interface FormattedData {
  version: string;
  count: number;
}

type SortType = "default" | "asc" | "desc";

// Cookie keys
const COOKIE_SORT_TYPE = "client_dashboard_sort_type";
const COOKIE_EXPIRY = 30; // Days until cookie expires

const BarChartComponent = ({ data }: BarChartComponentProps) => {
  const { toast } = useToast();
  
  // Format data for recharts
  const formattedData: FormattedData[] = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }));

  // Load preferences from cookies or use defaults
  const initialSortType = (Cookies.get(COOKIE_SORT_TYPE) as SortType) || "default";

  // States
  const [sortType, setSortType] = useState<SortType>(initialSortType);
  
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

  // Save sort type to cookie whenever it changes
  useEffect(() => {
    Cookies.set(COOKIE_SORT_TYPE, sortType, { expires: COOKIE_EXPIRY });
  }, [sortType]);

  // Calculate bar width based on data count
  const barWidth = Math.max(20, 1200 / formattedData.length);
  
  // Get sorted data
  const visibleData = getSortedData();

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          显示全部 {formattedData.length} 个版本
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <Button 
          variant={sortType === "default" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSortType("default")}
        >
          <ArrowDownAZ className="mr-1" size={16} />
          版本排序
        </Button>
        <Button 
          variant={sortType === "asc" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSortType("asc")}
        >
          <SortAsc className="mr-1" size={16} />
          数量升序
        </Button>
        <Button 
          variant={sortType === "desc" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSortType("desc")}
        >
          <SortDesc className="mr-1" size={16} />
          数量降序
        </Button>
      </div>

      <ScrollArea className="h-[330px] w-full border rounded-lg p-4">
        <div style={{ width: Math.max(800, visibleData.length * barWidth * 2) }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visibleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="version" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="客户端数量" fill="#3B82F6" barSize={barWidth} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BarChartComponent;
