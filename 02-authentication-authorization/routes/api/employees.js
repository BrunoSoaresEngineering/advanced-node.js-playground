const express = require('express');
const employeesController = require('../../controllers/employees');
const ROLES_LIST = require('../../config/roles-list');
const verifyRoles = require('../../middleware/authorization');

const router = express.Router();

router.route('/')
  .get(employeesController.getAll)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNew)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.update)
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteById)

router.route('/:id')
  .get(employeesController.getById)
  .delete(employeesController.deleteById)
  .put(employeesController.update)

module.exports = router;