
import { ClientData } from "@/types/clientData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataSummaryProps {
  data: ClientData;
}

const DataSummary = ({ data }: DataSummaryProps) => {
  const totalClients = Object.values(data).reduce((sum, count) => sum + count, 0);
  const versionCount = Object.keys(data).length;
  
  // Find the version with the most clients
  let topVersion = "";
  let topCount = 0;
  
  // Find the latest version (assuming semantic versioning or at least consistent format)
  const versions = Object.keys(data);
  const latestVersion = versions[versions.length - 1];
  const latestVersionCount = data[latestVersion] || 0;
  
  for (const [version, count] of Object.entries(data)) {
    if (count > topCount) {
      topCount = count;
      topVersion = version;
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">总客户端数量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">版本数量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{versionCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">最受欢迎版本</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topVersion}</div>
          <p className="text-xs text-muted-foreground">
            {topCount} 客户端 ({((topCount / totalClients) * 100).toFixed(1)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">最新的客户端</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestVersion}</div>
          <p className="text-xs text-muted-foreground">
            {latestVersionCount} 客户端 ({((latestVersionCount / totalClients) * 100).toFixed(1)}%)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary;
