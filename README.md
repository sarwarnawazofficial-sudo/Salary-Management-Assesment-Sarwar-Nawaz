# ACME Salary Management

End-to-end salary management software for 10,000 employees with a web UI, REST API, SQLite storage, deterministic seed script, and core tests.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- DB: SQLite (`better-sqlite3`)
- Validation: `zod`
- Testing: Node.js test runner + `supertest`

## Project Structure
- `docs/requirements.md` - one-page product requirements
- `docs/architecture-notes.md` - architecture and trade-offs
- `backend/` - API, data model, tests, seed script
- `frontend/` - HR Manager UI

## Quick Start
### 1) Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```
Backend runs at `http://localhost:4000`.

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` and talks to backend on port `4000`.

## API Endpoints
- `GET /health`
- `GET /api/employees?limit=&offset=&search=&country=&department=&status=`
- `POST /api/employees`
- `PUT /api/employees/:employeeId`
- `GET /api/dashboard`

## Testing
```bash
cd backend
npm test
```

## Notes
- Seed script generates exactly 10,000 records.
- v1 intentionally omits auth, approvals, audit history, and integrations (documented in requirements).
