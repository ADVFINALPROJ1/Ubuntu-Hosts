import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const API = import.meta.env.APP_ENV === 'production'
  ? import.meta.env.VITE_PRODUCTION_API
  : import.meta.env.VITE_LOCAL_API ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: API,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" }
      }
    })
  ],
});