import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ArrowRight, Clock, LogOut, DollarSign } from "lucide-react";
import { TransactionHistory } from "@/components/TransactionHistory";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/userSlice";
import axios from "axios";
import BASEURL from "@/lib/Url";
import { CheckCircle } from "lucide-react"; 


const UserDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const storedUserId = user.id;
    const userRole = user.role;

    if (!storedUserId || userRole !== "USER") {
      navigate("/");
      return;
    }

    setUserId(storedUserId);

    async function fetchHistory() {
      const res = await axios.get(`${BASEURL}/transaction/user/history`, {
        withCredentials: true,
      });
      setTransactions(res.data.message);
    }
    fetchHistory();
  }, [navigate]);

  const handleTransfer = async () => {
    try {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (!receiverPhoneNumber) {
        toast.error("Please enter the recipient's phone number");
        return;
      }
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }
      if (!transactionType) {
        toast.error("Please select a transaction type");
        return;
      }

      setIsLoading(true);

      const res = await axios.post(
        `${BASEURL}/transaction`,
        {
          receiverPhone: receiverPhoneNumber,
          amount: Number(amount),
          currency,
          transactionType,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`Successfully transferred $${amount} ${currency} to recipient`);
        setTransactions([...transactions, res.data.message]);
        setAmount("");
        setReceiverPhoneNumber("");
        setCurrency("");
        setTransactionType("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-10">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-medium">User Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-red-100 text-red-700 hover:text-red-800 hover:bg-red-200" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 px-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-muted-foreground">Make secure transactions and view your transaction history</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Your unique user ID and account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm text-muted-foreground">User Name</div>
                  <div className="font-mono font-medium mt-1 flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    {user.name + " - " + user.id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Make Transfer Card */}
            <Card>
              <CardHeader>
                <CardTitle>Make a Transfer</CardTitle>
                <CardDescription>Send money securely to another user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipient Contact Number</Label>
                  <Input
                    placeholder="Contact Number"
                    value={receiverPhoneNumber}
                    onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input
                    type="text"
                    placeholder="USD"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Input
                    type="text"
                    placeholder="Online Payment"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600" onClick={handleTransfer} disabled={isLoading}>
                  {isLoading ? "Processing..." : <>Transfer Funds <ArrowRight className="h-4 w-4 ml-2" /></>}
                </Button>
              </CardFooter>
            </Card>
          </div>

     
          <div>
         

<Card className="h-[64vh] overflow-y-scroll">
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
    <CardDescription>Your latest transactions</CardDescription>
  </CardHeader>
  <CardContent>
    {transactions.length > 0 ? (
      <div className="space-y-4">
        {transactions
        .reverse()
          .map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Transfer of ${transaction.amount.toFixed(2)} {transaction.currency}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.transactionTime).toLocaleString("en-US", { hour12: true })}
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
 
</Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
