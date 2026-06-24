import { v4 as uuidv4 } from "uuid";

export const initializePayment = async (
  paymentData: {
    event_id: number;
    first_name: string;
    last_name: string;
    email: string;
    amount: number;
  }
) => {
  const tx_ref = `tx-${uuidv4()}`;

  const chapaResponse = await fetch(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount: paymentData.amount,
        currency: "ETB",
        email: paymentData.email,
        first_name: paymentData.first_name,
        last_name: paymentData.last_name,
        tx_ref,
        callback_url:
          "https://yourdomain.com/payment/callback",
        return_url:
          "https://yourfrontend.com/payment-success",
        customization: {
          title: "Event Ticket Payment",
          description: "Payment for event ticket",
        },
      }),
    }
  );

  const data = await chapaResponse.json();

  return {
    checkout_url: data.data.checkout_url,
    tx_ref,
  };
};