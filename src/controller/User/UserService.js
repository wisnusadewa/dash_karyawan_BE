const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { generateToken, generateRefreshToken } = require('../../utils/jwt');

const registerService = async ({ email, password, cpassword }) => {
  const UserRegistered = await prisma.user.findUnique({
    where: { email },
  });

  if (UserRegistered) {
    throw new Error('user sudah melakukan registrasi');
  }

  if (!email || !password || !cpassword) {
    throw new Error('field wajib di isi!');
  }

  if (password !== cpassword) {
    throw new Error('password dan cpassword harus sama!');
  }

  // HASING
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat user terlebih dahulu
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  await prisma.employee.create({
    data: {
      userId: user.id,
      name: 'new employee', //  default value
      joinDate: new Date(),
    },
  });

  return user;
};

const loginService = async ({ email, password, res, req }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('email belum terdaftar');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('email atau password salah!');
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // MENGIRIMKAN refreshToken ke cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    // secure: true, // Aktifkan jika menggunakan HTTPS
  });

  console.log('Refresh token service:', req.cookies.refreshToken); // refresh token

  return { accessToken, refreshToken, user };
};

const getUserByIdService = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      employee: true,
    },
  });

  if (user.role !== 'ADMIN') {
    throw new Error('anda tidak memiliki akses!');
  }

  return user;
};

const deleteUserService = async ({ id }) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
};

const editUserService = async ({ id, role, jobId, name, status, salaryPerMonth, totalWorkDays, photo }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  // PASTIKAN HANYA BISA DIEDIT OLEH ADMIN
  if (!user || user.role !== 'ADMIN') {
    throw new Error('anda tidak memiliki akses pengeditan!');
  }

  const userUpdate = await prisma.user.update({
    where: {
      id: Number(id),
    },

    data: {
      role,
      employee: {
        update: {
          job: {
            connect: Number(jobId) ? Number(jobId) : undefined,
          },
          name,
          status,
          salaryPerMonth,
          totalWorkDays: Number(totalWorkDays),
          photo,
        },
      },
    },
    include: {
      employee: true,
    },
  });
  return userUpdate;
};

// EDIT PERSONAL PROFILE
const editUserPersonalService = async ({ userId, name, file }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      document: true, // Pastikan mengambil dokumen terkait
      employee: true,
    },
  });

  // PASTIKAN HANYA BISA DIEDIT OLEH PEMILIK AKUN
  if (!user || userId !== user.id) {
    throw new Error('anda tidak memiliki akses pengeditan!');
  }

  const isImage = file && file.mimetype.startsWith('image/');
  const isPdf = file && file.mimetype === 'application/pdf';

  // Ambil ID dokumen pertama jika ada
  const documentId = user.document.length > 0 ? user.document[0].id : null;

  // Cara ke-2
  const updateData = {
    employee: {
      update: {
        name,
        ...(isImage && { photo: file.path }), // Update `photo` hanya jika file adalah image
      },
    },
    ...(isPdf &&
      documentId && {
        document: {
          update: {
            where: { id: documentId },
            data: {
              fileName: file.filename,
              filePath: file.path,
              fileSize: file.size,
              fileType: file.mimetype,
            },
          },
        },
      }),
    ...(isPdf &&
      !documentId && {
        document: {
          create: {
            fileName: file.filename,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype,
            userId: Number(userId),
          },
        },
      }),
  };

  const userUpdate = await prisma.user.update({
    where: { id: Number(userId) },
    data: updateData,
    include: { employee: true, document: true },
  });

  return userUpdate;
};

const getCurrentUserService = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId, // ID dari token
    },
    include: {
      employee: {
        include: {
          job: true,
        },
      },
      document: true,
    },
  });
};

module.exports = { registerService, loginService, getUserByIdService, deleteUserService, getCurrentUserService, editUserService, editUserPersonalService };
