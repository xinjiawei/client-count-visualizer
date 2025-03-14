
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ClientData } from "@/types/clientData";

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="version" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Client Count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
