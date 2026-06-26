import { Hono } from "hono";
import { initializePaymentSchema, verifyPaymentSchema } from "./payments.schemas";
import { initializePayment, verifyPayment } from "./payments.services";

const paymentsRouter = new Hono();

// POST /api/payments/initialize
paymentsRouter.post("/initialize", async (c) => {
  const body = await c.req.json();
  const validatedData = initializePaymentSchema.parse(body);
  const payment = await initializePayment(validatedData);
  return c.json(payment, 200);
});

// GET /api/payments/verify/:tx_ref
paymentsRouter.get("/verify/:tx_ref", async (c) => {
  const tx_ref = c.req.param("tx_ref");
  const validatedData = verifyPaymentSchema.parse({ tx_ref });
  const result = await verifyPayment(validatedData.tx_ref);
  return c.json(result, 200);
});

export default paymentsRouter;
