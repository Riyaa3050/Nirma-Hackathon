import { BarChart3, DollarSign, ShieldAlert, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASEURL from "@/lib/Url";

const Dashboard = () => {
   const [transactions, setTransactions] = useState([]);
   const [transactionData , setTransactionData] = useState({
    "total": 0,
    "fraudDetected" : 0,
    "fraudRate" : 0,
    "AvgRisk" : 0
   })
   const user = useSelector(state => state.user.user);

   const navigate = useNavigate();
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

    useEffect(() => {
      const storedUserId = user.id;
      const userRole = user.role;
  
      if (!storedUserId || userRole !== "ADMIN") {
        navigate("/");
        return;
      }

      async function fetchHistory() {
        const res = await axios.get(`${BASEURL}/transaction/history`, {
          withCredentials: true,
        });
        const data = res.data.message;
        setTransactions(data);
      }
      fetchHistory();
    }, [navigate]);

    useEffect(() => {
      if (transactions.length > 0) {
        const totalTransactions = transactions.length;
        const fraudCount = transactions.filter(transaction => transaction.type !== "completed").length;
        const fraudRate = (fraudCount / totalTransactions) * 100; 
        const avgRisk =
          fraudCount > 0
            ? transactions.reduce((sum, transaction) => sum + (transaction.risk || 0), 0) / totalTransactions
            : 0; 
    
        setTransactionData({
          total: totalTransactions,
          fraudDetected: fraudCount,
          fraudRate: parseFloat(fraudRate.toFixed(2)),
          AvgRisk: parseFloat(avgRisk.toFixed(2)),
        });
      }
    }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Dashboard</h1>
        <p className=" text-blue-400">
          Overview of all transaction activities and fraud detection metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={transactionData.total}
          icon={<DollarSign className="h-4 w-4 text-green-700" />}
          trend={{ value: 12, isPositive: true }}
          className="bg-green-100"
        />
        <StatCard
          title="Frauds Detected"
          value={transactionData.fraudDetected}
          icon={<ShieldAlert className="h-4 w-4 text-red-600" />}
          trend={{ value: 8, isPositive: false }}
          className="bg-red-100"
        />
        <StatCard
          title="Fraud Rate"
          value={`${transactionData.fraudRate}%`}
          icon={<TrendingUp className="h-4 w-4 text-yellow-600" />}
          trend={{ value: 0.2, isPositive: false }}
           className="bg-yellow-100"
        />
        <StatCard
          title="Average Risk Score"
          value={transactionData.AvgRisk}
          icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
          trend={{ value: 3, isPositive: true }}
          className="bg-blue-100"
          
        />
      </div>

      <div className="grid gap-4 ">
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
          <RiskDistributionChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 ">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-20">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    transaction.type === "flagged" ? "bg-red-50 border-red-200" : "bg-green-50"
                  }`}
                >
                  <div>
                    <div className="font-medium">{transaction?.user?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.transactionTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                    <RiskBadge score={transaction.risk} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        

      </div>
    </div>
  );
};

export default Dashboard;
