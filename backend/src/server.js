const { createDb, initializeSchema } = require("./db");
const { createEmployeeRepository } = require("./repository");
const { createEmployeeService } = require("./service");
const { createApp } = require("./app");

const db = createDb();
initializeSchema(db);

const repo = createEmployeeRepository(db);
const service = createEmployeeService(repo);
const app = createApp({ service, repo });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${port}`);
});
