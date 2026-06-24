import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { TableRow, TableCell } from "./components/ui/table";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

type EntryType = "income" | "expense";

interface LedgerEntry {
  id: string;
  description: string;
  type: EntryType;
  amount: number;
}
export const TableComponent = () => {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
const [draft, setDraft] = useState({ description: "", type: "income", amount: "" });
const totalIncome  = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
const netBalance   = totalIncome - totalExpense;
    const handleDelete = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
    return (
        <>  
        <Card className={netBalance >= 0 ? "border-green-500" : "border-red-500"}>
  <CardContent className="flex justify-between items-center p-4">
    <span className="text-muted-foreground text-sm">Net Balance</span>
    <span className={`text-2xl font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
      ${netBalance.toFixed(2)}
    </span>
  </CardContent>
</Card>
<TableRow>
  <TableCell><Input placeholder="Description…" value={draft.description}  /></TableCell>
  <TableCell>
    <select value={draft.type} >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </TableCell>
  <TableCell><Input type="number" placeholder="0.00" value={draft.amount}  /></TableCell>
  <TableCell><Button >Add</Button></TableCell>
</TableRow>
</>
    )
}