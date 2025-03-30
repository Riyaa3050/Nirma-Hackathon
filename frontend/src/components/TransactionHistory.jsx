import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { 
    ArrowRight, 
    ArrowLeft,
    CheckCircle, 
    Clock, 
    AlertCircle 
  } from "lucide-react";
  import { Badge } from "@/components/ui/badge";
  

  
  export function TransactionHistory({ transactions, userId }) {
    // Reverse transactions to show newest first
    const sortedTransactions = [...transactions].reverse();
  
    if (transactions.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      );
    }
  
    const getStatusBadge = (status) => {
      switch (status) {
        case 'completed':
          return (
            <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" /> Completed
            </Badge>
          );
        case 'pending':
          return (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
              <Clock className="h-3 w-3 mr-1" /> Pending
            </Badge>
          );
        case 'failed':
          return (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" /> Failed
            </Badge>
          );
        default:
          return null;
      }
    };
  
    const getTransactionTypeIcon = (transaction) => {
      if (transaction.senderId === userId) {
        return <ArrowRight className="h-4 w-4 text-red-500" />;
      } else {
        return <ArrowLeft className="h-4 w-4 text-green-500" />;
      }
    };
  
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTransactionTypeIcon(transaction)}
                    <span>
                      {transaction.senderId === userId ? 'Sent' : 'Received'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">
                  {transaction.senderId === userId 
                    ? `→ ${transaction.receiverId.substring(0, 8)}...`
                    : `← ${transaction.senderId.substring(0, 8)}...`}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(transaction.date).toLocaleString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }