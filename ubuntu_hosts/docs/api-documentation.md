# API Documentation

# Events Endpoints

---

## GET /events

### Description
Retrieve all events.

### Sample Response

```json
[
  {
    "id": 1,
    "title": "Summer Music Festival",
    "capacity": 100
  }
]
```

---

## GET /events/:id

### Description
Retrieve single event details.

### Sample Response

```json
{
  "id": 1,
  "title": "Summer Music Festival",
  "description": "Outdoor music event",
  "capacity": 100
}
```

---

## POST /events

### Description
Create a new event.

### Sample Request

```json
{
  "title": "Summer Music Festival",
  "description": "Outdoor music event",
  "capacity": 100
}
```

### Sample Response

```json
{
  "message": "Event created successfully"
}
```

---

## PUT /events/:id

### Description
Update existing event.

### Sample Request

```json
{
  "title": "Updated Festival"
}
```

### Sample Response

```json
{
  "message": "Event updated successfully"
}
```

---

## DELETE /events/:id

### Description
Delete event.

### Sample Response

```json
{
  "message": "Event deleted successfully"
}
```