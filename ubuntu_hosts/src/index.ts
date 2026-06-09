import { Hono } from 'hono'
import eventRoutes from './modules/events/events.routes'

const app = new Hono()

app.route('/events', eventRoutes)

app.get('/', (c) => {
  return c.text('Ubuntu Hosts API is running')
})

export default app