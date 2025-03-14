
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ClientData } from "@/types/clientData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface BarChartComponentProps {
  data: ClientData;
}

interface FormattedData {
  version: string;
  count: number;
}

const BarChartComponent = ({ data }: BarChartComponentProps) => {
  // Format data for recharts
  const formattedData: FormattedData[] = Object.entries(data).map(([version, count]) => ({
    version,
    count,
  }));

  // Sort by version
  formattedData.sort((a, b) => a.version.localeCompare(b.version));

  // State for controlling visible items
  const [visibleItems, setVisibleItems] = useState(20);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleData, setVisibleData] = useState<FormattedData[]>([]);

  // Calculate bar width based on number of visible items
  const barWidth = Math.max(30, 60 - visibleItems / 4);
  
  // Update visible data when scroll position or visible items change
  useEffect(() => {
    const maxScrollPosition = Math.max(0, formattedData.length - visibleItems);
    const normalizedPosition = Math.min(scrollPosition, maxScrollPosition);
    
    const slicedData = formattedData.slice(
      normalizedPosition, 
      normalizedPosition + visibleItems
    );
    
    setVisibleData(slicedData);
  }, [formattedData, scrollPosition, visibleItems]);

  // Handle slider change for scrolling
  const handleScrollChange = (values: number[]) => {
    setScrollPosition(Math.floor(values[0]));
  };

  // Calculate maximum possible scroll position
  const maxScroll = Math.max(0, formattedData.length - visibleItems);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          显示 {visibleItems} 个版本 (共 {formattedData.length} 个)
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">显示数量:</span>
          <select 
            className="px-2 py-1 border rounded-md text-sm bg-background"
            value={visibleItems}
            onChange={(e) => setVisibleItems(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
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
            <span>{formattedData[0]?.version}</span>
            {maxScroll > 0 && formattedData.length > 1 && (
              <span>{formattedData[formattedData.length - 1]?.version}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
