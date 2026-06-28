import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

let API:string;

if(!import.meta.env.APP_ENV){
  throw new Error("There is no APP_ENV in your env file!!!")
}

if(import.meta.env.APP_ENV === 'production'){
  
  API = import.meta.env.VITE_PRODUCTION_API;
}

 API = import.meta.env.VITE_LOCAL_API;


export const authClient = createAuthClient({
  baseURL:API, 
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" }
      }
    })
  ],
});