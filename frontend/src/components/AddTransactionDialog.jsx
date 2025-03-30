import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddTransactionDialog = ({ open, onOpenChange, onAddTransaction }) => {
  const [transaction, setTransaction] = useState({ receiver: "", purpose: "", amount: "" });

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (transaction.receiver && transaction.purpose && transaction.amount) {
      onAddTransaction(transaction);
      setTransaction({ receiver: "", purpose: "", amount: "" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            name="receiver" 
            placeholder="Receiver" 
            value={transaction.receiver} 
            onChange={handleChange} 
          />
          <Input 
            name="purpose" 
            placeholder="Purpose" 
            value={transaction.purpose} 
            onChange={handleChange} 
          />
          <Input 
            name="amount" 
            type="number" 
            placeholder="Amount" 
            value={transaction.amount} 
            onChange={handleChange} 
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;