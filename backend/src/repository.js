function createEmployeeRepository(db) {
  const listStmt = db.prepare(`
    SELECT *
    FROM employees
    WHERE
      (@search = '' OR full_name LIKE @searchLike OR employee_id LIKE @searchLike) AND
      (@country = '' OR country = @country) AND
      (@department = '' OR department = @department) AND
      (@status = '' OR status = @status)
    ORDER BY id
    LIMIT @limit OFFSET @offset
  `);

  const countStmt = db.prepare(`
    SELECT COUNT(*) AS total
    FROM employees
    WHERE
      (@search = '' OR full_name LIKE @searchLike OR employee_id LIKE @searchLike) AND
      (@country = '' OR country = @country) AND
      (@department = '' OR department = @department) AND
      (@status = '' OR status = @status)
  `);

  const insertStmt = db.prepare(`
    INSERT INTO employees (
      employee_id, full_name, country, department, role,
      currency, base_salary, bonus_percent, status, hire_date
    ) VALUES (
      @employee_id, @full_name, @country, @department, @role,
      @currency, @base_salary, @bonus_percent, @status, @hire_date
    )
  `);

  const updateStmt = db.prepare(`
    UPDATE employees SET
      full_name = @full_name,
      country = @country,
      department = @department,
      role = @role,
      currency = @currency,
      base_salary = @base_salary,
      bonus_percent = @bonus_percent,
      status = @status,
      hire_date = @hire_date
    WHERE employee_id = @employee_id
  `);

  const getByEmployeeIdStmt = db.prepare("SELECT * FROM employees WHERE employee_id = ?");

  const payrollStmt = db.prepare(`
    SELECT
      COUNT(*) AS total_active_employees,
      SUM(base_salary * (1 + bonus_percent / 100.0)) AS total_local_payroll
    FROM employees
    WHERE status = 'active'
  `);

  const byCountryStmt = db.prepare(`
    SELECT
      country,
      AVG(base_salary) AS average_salary,
      COUNT(*) AS employees
    FROM employees
    WHERE status = 'active'
    GROUP BY country
    ORDER BY country ASC
  `);

  const topPaidStmt = db.prepare(`
    SELECT employee_id, full_name, country, department, currency, base_salary, bonus_percent
    FROM employees
    WHERE status = 'active'
    ORDER BY base_salary DESC
    LIMIT 10
  `);

  return {
    list(params) {
      return listStmt.all(params);
    },
    count(params) {
      return countStmt.get(params).total;
    },
    create(payload) {
      insertStmt.run(payload);
      return getByEmployeeIdStmt.get(payload.employee_id);
    },
    updateByEmployeeId(payload) {
      const result = updateStmt.run(payload);
      if (result.changes === 0) return null;
      return getByEmployeeIdStmt.get(payload.employee_id);
    },
    getByEmployeeId(employeeId) {
      return getByEmployeeIdStmt.get(employeeId);
    },
    payrollOverview() {
      return payrollStmt.get();
    },
    averageSalaryByCountry() {
      return byCountryStmt.all();
    },
    topPaidEmployees() {
      return topPaidStmt.all();
    },
  };
}

module.exports = { createEmployeeRepository };
