import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import BASEURL from "@/lib/Url";

const Alerts = () => {
  const [transactions, setTransactions] = useState([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(`${BASEURL}/transaction/history`, {
          withCredentials: true,
        });
        const data = res.data.message;
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    const filteredTransactions = transactions
      .filter((transaction) => transaction.risk > 70)
      .map((transaction, index) => ({
        id: index + 1,
        receiver: transaction?.user?.name || "Unknown",
        amount: transaction.amount,
        date: transaction.transactionTime.split("T")[0],
        reason: transaction?.reason || "Online Purchase",
        type: transaction?.transactionType,
        riskScore: transaction.risk,
      }));
    setFlaggedTransactions(filteredTransactions);
  }, [transactions]);

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-12">
      <h1 className="text-3xl font-bold">Alerts</h1>
      <p className="text-muted-foreground">Review and manage your security alerts</p>

      {loading ? (
        <Card className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </Card>
      ) : flaggedTransactions.length > 0 ? (
        <div className="space-y-4">
          {flaggedTransactions.map((transaction) => (
            <Card key={transaction.id} className="relative border shadow-lg hover:shadow-xl transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <CardTitle>Suspicious Transaction</CardTitle>
                </div>
                <CardDescription>
                  Transaction #{transaction.id} to {transaction.receiver} flagged.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Amount:</span>
                  <span className="text-right">${transaction.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Date:</span>
                  <span>{transaction.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Reason:</span>
                  <span>{transaction.reason}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Type:</span>
                  <span>{transaction.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Risk Score:</span>
                  <Badge
                    className={`${
                      transaction.riskScore > 90
                        ? "bg-red-500"
                        : transaction.riskScore > 80
                        ? "bg-yellow-500"
                        : "bg-orange-500"
                    } text-white px-2 py-1`}
                  >
                    {transaction.riskScore.toFixed(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-medium">No Alerts</h3>
            <p className="text-muted-foreground max-w-sm">
              No suspicious transactions detected at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Alerts;