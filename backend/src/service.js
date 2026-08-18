const FX_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  CAD: 0.74,
  SGD: 0.74,
};

function normalizeToUsd(amount, currency) {
  const fx = FX_TO_USD[currency] || 1;
  return amount * fx;
}

function createEmployeeService(repo) {
  return {
    listEmployees(query) {
      const limit = Math.min(Number(query.limit || 50), 200);
      const offset = Number(query.offset || 0);
      const search = String(query.search || "").trim();
      const country = String(query.country || "").trim();
      const department = String(query.department || "").trim();
      const status = String(query.status || "").trim();

      const params = {
        search,
        searchLike: `%${search}%`,
        country,
        department,
        status,
        limit,
        offset,
      };

      const items = repo.list(params);
      const total = repo.count(params);
      return { items, total, limit, offset };
    },
    dashboard() {
      const overview = repo.payrollOverview();
      const countryAverages = repo.averageSalaryByCountry();
      const topPaid = repo.topPaidEmployees();

      const totalPayrollUsd = topPaid.length
        ? repo
            .list({
              search: "",
              searchLike: "%%",
              country: "",
              department: "",
              status: "active",
              limit: 100000,
              offset: 0,
            })
            .reduce(
              (sum, row) =>
                sum + normalizeToUsd(row.base_salary * (1 + row.bonus_percent / 100), row.currency),
              0,
            )
        : 0;

      return {
        totalActiveEmployees: overview.total_active_employees,
        totalAnnualPayrollUsd: Number(totalPayrollUsd.toFixed(2)),
        averageSalaryByCountry: countryAverages.map((row) => ({
          country: row.country,
          averageSalary: Number(Number(row.average_salary).toFixed(2)),
          employees: row.employees,
        })),
        topPaidEmployees: topPaid,
      };
    },
  };
}

module.exports = {
  createEmployeeService,
  normalizeToUsd,
};
