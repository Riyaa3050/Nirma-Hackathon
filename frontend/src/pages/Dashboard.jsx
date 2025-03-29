
import { BarChart3, DollarSign, ShieldAlert, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { FraudTrendChart } from "@/components/FraudTrendChart";
import { dashboardStats, mockTransactions, mockAlerts } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  // Get the most recent transactions and alerts
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentAlerts = [...mockAlerts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all transaction activities and fraud detection metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={dashboardStats.totalTransactions}
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Frauds Detected"
          value={dashboardStats.totalFraudsDetected}
          icon={<ShieldAlert className="h-4 w-4" />}
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Fraud Rate"
          value={`${dashboardStats.fraudRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 0.2, isPositive: false }}
        />
        <StatCard
          title="Average Risk Score"
          value={dashboardStats.averageRiskScore}
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <FraudTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    transaction.status === "flagged" ? "bg-red-50 border-red-200" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{transaction.merchant}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                    <RiskBadge score={transaction.riskScore} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => {
                const transaction = mockTransactions.find((t) => t.id === alert.transactionId);
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      alert.status === "new" ? "bg-amber-50 border-amber-200" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {alert.type === "verified-fraud"
                          ? "Verified Fraud"
                          : alert.type === "high-risk"
                          ? "High Risk Alert"
                          : "Suspicious Activity"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction ? transaction.merchant : "Unknown"} -{" "}
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {transaction ? `$${transaction.amount.toFixed(2)}` : "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {alert.status === "new"
                          ? "New"
                          : alert.status === "in-review"
                          ? "In Review"
                          : "Resolved"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
