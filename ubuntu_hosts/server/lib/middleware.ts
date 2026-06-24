import { createMiddleware } from 'hono/factory'
import { auth } from './auth'

export const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ message: 'Unauthorized — please log in' }, 401)
  }

  c.set('user', session.user)
  await next()
})

export const requireOrganizer = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ message: 'Unauthorized — please log in' }, 401)
  }

  if (session.user.role !== 'organizer') {
    return c.json({ message: 'Forbidden — organizer access required' }, 403)
  }

  c.set('user', session.user)
  await next()
})