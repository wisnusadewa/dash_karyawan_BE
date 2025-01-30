const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
// const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/jobs', jobRoutes);

// Error Handling Middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Jika error berasal dari Multer
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     // Error lainnya
//     return res.status(500).json({ message: err.message });
//   }
//   next();
// });

// const fs = require('fs');

// if (!fs.existsSync('uploads/photos')) fs.mkdirSync('uploads/photos', { recursive: true });
// if (!fs.existsSync('uploads/documents')) fs.mkdirSync('uploads/documents', { recursive: true });

module.exports = app;
