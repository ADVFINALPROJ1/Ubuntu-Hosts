import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { toast } from "sonner";
import { authClient } from "./lib/auth-client";
import { useState, useEffect } from "react";
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
import { Pencil, Ticket, Trash2, Users } from "lucide-react";

interface UserEvent {
  attendee_id: number;
  event_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  registered_at: string;
  price: number;
  category: string;
  isRsvpRequired: boolean;
  imageUrl: string;
}

if (!import.meta.env.APP_ENV) {
  throw new Error("There is no APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

export const UserDashboard = () => {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events/user/${userEmail}`);

        // Ensure data is always an array before setting state
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setEvents(data);
        toast.success("Wellcome to your dashboard :)");
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userEmail]);

  if (loading) return <div>Loading...</div>;
  if (events.length === 0) return <div>No reservations found.</div>;

  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
          margin: "5px",
        }}
      >
        <h1>Registered Events</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No events found. Register your first event.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  return (
                    <TableRow key={event.event_id}>
                      <TableCell style={{ fontWeight: "bold" }}>
                        {event.title}
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.time}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {event.category} / {event.category}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor:
                              event.status === "Registered"
                                ? "#16a34a"
                                : "#dc2626",
                            color: "white",
                          }}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Button variant="outline" size="sm">
                            <Ticket
                              size={14}
                              style={{ marginRight: "0.25rem" }}
                            />
                            View Ticket
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

      <Footer />
    </>
  );
};

export default UserDashboard;
