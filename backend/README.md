# TutorTrack Backend API

Express.js REST API for the TutorTrack tutor & coaching management application.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite via `better-sqlite3`
- **Auth:** JWT (`jsonwebtoken`) + bcrypt password hashing
- **Validation:** `express-validator`

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Seed the database with demo data
npm run db:seed

# 3. Start development server (with hot reload)
npm run dev
```

The server starts on `http://localhost:5000`.

### Demo Credentials
- **Email:** `amit.sharma@tutortrack.app`
- **Password:** `SecurePassword123!`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start production server |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:reset` | Delete database file and re-seed |

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ❌ | Login with email & password |

### Tutor Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/tutor/profile` | ✅ | Get tutor profile & settings |
| `PUT` | `/tutor/profile` | ✅ | Update profile & preferences |

### Students
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/students` | ✅ | List students (filter, search, paginate) |
| `POST` | `/students` | ✅ | Create new student |
| `GET` | `/students/:id` | ✅ | Get student detail with note/follow-up counts |

### Class Notes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/class-notes` | ✅ | List class notes (filter by student) |
| `POST` | `/class-notes` | ✅ | Create class note (fast log) |

### Follow-Ups
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/follow-ups` | ✅ | List follow-ups (filter by type/student) |
| `POST` | `/follow-ups` | ✅ | Schedule new follow-up |
| `PATCH` | `/follow-ups/:id/status` | ✅ | Toggle follow-up done/undone |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard/metrics` | ✅ | Get aggregated dashboard metrics |

## Authentication

Protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Obtain a token via `POST /api/v1/auth/login`.

## Environment Variables

See `.env.example` for all available configuration options.

## Project Structure

```
backend/
├── src/
│   ├── index.js              # App entry point
│   ├── config/env.js         # Environment config
│   ├── db/
│   │   ├── database.js       # SQLite connection
│   │   ├── schema.sql        # Table definitions
│   │   └── seed.js           # Demo data seeder
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handler
│   │   └── validate.js       # Request validation
│   ├── routes/               # Route definitions
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   └── validators/           # Validation rules
├── .env                      # Environment config
└── package.json
```
