# Architecture & Design Decisions

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Port 3000)                  │   │
│  │  - Components (Navbar, Cards, Forms)                    │   │
│  │  - Pages (Home, Dashboard, Explore, Trip Detail)        │   │
│  │  - Context API (Auth, Trip State Management)            │   │
│  │  - Tailwind CSS (Responsive Styling)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP/REST API
┌──────────────────────────▼───────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Express.js Server (Port 5000)                 │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Routes (Auth, Trips, Destinations)                ││   │
│  │  │  - authRoutes.js                                   ││   │
│  │  │  - tripRoutes.js                                   ││   │
│  │  │  - destinationRoutes.js                            ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Controllers (Business Logic)                      ││   │
│  │  │  - authController.js                               ││   │
│  │  │  - tripController.js                               ││   │
│  │  │  - destinationController.js                        ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Services (Data Operations)                        ││   │
│  │  │  - authService.js                                  ││   │
│  │  │  - tripService.js                                  ││   │
│  │  │  - destinationService.js                           ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │  Middleware & Utils                                ││   │
│  │  │  - auth.js (JWT verification)                      ││   │
│  │  │  - errorHandler.js (Global error handling)         ││   │
│  │  │  - validation.js (Input validation)                ││   │
│  │  │  - tokenUtils.js                                   ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┬────────────────────┘
                   │                          │
    ┌──────────────▼──────────┐    ┌─────────▼──────────────┐
    │  DATA LAYER             │    │  EXTERNAL APIs         │
    │  ┌────────────────────┐ │    │  ┌──────────────────┐ │
    │  │  MongoDB           │ │    │  │ OpenWeather API  │ │
    │  │  ┌──────────────┐  │ │    │  │ Google Places    │ │
    │  │  │ Users Col.   │  │ │    │  │ Mapbox (opt)     │ │
    │  │  │ Trips Col.   │  │ │    │  └──────────────────┘ │
    │  │  │ Destinations │  │ │    │   ┌──────────────────┐ │
    │  │  │ Col.         │  │ │    │  │ Node-Cache       │ │
    │  │  └──────────────┘  │ │    │  │ (Caching Layer)  │ │
    │  │  (Mongoose ORM)    │ │    │  └──────────────────┘ │
    │  └────────────────────┘ │    │                        │
    └────────────────────────┘    └────────────────────────┘
```

## Design Patterns Used

### 1. MVC (Model-View-Controller)
- **Models**: Mongoose schemas in `models/`
- **Views**: React components in `components/` and `pages/`
- **Controllers**: Express handlers in `controllers/`

### 2. Service Layer Pattern
- Business logic separated in `services/`
- Controllers delegate to services
- Improves testability and reusability

### 3. Repository Pattern (via Mongoose)
- Mongoose acts as ORM/ODM
- Abstracts database queries
- Easy to mock for testing

### 4. Middleware Pattern
- Authentication middleware (`auth.js`)
- Error handling middleware (`errorHandler.js`)
- Validation middleware (`validation.js`)

### 5. Context API Pattern (Frontend)
- Global state without Redux
- AuthContext for user auth
- TripContext for trip management
- Custom hooks for consumption

## Key Architectural Decisions

### 1. State Management: Context API vs Redux

**Chosen: Context API**

| Aspect | Context API | Redux |
|--------|-------------|-------|
| Setup | Simple | Complex |
| Boilerplate | Minimal | Extensive |
| Learning Curve | Easy | Steep |
| App Size | Medium | Large |
| Team Size | Small-Medium | Large |

**Why Context API**:
- Medium-sized application doesn't need Redux complexity
- Easier onboarding for new developers
- Sufficient for current requirements
- Can migrate to Redux later if needed

### 2. Database Design

**Single Database Approach**:
```
MongoDB
├── Users Collection
│   ├── _id (ObjectId)
│   ├── email (String, unique)
│   ├── password (String, hashed)
│   ├── firstName, lastName
│   ├── savedTrips (Array of Trip IDs)
│   └── createdAt, lastLogin
│
├── Trips Collection
│   ├── _id (ObjectId)
│   ├── userId (ObjectId, ref: User)
│   ├── title, destination
│   ├── startDate, endDate
│   ├── itinerary (Array of Objects)
│   │   ├── _id
│   │   ├── title, description
│   │   ├── date, time, location
│   │   ├── category (activity|meal|transport|accommodation)
│   │   └── estimatedCost
│   ├── budget (currency, estimated, spent)
│   ├── status (planning|ongoing|completed)
│   └── createdAt, updatedAt
│
└── Destinations Collection
    ├── _id (ObjectId)
    ├── name, country
    ├── latitude, longitude
    ├── popularity (counter)
    └── createdAt
