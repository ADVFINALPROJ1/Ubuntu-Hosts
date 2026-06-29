import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import EventDetails from "./EventDetails";
import OrganizerDashboard from "./OrganizerDashboard";
import EventForm from "./EventForm";
import PaymentRedirect from "./PaymentRedirect";
import CheckoutReservation from "./components/CheckoutReservation";
import OrderSummaryPage from "./components/OrderSummaryPage";
import { Toaster } from "sonner";
import UserDashboard from "./UserDashboard";

const route = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/details/:id", element: <EventDetails/> },
  { path: "/view-dashboard", element: <UserDashboard /> },
  { path: "/dashboard", element: <OrganizerDashboard /> },
  { path: "/create-event", element: <EventForm mode="create" /> },
  { path: "/edit-event/:id", element: <EventForm mode="edit" /> },
  { path: "/payment", element: <PaymentRedirect /> },
  { path: "/order-summary", element: <OrderSummaryPage /> },
  { path: "/checkout", element: <CheckoutReservation /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster/>
    <RouterProvider router={route} />
  </StrictMode>,
);
