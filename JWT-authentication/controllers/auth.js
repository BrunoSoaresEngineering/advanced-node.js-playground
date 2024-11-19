const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const users = require('../model/users.json');

require('dotenv').config();

const usersDB = {
  users,
  setUsers: function (data) { this.users = data }
}

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

const handleLogin = async (req, res) => {
  const user = req.body?.user;
  const pwd = req.body?.pwd;

  if(!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required.'});
  }

  const foundUser = usersDB.users.find((userDB) => userDB.username === user);

  if (!foundUser) {
    return res.sendStatus(401);
  }

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const otherUsers = usersDB.users.filter((userDB) => userDB.username !== user);
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fs.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      // secure: true,
      maxAge: oneDayInMilliseconds
    });
    res.json({ accessToken });
    return;
  }

  res.sendStatus(401);
}

module.exports = { handleLogin };
