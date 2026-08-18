# Architecture and Trade-off Notes

## High-level design
- Frontend: React (Vite), single-page app for HR workflows.
- Backend: Express REST API with layered structure:
  - `repository`: SQL access
  - `service`: business logic and derived metrics
  - `app/routes`: transport and validation
- Database: SQLite (`better-sqlite3`) for deterministic local setup and simple deployment.

## Why this architecture
- Keeps core logic testable without UI.
- Supports quick local setup while handling 10,000-row dataset.
- Separates concerns clearly for maintainability and future extension.

## Key product decisions
- Focused v1 on core salary operations + management insights.
- Included normalized payroll metric in USD for cross-country comparison.
- Search + filtering target HR's daily use cases.

## Performance considerations
- SQLite with indexed primary identifiers and paginated reads.
- Dashboard metrics computed from compact aggregate queries.
- Seed uses one transaction for inserting 10,000 employees quickly.

## Future evolution
- Add authentication/roles for HR and finance.
- Add salary history/audit logs for compliance.
- Add CSV import/export and external payroll integration.
