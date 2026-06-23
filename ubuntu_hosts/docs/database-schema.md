# Database Schema Documentation

## Users Table

| Column | Type | Description |
|---|---|---|
| id | integer | Primary key |
| name | text | User full name |
| email | text | Unique user email |
| password | text | User password |

### Relations
- One user can create many events
- One user can purchase many tickets

---

## Events Table

| Column | Type | Description |
|---|---|---|
| id | integer | Primary key |
| title | text | Event title |
| description | text | Event description |
| date | timestamp | Event date |
| venue | text | Event location |
| capacity | integer | Maximum ticket capacity |

### Relations
- One event can have many tickets
- One event can have many payments

---

## Tickets Table

| Column | Type | Description |
|---|---|---|
| id | integer | Primary key |
| userId | integer | Related user ID |
| eventId | integer | Related event ID |
| quantity | integer | Number of tickets |
| totalPrice | integer | Total payment amount |

### Relations
- Many tickets belong to one user
- Many tickets belong to one event

---

## Payments Table

| Column | Type | Description |
|---|---|---|
| id | integer | Primary key |
| ticketId | integer | Related ticket ID |
| amount | integer | Payment amount |
| status | text | Payment status |

### Relations
- One payment belongs to one ticket