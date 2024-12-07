function verifyRoles(...allowedRolesList) {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }

    const allowedRoles = [...allowedRolesList];

    const result = req.roles.find((userRole) => allowedRoles.includes(userRole));

    console.log(result)

    if (result === undefined) {
      return res.sendStatus(401);
    }

    next();
  }
}

module.exports = verifyRoles;
