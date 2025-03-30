import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, PlusCircle, Search } from "lucide-react";
import { mockTransactions } from "@/data/mockData";
// import { Transaction } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import BASEURL from "@/lib/Url";

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [transactions, setTransactions] = useState(mockTransactions);
  
  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction?.type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? transaction.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    async function fetchHistory() {
      const res = await axios.get(`${BASEURL}/transaction/history`, {
        withCredentials: true,
      });
      const data = res.data.message;
      setTransactions(data);
    }
    fetchHistory();
  })
  
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all transaction records.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-[200px] pl-8 sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("flagged")}>
                    Flagged
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={transaction.status === "flagged" ? "fraud-table-row-flagged" : "fraud-table-row"}
                >
                  <TableCell className="font-medium">{transaction?.user?.name}</TableCell>
                  <TableCell>{new Date(transaction.transactionTime).toLocaleDateString()}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <RiskBadge score={transaction.riskScore} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.status === "flagged"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
                    >
                      {transaction?.type?.charAt(0).toUpperCase() + transaction?.type?.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
