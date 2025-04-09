Stargaze Bookings
=================

Stargaze Bookings is a full-stack web application that allows users to browse, register for, and book astronomy events. Built with a modern tech stack using Next.js 14 (App Router) for the frontend and Node.js + Express + Prisma for the backend.

Tech Stack
----------

Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- js-cookie

Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- CORS enabled

Features Implemented
--------------------

Authentication
- User registration (/api/auth/register)
- User login (/api/auth/login)
- JWT token stored in cookies (via frontend)
- Auth state managed with React Context
- Login/logout reflected dynamically in the navbar

Event Listing
- Homepage fetches and displays all public events (GET /api/events)
- Logged-in users see a Book button on each event
- Bookings sent with auth token (POST /api/bookings)

Navbar
- Always visible
- Shows Login or Logout depending on auth status
- Updates in real-time on login/logout

Project Structure
-----------------

stargaze-bookings/
├── backend/         # Express + Prisma + Auth API
├── frontend/        # Next.js 14 frontend using App Router
│   ├── src/
│   │   ├── app/     # Pages (login, register, homepage)
│   │   ├── lib/     # Axios API calls + JWT helpers
│   │   ├── components/
│   │   └── context/ # Global auth context
├── prisma/          # Prisma schema and migrations

Setup Instructions
------------------

1. Backend

    cd backend
    npm install
    npx prisma migrate dev
    npm run dev

Runs on http://localhost:3000
CORS is enabled for frontend on localhost:3001

2. Frontend

    cd frontend
    npm install
    npm run dev

Runs on http://localhost:3001
Communicates with the backend for auth and events

Environment Variables
---------------------

Create a .env file in your backend root:

    DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/stargaze"
    JWT_SECRET="super-secret-key"

Next Steps (Future Features)
----------------------------

- My Bookings page (GET /api/bookings/mine)
- Booking cancellation (DELETE /api/bookings/:id)
- Admin dashboard (create/update/delete events)
- Role-based route protection
- Toast notifications for feedback

Credits
-------

Built by Noah for a full-stack booking app project focused on astronomy events.
