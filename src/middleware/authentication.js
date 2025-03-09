const { verifyToken } = require('../utils/jwt');

const authentication = (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // console.log('Authorization Header:', authHeader); // Debugging

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   console.error('Token tidak tersedia!');
  //   return res.status(401).json({ message: 'Unauthorized, token tidak tersedia' });
  // }

  // const token = authHeader.split(' ')[1];
  // console.log('Extracted Token:', token);

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    //   verify token
    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('error from authentication', error.message);
    return res.status(403).json({ message: 'Invalid Token' });
  }
};
module.exports = { authentication };
