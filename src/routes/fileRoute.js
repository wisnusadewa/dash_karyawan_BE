const express = require('express');
const { getUserPhoto } = require('../controller/File/fileController');
const { authentication } = require('../middleware/authentication');

const router = express.Router();

router.get('/profile/photo', authentication, getUserPhoto);

module.exports = router;
