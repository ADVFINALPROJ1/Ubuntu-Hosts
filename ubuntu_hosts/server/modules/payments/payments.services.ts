import { v4 as uuidv4 } from "uuid";
import { db } from "../../db/db";
import { registrations } from "./payments.schemas";
import { eq } from "drizzle-orm";

export const initializePayment = async (paymentData: {
  event_id: number;
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
}) => {
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
        callback_url: "https://yourdomain.com/payment/callback",
        return_url: "https://yourfrontend.com/payment-success",
        customization: {
          title: "Ticket Payment",
          description: "Payment for event ticket",
        },
      }),
    }
  );

  const data = await chapaResponse.json();

  // Log Chapa's response so we can debug
  console.log("Chapa response:", JSON.stringify(data, null, 2));

  if (!data || !data.data || !data.data.checkout_url) {
    throw new Error(
      `Chapa error: ${data?.message ?? "No checkout URL returned"}`
    );
  }

  // Save registration as "pending" in the DB
  await db.insert(registrations).values({
    event_id: paymentData.event_id,
    first_name: paymentData.first_name,
    last_name: paymentData.last_name,
    email: paymentData.email,
    amount: paymentData.amount,
    tx_ref,
    payment_status: "pending",
  });

  return {
    checkout_url: data.data.checkout_url,
    tx_ref,
  };
};

export const verifyPayment = async (tx_ref: string) => {
  const chapaResponse = await fetch(
    `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

  if (!chapaResponse.ok) {
    throw new Error("Failed to reach Chapa verification API");
  }

  const chapaData = await chapaResponse.json();

  console.log("Chapa verify response:", JSON.stringify(chapaData, null, 2));

  const status: string = chapaData?.data?.status;

  if (status === "success") {
    await db
      .update(registrations)
      .set({ payment_status: "paid" })
      .where(eq(registrations.tx_ref, tx_ref));

    return {
      verified: true,
      status: "paid",
      message: "Payment verified and registration updated successfully.",
    };
  }

  return {
    verified: false,
    status: status ?? "unknown",
    message: "Payment has not been confirmed as successful.",
  };
};
