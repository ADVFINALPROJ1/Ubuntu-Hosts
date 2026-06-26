import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import EventDetails from "./EventDetails";
import { TableComponent } from "./TableComponent";
import OrganizerDashboard from "./OrganizerDashboard";
import EventForm from "./EventForm";
import PaymentRedirect from "./PaymentRedirect";
import CheckoutReservation from "./components/CheckoutReservation";
import { EventDetailPage } from "./Details";
import OrderSummaryPage from "./components/OrderSummaryPage";

const route = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/details/:id", element: <EventDetailPage /> },
  { path: "/view-dashboard", element: <TableComponent /> },
  { path: "/dashboard", element: <OrganizerDashboard /> },
  { path: "/create-event", element: <EventForm mode="create" /> },
  { path: "/edit-event/:id", element: <EventForm mode="edit" /> },
  { path: "/payment", element: <PaymentRedirect /> },
  { path: "/order-summary", element: <OrderSummaryPage /> },
  { path: "/checkout", element: <CheckoutReservation /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>,
);
