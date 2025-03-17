
import { useQuery } from "@tanstack/react-query";
import { fetchClientData } from "@/services/apiService";
import BarChartComponent from "@/components/BarChartComponent";
import DataSummary from "@/components/DataSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ArrowDownAZ, SortAsc, SortDesc, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// 定义排序类型
export type SortType = "default" | "asc" | "desc";

const ClientDashboard = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  // 添加共享的排序状态
  const [sortType, setSortType] = useState<SortType>("default");
  
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["clientData"],
    queryFn: fetchClientData,
    onSuccess: (data) => {
      if (data && Object.keys(data).length > 0) {
        toast.success(t('dashboard.dataRefreshed'));
      }
    },
    meta: {
      onError: (error: any) => {
        toast.error(t('dashboard.fetchError'), {
          description: error instanceof Error ? error.message : String(error)
        });
      }
    }
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
        <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : String(error)}</p>
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
      {/* Responsive header area with flex-col on mobile */}
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between'} items-${isMobile ? 'start' : 'center'} mb-6`}>
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button 
            onClick={() => refetch()}
            disabled={isRefetching}
            variant="default"
            className="px-3 py-1 rounded-md transition-colors text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isRefetching ? (
              <>
                <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                {t('dashboard.refreshing')}
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-4 w-4" />
                {t('dashboard.refreshButton')}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <DataSummary data={data} />
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('dashboard.clientCount')}</CardTitle>
          {/* Responsive sort buttons - flex-wrap helps on mobile */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant={sortType === "default" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("default")}
              className="text-xs sm:text-sm"
            >
              <ArrowDownAZ className="mr-1" size={16} />
              {isMobile ? "" : t('dashboard.sortByVersion')}
            </Button>
            <Button 
              variant={sortType === "asc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("asc")}
              className="text-xs sm:text-sm"
            >
              <SortAsc className="mr-1" size={16} />
              {isMobile ? "" : t('dashboard.sortAscending')}
            </Button>
            <Button 
              variant={sortType === "desc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSortType("desc")}
              className="text-xs sm:text-sm"
            >
              <SortDesc className="mr-1" size={16} />
              {isMobile ? "" : t('dashboard.sortDescending')}
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
