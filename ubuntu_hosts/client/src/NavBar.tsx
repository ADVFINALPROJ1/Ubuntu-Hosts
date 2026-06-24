import { Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import { InputInline } from "./SearchBar";
import SideBar from "./SideBar";
import { authClient } from "./lib/auth-client";

const children = <p></p>;

function NavBar() {
  const { data: session,isPending } = authClient.useSession();

  if (isPending) {
  return <div>Checking authentication...</div>; 
}

  return (
    <>
      <div className="nav-bar-container">
        <div className="left_buttons">
          <Link to="/">
            <img src="/word_logo_black.png" alt="Logo" className="nav-logo" />
          </Link>
          <Button variant="link" size="lg">
            Events
          </Button>
          <Button variant="link" size="lg">
            Trending
          </Button>
          <Button variant="link" size="lg">
            About
          </Button>
        </div>

        <div className="right_buttons">
          <InputInline />

          {!session && (
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          )}

          <div className="sidebar-trigger">
            <SideBar children={children} />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
