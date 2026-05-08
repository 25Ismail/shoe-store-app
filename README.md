# Shoe Store App

An online shoe store where customers can browse products, see size availability, get fit recommendations based on community feedback, and place orders.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Tokens)

## Project structure

```
shoe-store-app/
  client/   React frontend
  server/   Express backend
```

## Setup

### 1. Install dependencies

```bash
# In the server folder
cd server && npm install

# In the client folder
cd client && npm install
```

### 2. Create environment files

Create `server/.env`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:3000
```

### 3. Seed the database

Run this once to add the starter products:

```bash
cd server && npm run seed
```

## Running the app

Start the backend:

```bash
cd server && npm run dev
```

Start the frontend (in a separate terminal):

```bash
cd client && npm run dev
```

The app runs at `http://localhost:5173`.

## Features

- Browse shoes with stock per size
- Fit information (runs small, true to size, etc.)
- Community fit feedback — buyers vote on how the shoe fits
- Size suggestion based on your order history
- Add to cart, adjust quantities, remove items
- Create an account or sign in to place orders
- After an order, you can rate how each shoe fit
