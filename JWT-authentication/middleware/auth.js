const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeather = req.headers['authorization'];

  if (!authHeather) {
    return res.sendStatus(401);
  }

  console.log(authHeather);
  const token = authHeather.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.log(err)
        return res.sendStatus(403);
      }
      req.user = decoded.username;
      next();
    }
  )
}

module.exports = verifyJWT;
