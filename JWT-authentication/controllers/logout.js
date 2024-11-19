const fs = require('fs/promises');
const users = require('../model/users.json');
const path = require('path');

const usersDB = {
  users,
  setUsers: function (data) { this.users = data}
};

async function handleLogout(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const currentUser = usersDB.users.find((userDB) => userDB.refreshToken === refreshToken);
  if (currentUser) { 
    currentUser.refreshToken = '';
    usersDB.setUsers([...usersDB.users]);

    await fs.writeFile(
      path.join(__dirname, '..', 'model', 'user.json'),
      JSON.stringify(usersDB.users)
    );
  }

  res.clearCookie('jwt', { httpOnly: true , sameSite: 'none', secure: true });
  res.sendStatus(204);
}

module.exports = {
  handleLogout
};
