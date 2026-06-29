import { Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import { InputInline } from "./SearchBar";
import SideBar from "./SideBar";
import { authClient } from "./lib/auth-client";
import { Plus } from "lucide-react";

const children = <p></p>;

function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const role = session?.user?.role;

  if (isPending) {
    return <div>Checking authentication...</div>;
  }

  return (
      <div className="nav-bar-container">
      {/* Logo */}
      <Link to="/">
        <img src="/word_logo_black.png" alt="Logo" className="nav-logo" />
      </Link>

      {/* Desktop nav links — hidden on mobile */}
      <div className="nav-links">
        <Button variant="link" size="lg">Events</Button>
        <Button variant="link" size="lg">Trending</Button>
        <Button variant="link" size="lg">About</Button>
      </div>

      {/* Right side */}
      <div className="nav-right">
        {/* Search — hidden on small screens */}
        <div className="nav-search">
          <InputInline />
        </div>

        {/* Create button — desktop only */}
        {role === "organizer" && (
          <div className="nav-create">
            <Link to="/create-event">
              <Button>
                <Plus /> Create
              </Button>
            </Link>
          </div>
        )}

        {/* Sign In — desktop only */}
        {!session && (
          <div className="nav-signin">
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        )}

          <div className="sidebar-trigger">
            <SideBar children={children} />
          </div>
         </div>
    </div>
  );
}

export default NavBar;
