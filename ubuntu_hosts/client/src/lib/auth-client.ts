import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://ubuntu-hosts.fly.dev",
});