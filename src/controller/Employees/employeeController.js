const { updateEmployeeService } = require('./employeeService');

const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, jobId, salaryPerDay, salaryPerMonth, totalWorkDays, photo } = req.body;

  try {
    const updateUser = await updateEmployeeService({ id, name, jobId, salaryPerDay, salaryPerMonth, totalWorkDays, photo });
    return res.status(200).json({ message: 'update employee berhasil', updateUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { updateEmployee };
