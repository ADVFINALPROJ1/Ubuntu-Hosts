import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Point this to your Hono/backend server URL where Better Auth runs
  baseURL: "http://localhost:3000", 
});