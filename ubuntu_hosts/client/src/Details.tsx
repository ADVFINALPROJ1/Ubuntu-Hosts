import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Badge } from "./components/ui/badge"
import { MapPin, Clock, Users, CalendarDays } from "lucide-react"
import { Button } from "./components/ui/button"

export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  capacity: number
  available_capacity: number
  createdAt: Date
}

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<{ event: Event }>(`https://ubuntu-hosts-5zts.onrender.com/events/${id}`) 
      .then((res) => setEvent(res.data.event))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center mt-10">Loading event...</p>
  if (error)   return <p className="text-center mt-10 text-red-500">Error: {error}</p>
  if (!event)  return <p className="text-center mt-10">Event not found.</p>

  const isSoldOut = event.available_capacity === 0

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <Badge variant="destructive" className="shrink-0">{event.date}</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            {isSoldOut
              ? "Sold out"
              : `${event.available_capacity} of ${event.capacity} spots left`}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">{event.description}</p>

      <Button 
        className="w-full" 
        disabled={isSoldOut}
        onClick={() => navigate(`/checkout?eventId=${event.id}&quantity=1&price=25`)}
      >
        {isSoldOut ? "Sold Out" : "Register for Event"}
      </Button>

    </div>
  )
}