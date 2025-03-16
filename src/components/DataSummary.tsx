
import { ClientData } from "@/types/clientData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DataSummaryProps {
  data: ClientData;
}

// Helper function to compare version strings (assuming semantic versioning format)
const compareVersions = (a: string, b: string): number => {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  
  return 0;
};

const DataSummary = ({ data }: DataSummaryProps) => {
  const { t } = useLanguage();
  const totalClients = Object.values(data).reduce((sum, count) => sum + count, 0);
  const versionCount = Object.keys(data).length;
  
  // Find the version with the most clients
  let topVersion = "";
  let topCount = 0;
  
  // Find the latest version using proper version comparison
  const versions = Object.keys(data);
  let latestVersion = versions[0] || "";
  
  for (const [version, count] of Object.entries(data)) {
    // Update top version
    if (count > topCount) {
      topCount = count;
      topVersion = version;
    }
    
    // Update latest version using proper comparison
    if (compareVersions(version, latestVersion) > 0) {
      latestVersion = version;
    }
  }
  
  const latestVersionCount = data[latestVersion] || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('summary.totalClients')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('summary.versionCount')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{versionCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('summary.popularVersion')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topVersion}</div>
          <p className="text-xs text-muted-foreground">
            {topCount} {t('summary.clients')} ({((topCount / totalClients) * 100).toFixed(1)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('summary.latestVersion')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestVersion}</div>
          <p className="text-xs text-muted-foreground">
            {latestVersionCount} {t('summary.clients')} ({((latestVersionCount / totalClients) * 100).toFixed(1)}%)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary;
