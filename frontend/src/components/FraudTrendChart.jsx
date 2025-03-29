
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data
const data = [
  { name: "Jan", fraudDetected: 12, totalTransactions: 120 },
  { name: "Feb", fraudDetected: 19, totalTransactions: 150 },
  { name: "Mar", fraudDetected: 10, totalTransactions: 170 },
  { name: "Apr", fraudDetected: 22, totalTransactions: 190 },
  { name: "May", fraudDetected: 15, totalTransactions: 230 },
  { name: "Jun", fraudDetected: 25, totalTransactions: 250 },
  { name: "Jul", fraudDetected: 30, totalTransactions: 300 },
];

export function FraudTrendChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              return [
                value,
                name === "fraudDetected" ? "Fraud Detected" : "Total Transactions",
              ];
            }}
          />
          <Area
            type="monotone"
            dataKey="totalTransactions"
            stackId="1"
            stroke="#0EA5E9"
            fill="#0EA5E9"
            opacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="fraudDetected"
            stackId="2"
            stroke="#ef4444"
            fill="#ef4444"
            opacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
