const jwt = require('jsonwebtoken');
const db = require('../config/poolConnection');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { rows } = await db.query(
        'SELECT user_id AS id, user_id AS "userId", name, email, role, phone, address, is_verified AS "isVerified", loyalty_points AS "loyaltyPoints", avatar_url AS "avatarUrl" FROM users WHERE user_id = $1',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).send({ status: 401, success: false, message: 'Not authorized, user not found' });
      }

      req.user = rows[0];
      return next();
    } catch (error) {
      console.error('@authMiddleware protect err:', error);
      return res.status(401).send({ status: 401, success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).send({ status: 401, success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(401).send({ status: 401, success: false, message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
