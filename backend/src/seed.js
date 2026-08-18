const { createDb, initializeSchema } = require("./db");

const countries = [
  { name: "USA", currency: "USD", min: 60000, max: 220000 },
  { name: "India", currency: "INR", min: 800000, max: 4500000 },
  { name: "UK", currency: "GBP", min: 35000, max: 150000 },
  { name: "Germany", currency: "EUR", min: 45000, max: 170000 },
  { name: "Canada", currency: "CAD", min: 50000, max: 180000 },
  { name: "Singapore", currency: "SGD", min: 50000, max: 200000 },
];

const departments = ["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations"];
const roles = ["Manager", "Analyst", "Specialist", "Lead", "Director", "Associate"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(list) {
  return list[randomInt(0, list.length - 1)];
}

function randomDate() {
  const start = new Date("2015-01-01").getTime();
  const end = new Date("2025-01-01").getTime();
  const ts = randomInt(start, end);
  return new Date(ts).toISOString().slice(0, 10);
}

function seed(count = 10000) {
  const db = createDb();
  initializeSchema(db);

  db.exec("DELETE FROM employees");

  const insert = db.prepare(`
    INSERT INTO employees (
      employee_id, full_name, country, department, role,
      currency, base_salary, bonus_percent, status, hire_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (let i = 1; i <= count; i += 1) {
      const country = randomPick(countries);
      const department = randomPick(departments);
      const role = randomPick(roles);
      const baseSalary = randomInt(country.min, country.max);
      const bonus = randomInt(0, 30);
      const status = Math.random() > 0.08 ? "active" : "inactive";
      const employeeId = `EMP${String(i).padStart(5, "0")}`;
      const fullName = `Employee ${i}`;
      const hireDate = randomDate();

      insert.run(
        employeeId,
        fullName,
        country.name,
        department,
        role,
        country.currency,
        baseSalary,
        bonus,
        status,
        hireDate,
      );
    }
  });

  tx();
  db.close();
  // eslint-disable-next-line no-console
  console.log(`Seeded ${count} employees`);
}

seed(10000);
