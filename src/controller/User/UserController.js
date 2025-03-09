const { PrismaClient } = require('@prisma/client');
const { registerService, loginService, getUserByIdService, deleteUserService, getCurrentUserService, editUserService, editUserPersonalService } = require('./userService');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanFileName = file.originalname.replace(/\s+/g, '_'); // Menghilangkan spasi
    cb(null, `${uniqueSuffix}-${cleanFileName}`); // Hindari duplikasi nama
  },
});

const upload = multer({
  storage,
  limits: { fieldSize: 3 * 1024 * 1024 }, // maks 3mb
  fileFilter: function (req, file, cb) {
    // Batasi jenis file ( hanya menerima PDF dan gambar)
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File format not supported'), false);
    }
    cb(null, true);
  },
});

// ========================= //

const register = async (req, res) => {
  const { email, password, cpassword } = req.body;

  try {
    const user = await registerService({ email, password, cpassword });
    return res.status(201).json({ message: 'register berhasil', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginService({ email, password, res, req });
    const { accessToken, user } = token;

    console.log('Refresh token controller:', req.cookies.refreshToken); // refresh token

    return res.json({ message: 'login berhasil', accessToken, user });
  } catch (error) {
    console.log('error from login controller');
    return res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  // res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  res.clearCookie('refreshToken', { httpOnly: true });
  res.json({ message: 'Logged out successfully' });
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserByIdService({ id });
    return res.status(200).json({ message: 'userId didapatkan', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await deleteUserService({ id });
    return res.status(200).json({ message: 'user berhasil dihapus!', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getCurrentUserService(userId);

    // JIKA USER TIDAK DI DAPATKAN
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan!' });

    return res.status(200).json({ message: 'current user didapatkan', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, jobId, name, status, salaryPerMonth, totalWorkDays, photo } = req.body;

    const userUpdated = await editUserService({ id, role, jobId, name, status, salaryPerMonth, totalWorkDays, photo });

    return res.status(200).json({ message: 'update user berhasil!', userUpdated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const editUserPersonal = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const userId = req.user.id; // data dari token
      const { name } = req.body;

      const file = req.file;

      // if (!file) {
      //   return res.status(400).json({ message: 'File tidak ditemukan!' });
      // }

      const userUpdated = await editUserPersonalService({ userId, name, file });

      return res.status(200).json({ message: 'update user berhasil!', userUpdated });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const refresh = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Get refreshToken from cookies

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // JWT VERIFY
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        console.log('Invalid Refresh Token:', err.message); // Log error refresh token
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '2m',
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Invalid refresh token:', error.message);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { register, login, getUser, getUserById, deleteUser, logout, refresh, getCurrentUser, editUser, editUserPersonal };
