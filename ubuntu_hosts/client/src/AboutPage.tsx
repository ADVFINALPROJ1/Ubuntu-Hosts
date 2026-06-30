import NavBar from "./NavBar";
import Footer  from "./Footer";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Users, Sparkles, Target, Heart } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To make discovering and attending great events as effortless as scrolling your feed — connecting people with the experiences that matter to them.",
  },
  {
    icon: Sparkles,
    title: "What We Believe",
    text: "Real connection happens offline. We build tools that get people out of their inboxes and into rooms with other people.",
  },
  {
    icon: Heart,
    title: "How We Work",
    text: "Small team, high craft. We obsess over the small details that make booking an event feel simple instead of stressful.",
  },
];

const TEAM = [
  { name: "Abel Mathios",   role: "Founder",        initials: "AM",  github:"https://github.com/ABELMATHIOS"},
  { name: "Matiyas Shiferaw",   role: "Founder",      initials: "MS", github:"https://github.com/matbits116"},
  { name: "Liul Girma",  role: "Founder",        initials: "LG", github:"https://github.com/liul55"},
  { name: "Segni Gobesa",    role: "Founder",         initials: "SG", github:"https://github.com/segni53"},
  { name: "Siraj Abdulkadir",    role: "Founder", initials: "SA", github:"https://github.com/Siraj-Abdulkadir"},
];

export default function AboutPage() {
  return (
    <>
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          About Us
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          We're building the easiest way <br className="hidden sm:block" />
          to find events worth going to.
        </h1>
        <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
          What started as a small side project to help friends find local
          meetups has grown into a platform connecting thousands of people
          with the events that shape their week.
        </p>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="ring-1 ring-foreground/10">
              <CardContent className="px-6 py-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </CardContent>
            </Card>
          ))}

          <Card className="ring-1 ring-foreground/10 sm:col-span-1">
            <CardContent className="px-6 py-2 flex flex-col justify-center h-full">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">Our Story</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Founded in Addis Ababa, our team noticed how scattered event
                discovery was — buried in group chats, flyers, and word of
                mouth. We set out to put it all in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Meet the team
          </h2>
          <p className="text-muted-foreground mt-2">
            A small group of people who care a lot about good events.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {TEAM.map(({ name, role, initials,github }) => (
            <div key={name} className="flex flex-col items-center text-center gap-3">
              <div className="h-20 w-20 rounded-full bg-muted ring-1 ring-foreground/10 flex items-center justify-center text-lg font-semibold">
                {initials}
              </div>
              <div>
                <a target="_blank" href={github}>
                <p className="font-medium text-sm">{name}</p>
                </a>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}