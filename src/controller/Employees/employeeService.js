const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateEmployeeService = async ({ id, name, jobId, salaryPerDay, salaryPerMonth, totalWorkDays, photo }) => {
  const existEmployee = await prisma.employee.findUnique({
    where: { id: Number(id) },
  });

  if (!existEmployee) {
    throw new Error('Employee tidak terdaftar');
  }

  const updateEmployee = await prisma.employee.update({
    where: {
      id: Number(id),
    },

    data: {
      name,
      salaryPerDay: Number(salaryPerDay),
      salaryPerMonth: Number(salaryPerMonth),
      totalWorkDays: Number(totalWorkDays),
      photo,
      job: {
        connect: Number(jobId) ? { id: Number(jobId) } : undefined,
      },
    },
  });

  return updateEmployee;
};

module.exports = { updateEmployeeService };
