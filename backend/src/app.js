const express = require("express");
const cors = require("cors");
const { employeeSchema, employeeUpdateSchema } = require("./validation");

function createApp({ service, repo }) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/employees", (req, res) => {
    const data = service.listEmployees(req.query);
    res.json(data);
  });

  app.post("/api/employees", (req, res) => {
    const parsed = employeeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    if (repo.getByEmployeeId(parsed.data.employee_id)) {
      return res.status(409).json({ error: "employee_id already exists" });
    }
    const employee = repo.create(parsed.data);
    return res.status(201).json(employee);
  });

  app.put("/api/employees/:employeeId", (req, res) => {
    const parsed = employeeUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const employee = repo.updateByEmployeeId({
      ...parsed.data,
      employee_id: req.params.employeeId,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(employee);
  });

  app.get("/api/dashboard", (_req, res) => {
    res.json(service.dashboard());
  });

  return app;
}

module.exports = { createApp };
