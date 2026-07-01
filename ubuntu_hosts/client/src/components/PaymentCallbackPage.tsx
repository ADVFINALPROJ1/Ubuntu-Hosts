import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";

type Status = "loading" | "success" | "failed";

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const queryParams = new URLSearchParams(window.location.search);
  const tx_ref = queryParams.get("tx_ref");

  useEffect(() => {
    if (!tx_ref) {
      setStatus("failed");
      setMessage("No transaction reference found in the URL.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/payments/verify/${tx_ref}`
        );

        if (!response.ok) {
          throw new Error("Verification request failed.");
        }

        const data = await response.json();

        if (data.verified === true) {
          setStatus("success");
          setMessage(data.message || "Payment verified successfully!");
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment could not be verified.");
        }
      } catch (err: any) {
        setStatus("failed");
        setMessage(err.message || "Something went wrong. Please try again.");
      }
    };

    verify();
  }, [tx_ref]);

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border bg-white shadow-sm p-8 space-y-6 text-center">

          {/* Loading */}
          {status === "loading" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-12 w-12 text-amber-500"
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
              </div>
              <h2 className="text-xl font-semibold text-gray-700">
                Verifying your payment...
              </h2>
              <p className="text-sm text-gray-500">
                Please wait while we confirm your transaction.
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-1">
                <h2 className="text-xl font-bold text-green-800">
                  Payment Successful!
                </h2>
                <p className="text-sm text-green-700">{message}</p>
              </div>

              <p className="text-sm text-gray-500">
                Your ticket has been confirmed. Check your email for details.
              </p>

              <button
                onClick={() => navigate("/")}
                className="w-full rounded-md py-2 px-4 text-sm font-medium text-white"
                style={{ backgroundColor: "#D97706" }}
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Failed */}
          {status === "failed" && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </div>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-4 space-y-1">
                <h2 className="text-xl font-bold text-red-800">
                  Payment Failed
                </h2>
                <p className="text-sm text-red-700">{message}</p>
              </div>

              <p className="text-sm text-gray-500">
                Your payment could not be verified. Please try again or contact support.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full rounded-md py-2 px-4 text-sm font-medium text-white bg-red-500"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full rounded-md py-2 px-4 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default PaymentCallbackPage;
