const prisma = require('../../config/prismaClient');
const path = require('path');
const fs = require('fs');

const getUserPhotoService = async (userId) => {
  console.log('User ID:', userId); // Debugging

  if (!userId) {
    throw new Error('User ID tidak ditemukan!');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      document: true,
      employee: true,
    },
  });

  if (!user || !user.employee || !user.employee.photo) {
    throw new Error('photo tidak ditemukan!');
  }

  const filePath = path.join(__dirname, 'uploads', user.employee.photo);

  if (!fs.existsSync(filePath)) {
    throw new Error('File tidak ditemukan di server!');
  }

  // process.cwd() yang selalu menunjuk ke root project:
  return filePath;
};

module.exports = { getUserPhotoService };
