import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { toast } from "sonner";

const API = "http://localhost:3000";

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number | "";
  description: string;
}

export const EventForm = ({ mode }: { mode: "create" | "edit" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === "edit");

  const [form, setForm] = useState<EventFormData>({
    title: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    description: "",
  });

  // If editing, fetch the existing event data
  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`${API}/events/${id}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const e = data.event;
          setForm({
            title: e.title,
            date: e.date,
            time: e.time,
            location: e.location,
            capacity: e.capacity,
            description: e.description,
          });
        })
        .catch(() => toast.error("Failed to load event"))
        .finally(() => setFetching(false));
    }
  }, [mode, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validate = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return false; }
    if (!form.date) { toast.error("Date is required"); return false; }
    if (!form.time) { toast.error("Time is required"); return false; }
    if (!form.location.trim()) { toast.error("Location is required"); return false; }
    if (form.capacity === "" || Number(form.capacity) < 0) { toast.error("Capacity must be a valid number"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const url = mode === "create" ? `${API}/events` : `${API}/events/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });

      if (res.ok) {
        toast.success(mode === "create" ? "Event created successfully" : "Event updated successfully");
        navigate("/dashboard");
      } else if (res.status === 403) {
        toast.error("You do not have permission to perform this action");
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Loading event...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: "1.5rem" }}>
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </CardTitle>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            {mode === "create" ? "Fill in the details to create a new event" : "Update the event details below"}
          </p>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title <span style={{ color: "red" }}>*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Anbesa Beer Festival 2026"
                value={form.title}
                onChange={handleChange}
                style={{ marginTop: "0.25rem" }}
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date <span style={{ color: "red" }}>*</span></Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                style={{ marginTop: "0.25rem" }}
              />
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time">Time <span style={{ color: "red" }}>*</span></Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                style={{ marginTop: "0.25rem" }}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location <span style={{ color: "red" }}>*</span></Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Addis Ababa, Millennium Hall"
                value={form.location}
                onChange={handleChange}
                style={{ marginTop: "0.25rem" }}
              />
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Capacity <span style={{ color: "red" }}>*</span></Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="e.g. 200"
                value={form.capacity}
                onChange={handleChange}
                style={{ marginTop: "0.25rem" }}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the event..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={{
                  marginTop: "0.25rem",
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e2e8f0",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <Button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                {loading ? "Saving..." : mode === "create" ? "Create Event" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")} style={{ flex: 1 }}>
                Cancel
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;