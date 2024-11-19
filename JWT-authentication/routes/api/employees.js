const express = require('express');
const employeesController = require('../../controllers/employees');

const router = express.Router();

router.route('/')
  .get(employeesController.getAll)
  .post(employeesController.createNew)
  .put(employeesController.update)
  .delete(employeesController.deleteById)

router.route('/:id')
  .get(employeesController.getById)
  .delete(employeesController.deleteById)
  .put(employeesController.update)

module.exports = router;