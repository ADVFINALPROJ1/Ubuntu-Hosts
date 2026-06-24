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
import { authClient } from "./lib/auth-client"; // ✅ Import your auth client
import React from "react";

export function SignUp() {
  const navigate = useNavigate();

  // ✅ FIXED: Changed type to standard React.FormEvent
  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // ✅ FIXED: Using Better Auth Client instead of raw Axios
    await authClient.signUp.email(
      {
        email: email,
        password: password,
        name: name,
      },
      {
        onRequest: () => {
          // Optional: handle button loading state here
        },
        onSuccess: () => {
          toast.success("User created successfully!");
          navigate("/"); // Bounces home where useSession() will instantly read the new cookie
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
                <Button variant="link">Login</Button>{" "}
              </Link>
            </CardAction>
          </CardHeader>
          {/* ✅ FIXED: Using standard form tag since onSubmit intercepts the request */}
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