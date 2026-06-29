import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { label: "Events", href: "/" },
    { label: "Trending", href: "/" },
    { label: "Categories", href: "/" },
    { label: "Near Me", href: "/" },
  ],
  Company: [
    { label: "About Us", href: "/" },
    { label: "Careers", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Press", href: "/" },
  ],
  Support: [
    { label: "Help Center", href: "/" },
    { label: "Contact Us", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Twitter", href: "/" },
  { label: "Instagram", href: "/" },
  { label: "LinkedIn", href: "/" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-20">
      {/* Main footer content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3.5rem 1.5rem 2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Link to="/">
              <img
                src="/word_logo_black.png"
                alt="Logo"
                style={{ height: "64px", width: "auto", objectFit: "cover" }}
              />
            </Link>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: "1.65",
                color: "var(--muted-foreground)",
                maxWidth: "260px",
              }}
            >
              Discover and attend events that matter to you. From local meetups
              to city-wide festivals — all in one place.
            </p>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                { icon: Mail, text: "ubuntuhost1@gmail.com" },
                { icon: Phone, text: "+251 927272727" },
                { icon: MapPin, text: "Addis Ababa, Ethiopia" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <Icon size={13} strokeWidth={1.5} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ fontSize: "0.75rem", height: "28px", padding: "0 0.625rem" }}
                  >
                    {label}
                    <ArrowUpRight size={11} strokeWidth={1.5} style={{ marginLeft: "2px" }} />
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--foreground)",
                }}
              >
                {section}
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.55rem", listStyle: "none", padding: 0, margin: 0 }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted-foreground)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--foreground)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--muted-foreground)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 1.75rem" }}>
        <Separator className="mb-5" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
            © {currentYear} Ubuntu Hosts. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link
              to="/"
              style={{
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                textDecoration: "none",
              }}
            >
              Privacy
            </Link>
            <Link
              to="/"
              style={{
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                textDecoration: "none",
              }}
            >
              Terms
            </Link>
            <Link
              to="/"
              style={{
                fontSize: "0.78rem",
                color: "var(--muted-foreground)",
                textDecoration: "none",
              }}
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
