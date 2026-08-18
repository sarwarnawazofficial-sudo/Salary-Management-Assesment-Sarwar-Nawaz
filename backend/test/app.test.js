const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const Database = require("better-sqlite3");
const { initializeSchema } = require("../src/db");
const { createEmployeeRepository } = require("../src/repository");
const { createEmployeeService, normalizeToUsd } = require("../src/service");
const { createApp } = require("../src/app");

function setupApp() {
  const db = new Database(":memory:");
  initializeSchema(db);
  const repo = createEmployeeRepository(db);

  repo.create({
    employee_id: "EMP00001",
    full_name: "Alice Smith",
    country: "USA",
    department: "Engineering",
    role: "Manager",
    currency: "USD",
    base_salary: 120000,
    bonus_percent: 10,
    status: "active",
    hire_date: "2020-01-01",
  });

  const service = createEmployeeService(repo);
  const app = createApp({ service, repo });
  return { app, db };
}

describe("salary management api", () => {
  let app;
  let db;

  beforeEach(() => {
    const setup = setupApp();
    app = setup.app;
    db = setup.db;
  });

  it("lists employees with pagination", async () => {
    const res = await request(app).get("/api/employees?limit=10&offset=0");
    assert.equal(res.status, 200);
    assert.equal(res.body.total, 1);
    assert.equal(res.body.items.length, 1);
    db.close();
  });

  it("creates a new employee", async () => {
    const res = await request(app).post("/api/employees").send({
      employee_id: "EMP00002",
      full_name: "Bob Doe",
      country: "India",
      department: "HR",
      role: "Analyst",
      currency: "INR",
      base_salary: 1800000,
      bonus_percent: 12,
      status: "active",
      hire_date: "2021-02-02",
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.employee_id, "EMP00002");
    db.close();
  });

  it("updates salary for an employee", async () => {
    const res = await request(app).put("/api/employees/EMP00001").send({
      full_name: "Alice Smith",
      country: "USA",
      department: "Engineering",
      role: "Manager",
      currency: "USD",
      base_salary: 140000,
      bonus_percent: 15,
      status: "active",
      hire_date: "2020-01-01",
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.base_salary, 140000);
    db.close();
  });

  it("calculates dashboard aggregates", async () => {
    const res = await request(app).get("/api/dashboard");
    assert.equal(res.status, 200);
    assert.equal(res.body.totalActiveEmployees, 1);
    assert.equal(res.body.totalAnnualPayrollUsd, 132000);
    db.close();
  });
});

describe("salary conversion", () => {
  it("normalizes currencies to usd", () => {
    assert.equal(normalizeToUsd(100, "USD"), 100);
    assert.equal(normalizeToUsd(100, "INR"), 1.2);
  });
});
