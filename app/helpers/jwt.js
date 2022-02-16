const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

module.exports = {
  // decode payload jwt to get user data
  parseJwtPayload: token => {
    return jwtDecode(token);
  },
  // generate new jwt token which expires in 24 hours
  generateAccessToken: user => {
    return jwt.sign(user, process.env.ACCESS_JWT_SECRET, { expiresIn: '24h' });
  },
};
