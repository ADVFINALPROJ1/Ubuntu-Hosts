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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { authClient } from "./lib/auth-client";
import React from "react";

export function SignUp() {
  const navigate = useNavigate();

  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    await authClient.signUp.email(
      {
        email: email,
        password: password,
        name: name,
        role: role,
      },
      {
        onRequest: () => {},
        onSuccess: () => {
          toast.success("User created successfully!");
          navigate("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Error creating user.");
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
            <CardTitle>Sign up for an account</CardTitle>
            <CardDescription>
              Enter your email below to create an account
            </CardDescription>
            <CardAction>
              <Link to="/login">
                <Button variant="link">Login</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <form onSubmit={sendForm}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
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
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    required
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={async () => {
                  await authClient.signIn.social({ provider: "google" });
                }}
              >
                Sign up with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}