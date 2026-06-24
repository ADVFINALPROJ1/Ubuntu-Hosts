import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { ChevronDown, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { toast, Toaster } from "sonner";

const Events = [
  {
    name: "Event One",
    url: "/event-one",
    icon: () => <Plus />,
  },
  {
    name: "Event Two",
    url: "/event-two",
    icon: () => <Plus />,
  },
];

export function AppSidebar() {
  const { data: session,isPending } = authClient.useSession();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          toast("Loggin Out");
        },
        onSuccess: () => {
          navigate("/");
          toast("Logged Out!!!");
        },
        onError: (ctx) => {
          alert(ctx.error.message || "Failed to log out.");
        },
      },
    })};

    if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Verifying session...</p>
      </div>
    );
  }

    return (
      <>
        <Toaster />
        <Sidebar>
          {/* Sidebar Header */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                {session && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        gap: "10px",
                      }}
                    >
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcnf.png" />
                        <AvatarFallback>{session.user.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div style={{ display: "block", flexDirection: "row" }}>
                        <Badge variant="ghost">{session.user.name}</Badge>
                        <div></div>
                        <Badge variant="outline">{session.user.email}</Badge>
                      </div>
                    </div>
                  </>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <Separator />

          {/* Sidebar Content */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Create an Event</SidebarGroupLabel>
              <Link to="/view-dashboard">Dashboard</Link>
              <SidebarGroupAction>
                <Plus /> <span className="sr-only">Add Project</span>
              </SidebarGroupAction>
              <SidebarGroupContent></SidebarGroupContent>
            </SidebarGroup>

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    Help
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent />
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <SidebarMenu>
              {Events.map((event) => (
                <SidebarMenuItem key={event.name}>
                  <SidebarMenuButton asChild>
                    <a href={event.url}>
                      <event.icon />
                      <span>{event.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          {/* // Sidebar Footer */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  style={{ display: "flex", justifyContent: "right" }}
                >
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </>
    );
  };
