import { config } from "dotenv";
config({ path: ".env" });

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import eventRoutes from './modules/events/events.routes'
import usersRoute from './modules/users/users.routes'
import { auth } from './lib/auth'
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router"
import paymentsRouter from "./modules/payments/payments.routes";
import { serveStatic } from 'hono/bun'

const app = new Hono()

/** * CORS Configuration 
 * Applied globally to all routes, properly allowing credentials and headers
 */
app.use(
  '/*',
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

// Routes
app.route('/events', eventRoutes as any)
app.route('/', usersRoute)
app.route("/api/payments", paymentsRouter);

// Better Auth Endpoint Handler
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

app.post('/logout', async (c) => {
  await auth.api.signOut({
    headers: c.req.raw.headers,
  })
  return c.json({ message: 'Logged out successfully. Redirecting to landing page.' })
})


// React Router integration exports
export async function loader({ request }: LoaderFunctionArgs) {
    return auth.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
    return auth.handler(request)
}

// Serve static files from client build
app.use('/*', serveStatic({ root: './client/dist' }))

// Catch-all: let React Router handle client-side routes
app.get('/*', serveStatic({ path: './client/dist/index.html' }))

export default app
