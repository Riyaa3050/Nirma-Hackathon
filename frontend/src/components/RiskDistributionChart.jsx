
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Sample data
const data = [
  { name: "Low Risk", value: 70, color: "#22c55e" },
  { name: "Medium Risk", value: 20, color: "#f97316" },
  { name: "High Risk", value: 10, color: "#ef4444" },
];

export function RiskDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, "Transactions"]} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
