const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addJobService = async ({ title, description }) => {
  const exitstJob = await prisma.job.findUnique({
    where: {
      description,
    },
  });

  if (exitstJob) {
    throw new Error('job sudah tersedia');
  }

  return await prisma.job.create({
    data: {
      title,
      description,
    },
  });
};

const getJobIdService = async ({ jobId }) => {
  return await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
};

module.exports = { addJobService, getJobIdService };
