import { Link, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import NavBar from "./NavBar";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { authClient } from "./lib/auth-client";
import React from "react";

export function Login() {
  const navigate = useNavigate();


  const sendForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signIn.email(
      {
        email: email,
        password: password,
      },
      {
        onRequest: () => {
          // Optional: Set a loading spinner state here if you want
        },
        onSuccess: () => {
          toast.success("User logged in successfully!");
          navigate("/"); // Safely navigate home with synchronized session states
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Error logging in.");
        },
      }
    );
  };

  return (
    <>
      <Toaster />
      <NavBar />
      <div
        className="card_con"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link to="/signup">
                <Button variant="link">Sign Up</Button>{" "}
              </Link>
            </CardAction>
          </CardHeader>
          <form onSubmit={sendForm}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                type="button"
                onClick={async () => {
                  await authClient.signIn.social({ provider: "google" });
                }}
              >
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}