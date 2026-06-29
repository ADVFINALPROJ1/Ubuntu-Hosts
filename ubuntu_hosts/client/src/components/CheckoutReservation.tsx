import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Navbar from "../NavBar";
import Footer from "../Footer";

const CheckoutReservation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(window.location.search);
  const quantity = Number(queryParams.get("quantity")) || 1;
  const price = Number(queryParams.get("price")) || 25;
  const eventId = Number(queryParams.get("eventId")) || 1;

  const totalUSD = quantity * price;
  const totalETB = totalUSD * 55;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    primaryContact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Frontend Checkout Redirection
   */
  const handlePay = async () => {
    setError(null);

    setLoading(true);

    try {
      const response = await fetch("https://ubuntu-hosts-5zts.onrender.com/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          amount: totalETB,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment initialization failed. Please try again.");
      }

      const data = await response.json();

      if (data.checkout_url) {
        // Redirect to Chapa's secure payment page
        window.location.href = data.checkout_url;
      } else {
        throw new Error("No checkout URL received from server.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Page title block */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold"></h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
        
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left: Customer Information */}
        <div className="flex-1 space-y-4">
          {/* Person info */}
          {/* <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Personal Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Middle Name</label>
                  <input
                    name="middleName"
                    placeholder="Middle Name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Special Service Request</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform shadow" />
                </button>
              </div>
            </CardContent>
          </Card> */}

          {/* Contact Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Contact Details</h2>
                <p className="text-sm text-muted-foreground">
                  Please confirm your contact details so that we can send tickets and update you.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Primary Contact <span className="text-red-500">*</span>
                </label>
                <select
                  name="primaryContact"
                  value={form.primaryContact}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select primary contact</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">
                      🇪🇹 +251
                    </span>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9XXXXXXXX"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <Card className="sticky top-6">
            <CardContent className="p-6 space-y-4">
              {/* Ticket counter */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Tickets</span>
                <div className="flex items-center gap-3">
                  
                  <span className="font-bold">{quantity}</span>
                  
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Total amount</span>
                <span className="font-bold text-xl"> {totalETB.toFixed(2)}</span>
              </div>

              <Separator />

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code (Optional)</label>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter Promo code"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-2">
                <p className="font-medium">Payment Method</p>
                <label className="flex items-center justify-between cursor-pointer rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-lg">✦</span>
                    <span className="font-medium">Chapa</span>
                  </div>
                  <input type="radio" name="payment" defaultChecked className="accent-amber-600" />
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Pay button */}
              <Button
                className="w-full relative"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Pay"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CheckoutReservation;