```

**Why Nested Itinerary in Trip**:
- Itinerary only makes sense within a trip context
- Reduces queries needed
- Simpler relationships
- Common MongoDB pattern (One-to-Many)

### 3. API Caching Strategy

**Implementation: node-cache**

```
Request Flow:
1. Check node-cache for key
2. If found: return cached result
3. If not: call external API
4. Cache result (1-hour TTL)
5. Return result

Benefits:
- Reduces API calls (cost)
- Faster responses
- Handles API rate limits
```

**Cache Keys**:
- `weather_<lat>_<lng>`
- `attractions_<lat>_<lon>_<keyword>`
- `geocode_<city-name>`

### 4. Authentication Flow

```
Registration:
1. Validate input
2. Hash password with bcryptjs (10 salt rounds)
3. Save user to DB
4. Generate JWT token (30-day expiry)
5. Return token + user data

Login:
1. Find user by email
2. Compare password with hash
3. Generate new JWT token
4. Update lastLogin timestamp
5. Return token + user data

Protected Endpoints:
1. Extract token from Authorization header
2. Verify token signature
3. Decode token to get user ID
4. Fetch user from DB
5. Attach user to request object
6. Proceed to controller
```

### 5. Error Handling Strategy

```
Try-Catch-Next Pattern:
1. Controller receives request
2. Try to execute logic
3. Catch errors, pass to next()
4. Global error handler formats response
5. Return standardized error JSON

Middleware Chain:
Request → Validation → Auth → Controller → Error Handler → Response
```

## Performance Optimizations

### Backend
1. **Database**: Indexes on email, userId
2. **Caching**: 1-hour TTL for external APIs
3. **Mongoose Lean**: Use `.lean()` for read-only queries
4. **Async/Await**: Non-blocking operations
5. **Error Handling**: Prevents server crashes

### Frontend
1. **Code Splitting**: Routes lazy-loaded with React Router
2. **Context Optimization**: Separate contexts prevent unnecessary re-renders
3. **CSS**: Tailwind CSS purging removes unused styles
4. **API Client**: Axios instance reuse, interceptors
5. **Form Validation**: Client-side reduces server hits

## Security Measures

### Authentication & Authorization
- ✅ JWT tokens with 30-day expiry
- ✅ Password hashing (bcryptjs, 10 rounds)
- ✅ Authorization checks (user ownership of trips)
- ✅ 401 errors for unauthorized access

### Input Validation
- ✅ express-validator on server
- ✅ HTML5 validation on client
- ✅ Sanitization of inputs

### API Security
- ✅ CORS enabled (only allow frontend origin)
- ✅ Environment variables for secrets
- ✅ No sensitive data in responses
- ✅ HTTP-only cookies recommended for production

### Database Security
- ✅ Mongoose schema validation
- ✅ Password never returned in queries
- ✅ MongoDB Atlas IP whitelist
- ✅ Connection string in environment variables

## Scalability Considerations

### Current Bottlenecks
1. Single MongoDB instance
2. No horizontal scaling
3. In-memory caching (node-cache)
4. No load balancing

### Future Improvements
1. **Database**: Redis for distributed caching
2. **Queuing**: Bull/RabbitMQ for async tasks
3. **Load Balancing**: Nginx/HAProxy
4. **Microservices**: Separate user/trip/search services
5. **CDN**: CloudFlare for static assets
6. **Database Sharding**: By userId for large scale

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- React hooks

### Integration Tests
- API endpoints with test database
- Frontend components with Context

### E2E Tests
- Full user flows
- Cypress or Playwright

## Deployment Architecture

```
Development:
localhost:3000 (React) → localhost:5000 (Express) → MongoDB Local

Staging:
vercel.com (React) → herokuapp.com (Express) → MongoDB Atlas

Production:
vercel.com (React) → herokuapp.com (Express) → MongoDB Atlas
  + CDN (CloudFlare)
  + Error tracking (Sentry)
  + Analytics (Google Analytics)
```

## File Organization Philosophy

### Backend
- **config/**: External integrations
- **models/**: Data schemas
- **controllers/**: Request handlers
- **services/**: Business logic
- **middleware/**: Reusable request processing
- **routes/**: Endpoint definitions
- **utils/**: Helper functions

### Frontend
- **components/**: Reusable UI pieces
- **pages/**: Full page views
- **context/**: State management
- **hooks/**: Custom React logic
- **services/**: API communication
- **utils/**: Helper functions

## Lessons Learned & Best Practices

1. ✅ Separate concerns (controllers, services, models)
2. ✅ Use middleware for cross-cutting concerns
3. ✅ Validate input at API boundaries
4. ✅ Cache expensive operations
5. ✅ Handle errors gracefully
6. ✅ Document APIs thoroughly
7. ✅ Use environment variables for configuration
8. ✅ Keep secrets out of version control
9. ✅ Test at multiple layers
10. ✅ Monitor performance and errors

---

**Clean architecture enables maintainability, testability, and scalability.**
