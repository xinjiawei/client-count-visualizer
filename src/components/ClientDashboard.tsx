
import { useQuery } from "@tanstack/react-query";
import { fetchClientData } from "@/services/apiService";
import BarChartComponent from "@/components/BarChartComponent";
import DataSummary from "@/components/DataSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ArrowDownAZ, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// 定义排序类型
export type SortType = "default" | "asc" | "desc";

const ClientDashboard = () => {
  const { t } = useLanguage();
  // 添加共享的排序状态
  const [sortType, setSortType] = useState<SortType>("default");
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["clientData"],
    queryFn: fetchClientData,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-destructive mb-2">{t('dashboard.error')}</h3>
        <p className="text-muted-foreground mb-4">无法从API获取客户端数据。</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('dashboard.retry')}
        </button>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">{t('dashboard.noData')}</h3>
        <p className="text-muted-foreground">API没有返回任何客户端数据。</p>
      </div>
    );
  }

  // 根据当前排序类型对数据进行排序
  const getSortedData = () => {
    const entries = Object.entries(data);
    
    if (sortType === "default") {
      // 按版本排序（默认）
      return entries.sort((a, b) => a[0].localeCompare(b[0]));
    } else if (sortType === "asc") {
      // 按数量升序
      return entries.sort((a, b) => a[1] - b[1]);
    } else if (sortType === "desc") {
      // 按数量降序
      return entries.sort((a, b) => b[1] - a[1]);
    }
    
    return entries;
  };

  const sortedData = getSortedData();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button 
            onClick={() => refetch()}
            className="px-3 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-sm"
          >
            {t('dashboard.refreshButton')}
          </button>
        </div>
      </div>
      
      <DataSummary data={data} />
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('dashboard.clientCount')}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant={sortType === "default" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("default")}
            >
              <ArrowDownAZ className="mr-1" size={16} />
              {t('dashboard.sortByVersion')}
            </Button>
            <Button 
              variant={sortType === "asc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("asc")}
            >
              <SortAsc className="mr-1" size={16} />
              {t('dashboard.sortAscending')}
            </Button>
            <Button 
              variant={sortType === "desc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("desc")}
            >
              <SortDesc className="mr-1" size={16} />
              {t('dashboard.sortDescending')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BarChartComponent data={data} sortType={sortType} />
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('dashboard.rawData')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">{t('dashboard.version')}</th>
                  <th className="border px-4 py-2 text-left">{t('dashboard.clientCount')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(([version, count]) => (
                  <tr key={version}>
                    <td className="border px-4 py-2">{version}</td>
                    <td className="border px-4 py-2">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
