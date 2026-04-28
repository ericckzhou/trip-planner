# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "savedTrips": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Profile
```http
PUT /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Smith"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "Jonathan",
    "lastName": "Smith"
  }
}
```

---

### 🌍 Destinations

#### Search Destination
```http
GET /destinations/search?city=Paris
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "destination": {
      "name": "Paris",
      "lat": 48.8566,
      "lng": 2.3522,
      "formattedAddress": "Paris, France"
    },
    "weather": {
      "temp": 15,
      "feelsLike": 13,
      "humidity": 65,
      "description": "partly cloudy",
      "icon": "02d"
    },
    "attractions": [
      {
        "id": "ChIJ1...",
        "name": "Eiffel Tower",
        "address": "5 Avenue Anatole France, 75007 Paris",
        "rating": 4.7,
        "lat": 48.8584,
        "lng": 2.2945,
        "photo": "Aap_uE..."
      }
    ]
  }
}
```

#### Get Trending Destinations
```http
GET /destinations/trending?limit=10
```

**Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paris",
      "country": "France",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "popularity": 145,
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ]
}
```

#### Get Destination Details
```http
GET /destinations/507f1f77bcf86cd799439011
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "destination": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paris",
      "country": "France",
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "weather": {...},
    "attractions": [...]
  }
}
```

---

### ✈️ Trips

#### Create Trip
```http
POST /trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paris Summer Vacation",
  "destination": "Paris",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "description": "Two weeks exploring Paris and surrounding regions",
  "destinationLat": 48.8566,
  "destinationLng": 2.3522
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "_id": "507f2f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Paris Summer Vacation",
    "destination": "Paris",
    "startDate": "2024-06-01",
    "endDate": "2024-06-15",
    "description": "Two weeks exploring Paris and surrounding regions",
    "itinerary": [],
    "status": "planning",
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All User Trips
```http
GET /trips
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): "planning", "ongoing", or "completed"

**Response (200)**:
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get Specific Trip
```http
GET /trips/507f2f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "507f2f77bcf86cd799439012",
    "title": "Paris Summer Vacation",
    "destination": "Paris",
    "startDate": "2024-06-01",
    "endDate": "2024-06-15",
    "itinerary": [...]
  }
}
```

#### Update Trip
```http
PUT /trips/507f2f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Paris Extended",
  "status": "ongoing",
  "description": "Extended to 3 weeks"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {...}
}
```

#### Delete Trip
```http
DELETE /trips/507f2f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

---

### 📅 Itinerary

#### Add Itinerary Item
```http
POST /trips/507f2f77bcf86cd799439012/itinerary
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Visit Eiffel Tower",
  "description": "Climb to the top",
  "date": "2024-06-02",
  "time": "10:00",
  "location": "5 Avenue Anatole France, Paris",
  "category": "activity",
  "notes": "Book tickets online in advance",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "estimatedCost": 25
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Itinerary item added successfully",
  "data": {
    "_id": "507f2f77bcf86cd799439012",
    "itinerary": [
      {
        "_id": "507f3f77bcf86cd799439013",
        "title": "Visit Eiffel Tower",
        "date": "2024-06-02",
        "time": "10:00",
        "location": "5 Avenue Anatole France, Paris",
        "category": "activity"
      }
    ]
  }
}
```

#### Update Itinerary Item
```http
PUT /trips/507f2f77bcf86cd799439012/itinerary/507f3f77bcf86cd799439013
Authorization: Bearer <token>
Content-Type: application/json

{
  "time": "09:00",
  "notes": "Arrive early to skip crowds"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Itinerary item updated successfully",
  "data": {...}
}
```

#### Delete Itinerary Item
```http
DELETE /trips/507f2f77bcf86cd799439012/itinerary/507f3f77bcf86cd799439013
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Itinerary item deleted successfully",
  "data": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Trip not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Rate Limiting

The API does not have rate limiting in development. In production, implement:
- 100 requests per hour per IP for public endpoints
- 1000 requests per hour per user for authenticated endpoints

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","firstName":"John","lastName":"Doe"}'
```

### Search Destination
```bash
curl http://localhost:5000/api/destinations/search?city=Tokyo
```

### Create Trip
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Tokyo Adventure",
    "destination":"Tokyo",
    "startDate":"2024-07-01",
    "endDate":"2024-07-10"
  }'
```

---

## Changelog

### v1.0.0 (Initial Release)
- User authentication with JWT
- Destination search with weather and attractions
- Trip CRUD operations
- Itinerary management
- Trip status tracking
