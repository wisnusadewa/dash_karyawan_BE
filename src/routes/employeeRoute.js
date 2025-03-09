const express = require('express');
const { updateEmployee } = require('../controller/Employees/employeeController');
const { authentication } = require('../middleware/authentication');
const router = express.Router();

router.put('/updateEmployee/:id', authentication, updateEmployee);

module.exports = router;
