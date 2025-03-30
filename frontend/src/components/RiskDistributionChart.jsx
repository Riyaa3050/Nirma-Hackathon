import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function RiskDistributionChart({ transactions }) {
  console.log(transactions);

  // Categorize transactions by risk level
  const categorizeTransactions = (transactions) => {
    let low = 0, medium = 0, high = 0;

    transactions?.forEach(({ risk }) => {
      if (risk >= 0 && risk < 50) {
        low++;
      } else if (risk >= 50 && risk < 70) {
        medium++;
      } else if (risk >= 70) {
        high++;
      }
    });

    const total = transactions?.length || 1;

    return [
      { name: "Low Risk", value: (low / total) * 100, color: "#22c55e" },
      { name: "Medium Risk", value: (medium / total) * 100, color: "#f97316" },
      { name: "High Risk", value: (high / total) * 100, color: "#ef4444" },
    ];
  };

  const data = categorizeTransactions(transactions);

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
            label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Transactions"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
