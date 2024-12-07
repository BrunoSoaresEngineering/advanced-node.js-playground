const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeather = req.headers.authorization || req.headers.Authorization;

  if (!authHeather?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authHeather.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.log(err)
        return res.sendStatus(403);
      }
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  )
}

module.exports = verifyJWT;
