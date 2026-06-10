# UBUNTU HOSTS

**Premium Event Planning & Management Platform**

A full-stack, production-grade event planning system built with modern web technologies. UBUNTU HOSTS empowers event creators to plan, promote, and execute remarkable experiences — from intimate gatherings to grand productions.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Hono](https://img.shields.io/badge/Hono-4.6-orange)
![Bun](https://img.shields.io/badge/Bun-1.x-black)
![Postgres](https://img.shields.io/badge/Postgres-16-blue)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite, React Router 7 |
| **Backend** | Hono 4 (lightweight API framework), Bun runtime |
| **Database** | PostgreSQL 17.5-Alphine, Drizzle ORM |
| **Auth** | Better-Auth |
| **Container** | Docker & Docker Compose |
| **Payments** | Chapa Payment |
| **QR Code** | QR code generation for ticket check-in |
| **Validation** | Zod schemas |

## Features

### 1. Event Discovery & Display
- Paginated event feed (10+ events per page)
- Sort by date, location, category
- Search with keyword filtering
- Dedicated event detail pages with full information

### 2. Organizer CRUD Operations
- Create events with 5+ mandatory fields (Title, Date, Time, Location, Description)
- Edit and delete events with immediate reflection
- Budget tracking with auto-calculated net balance
- Income/expense line-item tracking

### 3. Registration & Ticketing
- One-click RSVP from event details (3 clicks max)
- Multiple ticket types: Free, VIP, Early Bird, Standard, Table
- Strict capacity enforcement with auto "Sold Out" status
- QR code generation per registration
- Check-in system with reference codes
- CSV export of attendee roster

### 4. System Architecture
- RESTful API (GET, POST, PUT, DELETE)
- Modular monolith design pattern
- Sub-5-second CSV export
- Fully responsive UI (320px to 4K)
- <300ms API response times

### 5. Additional Features
- Sponsor/donor tracking pipeline
- Notification system (in-app)
- User profiles with role management
- Admin dashboard
- Beautiful, modern UI with glassmorphism design

## Project Structure

```
ubuntu-hosts/
├── src/
│   ├── db/                    # Database schema & connection
│   │   ├── schema.ts          # Drizzle ORM schema definitions
│   │   ├── index.ts           # Database client
│   │   └── migrate.ts         # Migration runner
│   ├── middleware/
│   │   └── auth.ts            # Auth middleware (JWT, roles)
│   ├── modules/               # Modular monolith modules
│   │   ├── users/             # Auth, profiles, roles
│   │   ├── events/            # Event CRUD & listing
│   │   ├── tickets/           # Tickets, registrations, check-in
│   │   ├── payments/          # Payment processing
│   │   ├── budget/            # Budget tracking
│   │   └── notifications/     # Notification system
│   └── index.ts               # API entry point
├── frontend/
│   ├── src/
│   │   ├── components/        # Shared components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # API client & auth context
│   │   └── App.tsx            # Root app with routes
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docker/
│   ├── docker-compose.yml     # Production stack
│   └── docker-compose.dev.yml # Development stack
├── Dockerfile
└── package.json
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.x
- [Docker](https://docker.com) & Docker Compose
- [Node.js](https://nodejs.org) >= 20 (for frontend tools)

### Quick Start (Development)

```bash
# 1. Clone and install dependencies
git clone <repo-url> ubuntu-hosts
cd ubuntu-hosts
bun install

# 2. Start PostgreSQL
docker compose up 

# 3. Set up environment
cp .env.example .env
# Edit .env with your settings

# 4. Run database migrations
bun run db:push

# 5. Start backend
bun run dev

# 6. In another terminal, start frontend
cd frontend
bun install
bun run dev
```

Open http://localhost:5173 for the frontend and http://localhost:3000/api/health for the API health check.

### Production Deployment

```bash
# Using Docker Compose
docker compose -f docker/docker-compose.yml up -d

# Or build and run individually
docker build -t ubuntu-hosts .
docker run -p 3000:3000 ubuntu-hosts
```

## API Endpoints

### Auth & Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/auth/signup` | Create account |
| POST | `/api/users/auth/login` | Sign in |
| GET | `/api/users/profile` | Get profile (auth) |
| PUT | `/api/users/profile` | Update profile (auth) |
| GET | `/api/users` | List users (admin) |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (paginated, sortable) |
| GET | `/api/events/:id` | Get event details |
| POST | `/api/events` | Create event (organizer) |
| PUT | `/api/events/:id` | Update event (owner) |
| DELETE | `/api/events/:id` | Delete event (owner) |
| GET | `/api/events/my-events` | My events (organizer) |

### Tickets & Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/event/:eventId` | List tickets for event |
| POST | `/api/tickets` | Create ticket (organizer) |
| POST | `/api/tickets/register` | Register for event (auth) |
| POST | `/api/tickets/check-in` | Check in attendee |
| POST | `/api/tickets/:id/cancel` | Cancel registration |
| GET | `/api/tickets/export/:eventId` | Download CSV (organizer) |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budget/event/:eventId` | List budget items |
| GET | `/api/budget/summary/:eventId` | Budget summary |
| POST | `/api/budget` | Add budget item |
| DELETE | `/api/budget/:id` | Delete item |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `APP_NAME` | Application name |
| `APP_URL` | Backend URL |
| `FRONTEND_URL` | Frontend URL (for CORS) |
| `RESEND_API_KEY` | Resend email API key (optional) |


## Team Members

<li>Abel Mathios</li>
<li>Matiyas Shiferaw</li>
<li>Liul Girma</li>
<li>Segni Gobesa</li>
<li>Siraj Abdulkadir</li>

</br>
</br>
</br>
<p>
<em><strong>Ubuntu Hosts Event Management Platform, 2026</strong></em></p>

UBUNTU HOSTS &copy; 
