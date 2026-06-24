import { Hono } from "hono";

import { initializePaymentSchema } from "./payments.schemas";
import { initializePayment } from "./payments.services";

const paymentsRouter = new Hono();

paymentsRouter.post(
  "/initialize",
  async (c) => {
    const body = await c.req.json();

    const validatedData =
      initializePaymentSchema.parse(body);

    const payment =
      await initializePayment(validatedData);

    return c.json(payment, 200);
  }
);

export default paymentsRouter;