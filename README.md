# Travel Planner - MERN Stack Application

A full-stack travel planning web application built with MongoDB, Express, React, and Node.js. Users can search destinations, view real-time weather and attractions, create and manage trip itineraries, and save trips to their accounts.

## Features

### Core Features Implemented

- **User Authentication**: Register, login with JWT tokens, and secure password hashing
- **Destination Search**: Search any city to get real-time weather, attractions, and map location
- **Trip Management**: Create, view, edit, and delete trips with full CRUD operations
- **Itinerary Planning**: Add/edit/delete daily activities with time, location, and notes
- **Trip Dashboard**: View all user trips with filtering by status (planning, ongoing, completed)
- **API Caching**: Optimized API calls with response caching to reduce external API calls
- **Input Validation**: Server-side validation with express-validator and client-side form validation
- **Error Handling**: Global error handler and user-friendly error messages
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

### Backend
- **Node.js + Express.js**: RESTful API server
- **MongoDB + Mongoose**: NoSQL database with schema validation
- **JWT**: Secure token-based authentication
- **bcryptjs**: Password hashing and security
- **express-validator**: Input validation and sanitization
- **axios**: HTTP client for external APIs
- **node-cache**: Response caching

### Frontend
- **React 18**: Modern UI library with hooks
- **React Router v6**: Client-side routing
- **Context API**: State management (no Redux, keeping it simple)
- **Axios**: API client with interceptors
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Toast notifications
- **date-fns**: Date formatting and manipulation

### External APIs
- **OpenWeather API**: Real-time weather data
- **Google Places API**: Location geocoding, attractions, search
- **Mapbox** (optional): Advanced map features

### Running project

- cd backend
- npm install
- cp .env.example .env (fill in)
- npm run dev

- cd ..

- cd frontend
- npm install
- cp .env.example .env
- npm start


<img width="792" height="633" alt="image" src="https://github.com/user-attachments/assets/a515046e-2599-4b90-96b6-ec76edabeef8" />


