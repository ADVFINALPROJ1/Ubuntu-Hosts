import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export function EventCard() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="./event_cover.jpg"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="destructive">June 29</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <div className="sub_header" style={{display:'flex',justifyContent:'left',gap:'2px'}}>
        <MapPin style={{width:'16px',height:'16px'}}/>
        <Badge variant="secondary">Skylight Hotel, Bole</Badge>
        </div>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link to="/details">
          <Button  className="w-full">View Event</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function EventCardPack() {
    return (
         <div className="event" style={{display:'flex', justifyContent:'space-between', padding:'0.5rem 0rem'}}>
         <EventCard />
         <EventCard />
         <EventCard />
        
         </div>
    )
}