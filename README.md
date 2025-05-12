# EventHub

A React-based frontend for an event booking system, integrated with a backend API.

## Prerequisites

- Node.js (>= 16.x)
- npm (>= 8.x)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eventhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Features

- User authentication (register, login, logout)
- Browse and book events
- View and cancel bookings
- Admin panel for creating, updating, and deleting events
- Responsive design with Tailwind CSS

## Backend API

The frontend connects to the backend API at `https://event-hub-api-iota.vercel.app/api/v1`.

## Project Structure

- `src/components/`: React components
- `src/context/`: Authentication context
- `src/App.jsx`: Main app with routing
- `src/main.jsx`: Entry point
- `src/index.css`: Global styles with Tailwind CSS