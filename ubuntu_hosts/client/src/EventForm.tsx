import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { toast } from "sonner";
import NavBar from "./NavBar";

// ── API base URL ─────────────────────────────────────────────────────────────
if (!import.meta.env.APP_ENV) {
  throw new Error("There is no VITE_APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

// ── Category enum ─────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  "CONCERT",
  "CONFERENCE",
  "WORKSHOP",
  "NETWORKING",
  "FESTIVAL",
  "SPORTS",
  "EXHIBITION",
  "WEBINAR",
  "SOCIAL_GATHERING",

  // Tech & Professional
  "HACKATHON",
  "MEETUP",
  "SEMINAR",
  "KEYNOTE",
  "PANEL_DISCUSSION",
  "JOB_FAIR",
  "PRODUCT_LAUNCH",

  // Entertainment & Culture
  "LIVE_MUSIC",
  "COMEDY_SHOW",
  "THEATER_ART",
  "NIGHTLIFE_PARTY",
  "FOOD_DRINK",
  "MOVIE_SCREENING",
  "GAMING_TOURNAMENT",

  // Fallback
  "OTHER",
] as const;

type Category = (typeof CATEGORY_OPTIONS)[number];

// ── Types ────────────────────────────────────────────────────────────────────
interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number | "";
  description: string;
  price: number | "";
  category: Category | "";
  is_rsvp_required: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────
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
    price: "",
    category: "",
    is_rsvp_required: false,
  });

  // Fetch existing event data when editing
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
            price: e.price,
            category: e.category,
            is_rsvp_required: e.is_rsvp_required,
          });
        })
        .catch(() => toast.error("Failed to load event"))
        .finally(() => setFetching(false));
    }
  }, [mode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? target.checked
          : name === "capacity" || name === "price"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const validate = (): boolean => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!form.date) {
      toast.error("Date is required");
      return false;
    }
    if (!form.time) {
      toast.error("Time is required");
      return false;
    }
    if (!form.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    if (form.capacity === "" || Number(form.capacity) < 0) {
      toast.error("Capacity must be a valid non-negative number");
      return false;
    }
    if (form.price === "" || Number(form.price) < 0) {
      toast.error("Price must be a valid non-negative number");
      return false;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const url =
      mode === "create" ? `${API}/events` : `${API}/events/${id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
          price: Number(form.price),
        }),
      });

      if (res.ok) {
        toast.success(
          mode === "create"
            ? "Event created successfully"
            : "Event updated successfully"
        );
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
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>Loading event...</p>
    );
  }

  return (
    <>
      <NavBar />
      <div
        style={{
          padding: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "1.5rem" }}>
              {mode === "create" ? "Create New Event" : "Edit Event"}
            </CardTitle>
            <p style={{ color: "#666", fontSize: "0.875rem" }}>
              {mode === "create"
                ? "Fill in the details to create a new event"
                : "Update the event details below"}
            </p>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Full-Stack Developer Meetup 2026"
                  value={form.title}
                  onChange={handleChange}
                  style={{ marginTop: "0.25rem" }}
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">
                  Date <span style={{ color: "red" }}>*</span>
                </Label>
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
                <Label htmlFor="time">
                  Time <span style={{ color: "red" }}>*</span>
                </Label>
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
                <Label htmlFor="location">
                  Location <span style={{ color: "red" }}>*</span>
                </Label>
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
                <Label htmlFor="capacity">
                  Capacity <span style={{ color: "red" }}>*</span>
                </Label>
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

              {/* Price */}
              <div>
                <Label htmlFor="price">
                  Price <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g. 200"
                  value={form.price}
                  onChange={handleChange}
                  style={{ marginTop: "0.25rem" }}
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">
                  Category <span style={{ color: "red" }}>*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value as Category,
                    }))
                  }
                  style={{
                    marginTop: "0.25rem",
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "0.875rem",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* is_rsvp_required — boolean → checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  id="is_rsvp_required"
                  name="is_rsvp_required"
                  type="checkbox"
                  checked={form.is_rsvp_required}
                  onChange={handleChange}
                  style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                />
                <Label htmlFor="is_rsvp_required" style={{ cursor: "pointer" }}>
                  Reservation (RSVP) required
                </Label>
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
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Event"
                    : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EventForm;