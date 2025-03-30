import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Ban, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import BASEURL from "@/lib/Url";

const Alerts = () => {
  const [transactions, setTransactions] = useState([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await axios.get(`${BASEURL}/transaction/history`, {
        withCredentials: true,
      });
      const data = res.data.message;
      setTransactions(data);
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    const filteredTransactions = transactions
    .filter(transaction => transaction.risk > 70) 
    .map((transaction, index) => ({
      id: index + 1,
      receiver: transaction?.user?.name || "Unknown",
      amount: transaction.amount,
      date: transaction.transactionTime.split("T")[0], 
      purpose: "Online Purchase",
      riskScore: transaction.risk,
    }));
    setFlaggedTransactions(filteredTransactions);
    // console.log(flaggedTransactions);
  },[transactions])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Alerts</h1>
      <p className="text-muted-foreground">Review and manage your security alerts</p>

      {flaggedTransactions.length > 0 ? (
        <div className="space-y-4">
          {flaggedTransactions.map((transaction) => (
            <Card key={transaction.id} className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive"></div>
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                  <CardTitle>Suspicious Transaction</CardTitle>
                </div>
                <CardDescription>
                  Transaction #{transaction.id} to {transaction.receiver} flagged.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Date:</span> {transaction.date}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Purpose:</span> {transaction.purpose}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Risk Score:</span>{" "}
                  <span className="text-destructive">{transaction.riskScore.toFixed(2)}</span>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Bell className="h-6 w-6 text-primary mb-4" />
            <h3 className="text-lg font-medium">No Alerts</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              No suspicious transactions detected.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Alerts;
