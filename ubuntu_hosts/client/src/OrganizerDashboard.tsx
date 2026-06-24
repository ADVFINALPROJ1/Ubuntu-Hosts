import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Pencil, Trash2, Users, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  available_capacity: number;
}

const API = "http://localhost:3000";

export const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all events on load
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/events`);
      const data = await res.json();
      setEvents(data.events);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Determine event status
  const getStatus = (event: Event) => {
    if (event.capacity === 0) return "Active";
    return event.available_capacity === 0 ? "Sold Out" : "Active";
  };

  // Delete event
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API}/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success("Event deleted successfully");
      } else if (res.status === 403) {
        toast.error("You do not have permission to delete this event");
      } else {
        toast.error("Failed to delete event");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include",
    });
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: 0 }}>
            Organizer Dashboard
          </h1>
          <p style={{ color: "#666", marginTop: "0.25rem" }}>
            Manage your events
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button onClick={() => navigate("/create-event")}>
            + Create Event
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={16} style={{ marginRight: "0.5rem" }} />
            Log Out
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem", color: "#666" }}>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{events.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem", color: "#666" }}>Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "green" }}>
              {events.filter((e) => getStatus(e) === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem", color: "#666" }}>Sold Out</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "red" }}>
              {events.filter((e) => getStatus(e) === "Sold Out").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No events found. Create your first event.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const status = getStatus(event);
                  return (
                    <TableRow key={event.id}>
                      <TableCell style={{ fontWeight: "bold" }}>{event.title}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {event.available_capacity} / {event.capacity}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: status === "Active" ? "#16a34a" : "#dc2626",
                            color: "white",
                          }}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/edit-event/${event.id}`)}
                          >
                            <Pencil size={14} style={{ marginRight: "0.25rem" }} />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/attendees/${event.id}`)}
                          >
                            <Users size={14} style={{ marginRight: "0.25rem" }} />
                            Attendees
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 size={14} style={{ marginRight: "0.25rem" }} />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;