import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { AttendeesModal, type Event } from "./components/AttendeesModal";

type EntryType = "income" | "expense";

interface LedgerEntry {
  id: string;
  description: string;
  type: EntryType;
  amount: number;
}

// Replace this with your real data source / API call
const mockEvents: Event[] = [
  {
    id: "evt_1",
    title: "Annual Gala",
    attendees: [
      { id: "u1", name: "Alice Johnson", registrationDate: "2025-06-01", paymentStatus: "paid" },
      { id: "u2", name: "Bob Smith",     registrationDate: "2025-06-03", paymentStatus: "pending" },
      { id: "u3", name: "Carol White",   registrationDate: "2025-06-05", paymentStatus: "failed" },
    ],
  },
  {
    id: "evt_2",
    title: "Tech Conference",
    attendees: [
      { id: "u4", name: "Dave Brown", registrationDate: "2025-06-10", paymentStatus: "paid" },
      { id: "u5", name: "Eve Davis",  registrationDate: "2025-06-11", paymentStatus: "paid" },
    ],
  },
];

export const TableComponent = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [draft, setDraft] = useState<{ description: string; type: EntryType; amount: string }>({
    description: "",
    type: "income",
    amount: "",
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const totalIncome  = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const netBalance   = totalIncome - totalExpense;

  const handleDelete = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  const handleAdd = () => {
    if (!draft.description || !draft.amount) return;
    setEntries(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: draft.description,
        type: draft.type,
        amount: parseFloat(draft.amount),
      },
    ]);
    setDraft({ description: "", type: "income", amount: "" });
  };

  return (
    <>
      <AttendeesModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

      {/* Net Balance Card */}
      <Card className={netBalance >= 0 ? "border-green-500" : "border-red-500"}>
        <CardContent className="flex justify-between items-center p-4">
          <span className="text-muted-foreground text-sm">Net Balance</span>
          <span className={`text-2xl font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${netBalance.toFixed(2)}
          </span>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell>${entry.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* Add Entry Row */}
          <TableRow>
            <TableCell>
              <Input
                placeholder="Description…"
                value={draft.description}
                onChange={(e) => setDraft(prev => ({ ...prev, description: e.target.value }))}
              />
            </TableCell>
            <TableCell>
              <select
                value={draft.type}
                onChange={(e) => setDraft(prev => ({ ...prev, type: e.target.value as EntryType }))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </TableCell>
            <TableCell>
              <Input
                type="number"
                placeholder="0.00"
                value={draft.amount}
                onChange={(e) => setDraft(prev => ({ ...prev, amount: e.target.value }))}
              />
            </TableCell>
            <TableCell>
              <Button onClick={handleAdd}>Add</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Managed Events — View Attendees */}
      <div className="mt-6 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Managed Events</h2>
        {mockEvents.map((evt) => (
          <div key={evt.id} className="flex items-center justify-between border rounded px-4 py-2">
            <span>{evt.title}</span>
            <Button variant="outline" onClick={() => setSelectedEvent(evt)}>
              View Attendees
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};