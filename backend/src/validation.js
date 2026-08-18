const { z } = require("zod");

const employeeSchema = z.object({
  employee_id: z.string().min(3),
  full_name: z.string().min(2),
  country: z.string().min(2),
  department: z.string().min(2),
  role: z.string().min(2),
  currency: z.string().length(3),
  base_salary: z.number().nonnegative(),
  bonus_percent: z.number().min(0).max(100),
  status: z.enum(["active", "inactive"]),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const employeeUpdateSchema = employeeSchema.omit({ employee_id: true });

module.exports = {
  employeeSchema,
  employeeUpdateSchema,
};
