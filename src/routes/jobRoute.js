const express = require('express');
const { addJob, getJobs, getJobId } = require('../controller/Job/jobController');
const { authentication } = require('../middleware/authentication');
const router = express.Router();

router.post('/job', authentication, addJob);
router.get('/job', authentication, getJobs);
router.get('/getjob/:id', authentication, getJobId);

module.exports = router;
