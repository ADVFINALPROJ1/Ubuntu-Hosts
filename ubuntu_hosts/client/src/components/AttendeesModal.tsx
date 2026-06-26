import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";

export type PaymentStatus = "paid" | "pending" | "failed";

export interface Attendee {
  id: string;
  name: string;
  registrationDate: string;
  paymentStatus: PaymentStatus;
}

export interface Event {
  id: string;
  title: string;
  attendees: Attendee[];
}

interface AttendeesModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
}

const statusVariant: Record<PaymentStatus, "default" | "secondary" | "destructive"> = {
  paid:    "default",
  pending: "secondary",
  failed:  "destructive",
};

export function AttendeesModal({ open, onClose, event }: AttendeesModalProps) {
  const attendees: Attendee[] = event?.attendees ?? [];

  const exportCSV = (): void => {
    const headers = ["Name", "Registration Date", "Payment Status"];
    const rows = attendees.map((a) => [
      a.name,
      new Date(a.registrationDate).toLocaleDateString(),
      a.paymentStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event?.title ?? "attendees"}_attendees.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Attendees — {event?.title}</DialogTitle>
          <Button onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </DialogHeader>

        {attendees.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No attendees registered yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee, idx) => (
                <TableRow key={attendee.id ?? idx}>
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>
                    {new Date(attendee.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[attendee.paymentStatus]}>
                      {attendee.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}