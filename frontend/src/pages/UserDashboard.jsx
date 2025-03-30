import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ArrowRight, Clock, History, LogOut, DollarSign } from "lucide-react";
import { TransactionHistory } from "@/components/TransactionHistory";
import { toast } from "sonner";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUserId = localStorage.getItem('userId');
//     const userRole = localStorage.getItem('userRole');
    
//     if (!storedUserId || userRole !== 'user') {
//       navigate('/demo');
//       return;
//     }
    
//     setUserId(storedUserId);
    
//     // Load saved transactions from localStorage
//     const savedTransactions = localStorage.getItem('userTransactions');
//     if (savedTransactions) {
//       setTransactions(JSON.parse(savedTransactions));
//     }
//   }, [navigate]);

  const generateRandomReceiverId = () => {
    const randomId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setReceiverId(randomId);
  };

  useEffect(() => {
    // Generate random receiver ID on initial load
    if (!receiverId) {
      generateRandomReceiverId();
    }
  }, [receiverId]);

  const handleTransfer = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const newTransaction = {
        id: Date.now().toString(),
        senderId: userId,
        receiverId: receiverId,
        amount: Number(amount),
        date: new Date().toISOString(),
        status: 'completed'
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      
      // Save to localStorage
      localStorage.setItem('userTransactions', JSON.stringify(updatedTransactions));
      
      toast.success(`Successfully transferred $${amount} to recipient`);
      setAmount("");
      generateRandomReceiverId();
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-10 px-20">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-medium">User Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-muted-foreground">
            Make secure transactions and view your transaction history
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Your unique user ID and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="font-mono font-medium mt-1 flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      {userId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="transfer">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transfer">
                  <DollarSign className="h-4 w-4 mr-2" /> Make Transfer
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" /> Transaction History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transfer">
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Transfer</CardTitle>
                    <CardDescription>Send money securely to another user</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="receiver">Recipient ID</Label>
                      <div className="flex gap-2">
                        <Input
                          id="receiver"
                          value={receiverId}
                          onChange={(e) => setReceiverId(e.target.value)}
                          className="font-mono"
                          disabled
                        />
                        <Button variant="outline" onClick={generateRandomReceiverId} type="button">
                          Randomize
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleTransfer}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          Transfer Funds <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your past transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionHistory transactions={transactions} userId={userId} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.slice(-3).reverse().map((transaction) => (
                      <div key={transaction.id} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Transfer of ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No recent transactions
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => document.querySelector('[value="history"]')?.dispatchEvent(new Event('click'))}>
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;