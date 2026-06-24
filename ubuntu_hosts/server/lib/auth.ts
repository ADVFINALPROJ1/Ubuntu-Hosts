import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "../db/db";
import { accountVerificationMail } from "./email";
import { openAPI } from "better-auth/plugins"
import * as schema from "../db/schema";


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema,
    }),
  emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
      void accountVerificationMail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  trustedOrigins: ["http://localhost:5173"],
   user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "attendee",
        input: true,
      },
    },
  },
  plugins: [
        openAPI(), 
    ]
});