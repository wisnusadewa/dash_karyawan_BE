const express = require('express');
const { register, login, getUser, getUserById, deleteUser, refresh, logout, getCurrentUser, editUser, editUserPersonal } = require('../controller/User/userController');
const { authentication } = require('../middleware/authentication');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authentication, getCurrentUser);
router.get('/user', authentication, getUser);
router.get('/user/:id', authentication, getUserById);
router.put('/editUser/:id', authentication, editUser);
router.put('/editUserPersonal', authentication, editUserPersonal);
router.delete('/deleteUser/:id', authentication, deleteUser);

module.exports = router;
