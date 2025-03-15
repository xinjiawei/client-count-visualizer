
import { useQuery } from "@tanstack/react-query";
import { fetchClientData } from "@/services/apiService";
import BarChartComponent from "@/components/BarChartComponent";
import PieChartComponent from "@/components/PieChartComponent";
import DataSummary from "@/components/DataSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientDashboard = () => {
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
        <h3 className="text-xl font-semibold text-destructive mb-2">加载数据时出错</h3>
        <p className="text-muted-foreground mb-4">无法从API获取客户端数据。</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold mb-2">没有数据</h3>
        <p className="text-muted-foreground">API没有返回任何客户端数据。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">客户端数量可视化</h1>
        <button 
          onClick={() => refetch()}
          className="px-3 py-1 bg-secondary rounded-md hover:bg-secondary/80 transition-colors text-sm"
        >
          刷新数据
        </button>
      </div>
      
      <DataSummary data={data} />
      
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="bar">柱状图</TabsTrigger>
          <TabsTrigger value="pie">饼图</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>按版本划分的客户端数量</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>客户端版本分布</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>原始数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">版本</th>
                  <th className="border px-4 py-2 text-left">客户端数量</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([version, count]) => (
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
