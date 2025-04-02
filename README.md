# Black Cherie Media Backend

This is the backend server application for Black Cherie Media, built with Node.js and Express.

## Prerequisites

- Node.js (v16.0.0 or newer recommended)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8080
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or if you use yarn:
   ```
   yarn
   ```

## Running the Application

To start the development server with nodemon (auto-restart on file changes):

```
npm start
```

The server will run on the port specified in your `.env` file (default: 8080).

## Project Structure

- `src/controllers/` - Request handlers for routes
- `src/models/` - Mongoose schema models
- `src/routes/` - API route definitions
- `src/middlewares/` - Custom middleware functions
- `src/db/` - Database connection setup
- `src/services/` - Business logic services
- `src/utils/` - Utility functions

## API Documentation

The API exposes endpoints for:
- User authentication (registration, login, Google OAuth)
- Blog post management
- Rich text editing

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- JWT for token-based authorization
- BlockNote server utilities 