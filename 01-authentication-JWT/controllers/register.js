const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const path = require('path');
const users = require('../model/users.json');

const usersDB = {
  users,
  setUsers: function (data) { this.users = data }
}

async function handleNewUser(req, res) {
  const user = req.body?.user;
  const pwd = req.body?.pwd;

  if(!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required.'});
  }

  const duplicate = usersDB.users.find((userDB) => userDB.username === user);
  if (duplicate) {
    return res.sendStatus(409);
  }

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedPwd }
    usersDB.setUsers([...usersDB.users, newUser]);

    await fs.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    console.log(usersDB.users);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  handleNewUser
}
