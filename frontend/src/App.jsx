import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "";

const emptyForm = {
  employee_id: "",
  full_name: "",
  country: "USA",
  department: "Engineering",
  role: "Manager",
  currency: "USD",
  base_salary: "",
  bonus_percent: "",
  status: "active",
  hire_date: "2024-01-01",
};

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const countries = useMemo(() => ["", "USA", "India", "UK", "Germany", "Canada", "Singapore"], []);

  const fetchDashboard = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    const data = await res.json();
    setDashboard(data);
  }, []);

  const fetchEmployees = useCallback(async () => {
    const params = new URLSearchParams({
      limit: "50",
      offset: "0",
      search: query,
      country,
      status: "active",
    });
    const res = await fetch(`${API_BASE}/api/employees?${params.toString()}`);
    const data = await res.json();
    setEmployees(data.items || []);
    setTotal(data.total || 0);
  }, [query, country]);

  useEffect(() => {
    fetchDashboard();
    fetchEmployees();
  }, [fetchDashboard, fetchEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  async function submitForm(e) {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      base_salary: Number(form.base_salary),
      bonus_percent: Number(form.bonus_percent),
    };

    const isEdit = Boolean(editing);
    const url = isEdit ? `${API_BASE}/api/employees/${editing.employee_id}` : `${API_BASE}/api/employees`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.formErrors?.join(", ") || data.error || "Failed to save employee");
      return;
    }

    setForm(emptyForm);
    setEditing(null);
    await Promise.all([fetchEmployees(), fetchDashboard()]);
  }

  function onEdit(employee) {
    setEditing(employee);
    setForm({
      employee_id: employee.employee_id,
      full_name: employee.full_name,
      country: employee.country,
      department: employee.department,
      role: employee.role,
      currency: employee.currency,
      base_salary: String(employee.base_salary),
      bonus_percent: String(employee.bonus_percent),
      status: employee.status,
      hire_date: employee.hire_date,
    });
  }

  return (
    <div className="page">
      <header>
        <h1>ACME Salary Management</h1>
        <p>Manage compensation data for 10,000 employees with searchable records and dashboard insights.</p>
      </header>

      <section className="cards">
        <article>
          <h3>Active Employees</h3>
          <strong>{dashboard?.totalActiveEmployees ?? "-"}</strong>
        </article>
        <article>
          <h3>Total Payroll (USD)</h3>
          <strong>{dashboard ? dashboard.totalAnnualPayrollUsd.toLocaleString() : "-"}</strong>
        </article>
        <article>
          <h3>Loaded Employees</h3>
          <strong>{total}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Create / Update Employee</h2>
        <form onSubmit={submitForm} className="form-grid">
          <input
            placeholder="Employee ID"
            value={form.employee_id}
            disabled={Boolean(editing)}
            onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))}
            required
          />
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            required
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            required
          />
          <input
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            required
          />
          <select value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
            {countries.slice(1).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            placeholder="Currency"
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value.toUpperCase() }))}
            required
          />
          <input
            placeholder="Base Salary"
            type="number"
            value={form.base_salary}
            onChange={(e) => setForm((f) => ({ ...f, base_salary: e.target.value }))}
            required
          />
          <input
            placeholder="Bonus %"
            type="number"
            value={form.bonus_percent}
            onChange={(e) => setForm((f) => ({ ...f, bonus_percent: e.target.value }))}
            required
          />
          <input
            type="date"
            value={form.hire_date}
            onChange={(e) => setForm((f) => ({ ...f, hire_date: e.target.value }))}
            required
          />
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">{editing ? "Update Employee" : "Create Employee"}</button>
          {editing && (
            <button type="button" onClick={() => {
              setEditing(null);
              setForm(emptyForm);
            }}>
              Cancel Edit
            </button>
          )}
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <h2>Employees</h2>
        <div className="filters">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or employee ID" />
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((item) => (
              <option key={item || "all"} value={item}>
                {item || "All Countries"}
              </option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Country</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Bonus %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.full_name}</td>
                <td>{employee.country}</td>
                <td>{employee.department}</td>
                <td>
                  {employee.currency} {Number(employee.base_salary).toLocaleString()}
                </td>
                <td>{employee.bonus_percent}</td>
                <td>
                  <button type="button" onClick={() => onEdit(employee)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Average Salary By Country</h2>
        <ul className="country-list">
          {(dashboard?.averageSalaryByCountry || []).map((item) => (
            <li key={item.country}>
              <span>{item.country}</span>
              <span>{item.averageSalary.toLocaleString()}</span>
              <span>{item.employees} employees</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
