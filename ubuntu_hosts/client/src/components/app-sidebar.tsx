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
import { ChevronDown, LayoutDashboard, Plus } from "lucide-react";
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
import { toast } from "sonner";

export function AppSidebar() {
  const { data: session, isPending } = authClient.useSession();
  const role = session?.user?.role;

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
    });
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Verifying session...</p>
      </div>
    );
  }

  return (
    <>
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
                      <AvatarFallback>
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div style={{ display: "block", flexDirection: "row" }}>
                      <Badge variant="ghost">
                        {session?.user.name || "Couldn't fetch name"}
                      </Badge>
                      <div></div>
                      <Badge variant="outline">
                        {session?.user.email || "Couldn't fetch email"}
                      </Badge>
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

            <Separator />
            <div style={{ margin: "10px" }}>
              {role === "organizer" && (
                <Link to="/dashboard">
                  <div style={{ display: "flex", gap: "10px" }}>
                    <LayoutDashboard />
                    Dashboard
                  </div>
                </Link>
              )}
              {role === "attendee" && (
                <Link to="/view-dashboard">
                  <div style={{ display: "flex", gap: "10px" }}>
                    <LayoutDashboard />
                    Dashboard
                  </div>
                </Link>
              )}
              {!session && (
                <div className="nav-signin">
                  <Link to="/login">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
            <Separator />
            <SidebarGroupAction asChild>
              <Link to="/create-event">
                <Plus /> <span className="sr-only">Add Project</span>
              </Link>
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
        </SidebarContent>

        {/* // Sidebar Footer */}
        <SidebarFooter>
          <SidebarMenu>
            {session && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  style={{ display: "flex", justifyContent: "right" }}
                >
                  <Button
                    className="w-full"
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    Logout
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
