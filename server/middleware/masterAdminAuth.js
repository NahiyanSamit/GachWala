const jwt = require('jsonwebtoken');

const masterAdminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is a master_admin
    if (decoded.role !== 'master_admin') {
      return res.status(403).json({ message: 'Access denied. Master Admin only.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = masterAdminAuth;
