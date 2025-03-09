const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const jobRoute = require('./routes/jobRoute');
const employeeRoute = require('./routes/employeeRoute');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileRoute = require('./routes/fileRoute');

const app = express();

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,HEAD');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Content-Type, Authorization', 'application/json');

//   // preflight request
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   } else {
//     next();
//   }
// });

// Konfigurasi CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Hanya mengizinkan frontend React di port 5173
    credentials: true, // Mengizinkan pengiriman cookie atau header khusus seperti Authorization
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

// middleware untuk foto (open di browser)
app.use('/uploads', express.static('uploads'));

app.use('/api', userRoute);
app.use('/api', jobRoute);
app.use('/api', employeeRoute);
app.use('/api', fileRoute);

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
