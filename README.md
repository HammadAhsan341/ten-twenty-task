Timesheet Management App

A simple SaaS-style timesheet management app built with Next.js 16, TypeScript, and TailwindCSS.

Key Features

JWT authentication using NextAuth (Credentials Provider)

Create, edit, delete, and view timesheet entries

Table and list views with sorting

Track date, hours (0–168), description, and status (pending/approved/rejected)

Form validation with Zod and React Hook Form

Toast notifications for all user actions

Fully responsive (mobile, tablet, desktop)

Tech Stack

Next.js 16 (App Router)

TypeScript 5

NextAuth (JWT sessions)

TailwindCSS v4 + Radix UI

SWR for data fetching

Zod for validation

How It Works

Users log in with email and password (min 6 characters)

Authenticated users access a protected dashboard

Timesheets are managed via internal API routes

Data is stored in an in-memory store (resets on server restart)

All API routes are secured with server-side session checks

API Endpoints

GET /api/timesheets

POST /api/timesheets

PUT /api/timesheets/[id]

DELETE /api/timesheets/[id]

(All require authentication)

Notes

Session duration: 30 days

Validation on both client and server

No database (MVP-focused, easy to swap later)

Clean, modular, and type-safe codebase
