import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";

// Replace this with the real Chapa checkout URL when teammate provides it
const CHAPA_CHECKOUT_URL = "https://checkout.chapa.co/checkout/payment";

interface PaymentDetails {
  eventTitle: string;
  amount: number;
  name: string;
  email: string;
  txRef: string;
}

export const PaymentRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Get payment details passed from the registration component
  const details: PaymentDetails = location.state || {
    eventTitle: "Sample Event",
    amount: 500,
    name: "Test User",
    email: "test@example.com",
    txRef: `tx-${Date.now()}`,
  };

  // Once confirmed, start countdown then redirect
  useEffect(() => {
    if (!confirmed) return;

    if (countdown === 0) {
      // Redirect to Chapa checkout
      window.location.href = `${CHAPA_CHECKOUT_URL}?amount=${details.amount}&tx_ref=${details.txRef}&email=${details.email}&first_name=${details.name}`;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [confirmed, countdown, details]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9ff",
        fontFamily: "Arial, sans-serif",
        padding: "1rem",
      }}
    >
      <Card style={{ maxWidth: "480px", width: "100%" }}>
        <CardHeader>
          <CardTitle style={{ fontSize: "1.5rem" }}>
            {confirmed ? "Redirecting to Payment" : "Confirm Payment"}
          </CardTitle>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            {confirmed
              ? "Please wait while we redirect you to Chapa..."
              : "Please review your payment details before proceeding"}
          </p>
        </CardHeader>

        <CardContent>
          {/* Payment Details */}
          <div
            style={{
              backgroundColor: "#f4f4f4",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              opacity: confirmed ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["Event", details.eventTitle],
                ["Name", details.name],
                ["Email", details.email],
                ["Amount", `ETB ${details.amount}`],
                ["Reference", details.txRef],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#666", fontSize: "0.875rem" }}>{label}</span>
                  <span style={{ fontWeight: "bold", fontSize: "0.875rem" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spinner shown after confirmation */}
          {confirmed && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <Loader2
                size={40}
                style={{
                  animation: "spin 1s linear infinite",
                  color: "#4361ee",
                }}
              />
              <p style={{ fontWeight: "bold", color: "#4361ee" }}>
                Redirecting to Payment Gateway in {countdown}...
              </p>
              <p style={{ fontSize: "0.75rem", color: "#666", textAlign: "center" }}>
                You will be taken to Chapa's secure checkout page. Do not close this window.
              </p>
            </div>
          )}

          {/* Buttons */}
          {!confirmed && (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button
                onClick={() => setConfirmed(true)}
                style={{ flex: 1, backgroundColor: "#4361ee" }}
              >
                Confirm & Pay ETB {details.amount}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentRedirect;