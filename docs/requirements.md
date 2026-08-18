# ACME Salary Management - Product Requirements (v1)

## Goal
Enable ACME's HR manager to reliably manage salary data for 10,000 employees across multiple countries and answer common compensation questions without spreadsheets.

## Users
- Primary user: HR Manager
- Secondary stakeholders: Finance leadership (read-only consumers of exported insights)

## Problems Today
- Salary updates in spreadsheets are error-prone and hard to audit.
- Consolidating cross-country salary data is slow.
- HR cannot quickly answer questions like pay distribution, average salary by country, or outliers.

## Scope (In)
### Core employee data
- Employee profile: employee ID, full name, country, department, role, currency, base salary, bonus percentage, status, and hire date.
- Persistent storage in a relational database.

### Salary management workflows
- List/search/filter employees by name, country, department, and status.
- Create employee compensation records.
- Edit existing salary details with validation.

### Compensation analytics (HR Q&A)
- Dashboard cards for:
  - total active employees
  - total annual payroll (normalized to USD for comparison)
  - average salary by country
  - top 10 highest-paid employees
- Country-level distribution view for quick pay comparisons.

### Data scale and readiness
- Seed script to generate 10,000 realistic employee records.
- API and UI responsive for this dataset on local SQLite.

## Scope (Deliberately Out for v1)
- Authentication/authorization (single trusted HR user assumption).
- Multi-step approval workflows and change approvals.
- Historical salary versioning/audit trail beyond current record values.
- Complex compensation types (equity grants, allowances, variable plans).
- CSV import/export and payroll provider integrations.
- Multi-currency FX feeds (use static conversion map in v1).

Reasoning: v1 prioritizes day-to-day salary operations and decision-support analytics while reducing implementation risk and keeping quality high for the assessment timeline.

## Functional Requirements
- System must support CRUD operations for employee salary data (at minimum create, read, update).
- System must validate salary and bonus inputs (non-negative, sensible ranges).
- Dashboard endpoints must return deterministic aggregates.
- Seed command must fully initialize schema and load 10,000 records.

## Non-Functional Requirements
- Maintainable architecture with clear separation: API, data access, and UI.
- Unit/integration tests for salary calculations and core API flows.
- Fast local setup and deterministic test runs.
- Basic error handling and user-friendly validation messages.

## Success Criteria
- HR manager can update an employee's salary in under 1 minute.
- HR manager can answer compensation questions from dashboard analytics in under 10 seconds.
- Dataset of 10,000 employees loads and key interactions remain practical on a laptop.
