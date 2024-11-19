const jwt = require('jsonwebtoken');
const users = require('../model/users.json');

require('dotenv').config();

function handleRefreshToken(req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const foundUser = users.find((user) => user.refreshToken === refreshToken);
  if (!foundUser) {
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || decoded.username !== foundUser.username) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s'}
      );

      return res.json({ accessToken });
    }
  )
}

module.exports = {
  handleRefreshToken
}
