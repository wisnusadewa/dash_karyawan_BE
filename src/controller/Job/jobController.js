const { PrismaClient } = require('@prisma/client');
const { addJobService, getJobIdService } = require('./jobService');
const prisma = new PrismaClient();

const addJob = async (req, res) => {
  const { title, description } = req.body;

  try {
    const job = await addJobService({ title, description });
    return res.status(201).json({ message: 'create job successfully', job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employees: true,
      },
    });
    return res.json({ message: 'Fecth successfully', jobs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET JOB BY ID
const getJobId = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await getJobIdService({ jobId });
    return res.json({ message: 'Fecth successfully', job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const getJobMe = async (req, res) => {
//   try {
//     const { jobId } = req.body;
//     const job = await getJobIdService({ jobId });
//     return res.json({ message: 'Fecth successfully', job });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

module.exports = { addJob, getJobs, getJobId };
