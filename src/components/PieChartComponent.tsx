
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ClientData } from "@/types/clientData";

interface PieChartComponentProps {
  data: ClientData;
}

interface FormattedData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57"];

const PieChartComponent = ({ data }: PieChartComponentProps) => {
  // Format data for recharts
  const formattedData: FormattedData[] = Object.entries(data).map(([version, count]) => ({
    name: version,
    value: count,
  }));

  // Sort by version
  formattedData.sort((a, b) => a.name.localeCompare(b.name));

  // Calculate total for percentage display
  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ name, value, percent }: { name: string; value: number; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={renderCustomizedLabel}
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} (${((value as number) / total * 100).toFixed(1)}%)`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
