const fs = require('fs/promises');
const employees = require('../model/employees.json');
const path = require('path');

const data = {
  employees,
  setEmployees: function (data) { this.employees = data }
};

async function writeFile() {
  await fs.writeFile(
    path.join(__dirname, '..', 'model', 'employees.json'),
    JSON.stringify(data.employees)
  );
}

function getAll(req, res) {
  return res.json(employees);
}

function getById(req, res) {
  const employee = data.employees.find((employee) => employee.id === req.params?.id);
  if (!employee) {
    return res.status(404).json({ message: `Employee ID ${req.params?.id} not found` });
  }
  return res.json(employee);
}

async function createNew(req, res) {
  const currentNumberOfEmployees = data.employees?.length;
  
  const newEmployee = {
    id: currentNumberOfEmployees ? data.employees[currentNumberOfEmployees - 1].id + 1 : 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }

  if (!newEmployee.firstName || !newEmployee.lastName) {
    return res.status(400).json({ message: 'First and last names required' });
  }

  data.setEmployees([...data.employees, newEmployee]);

  await writeFile();

  res.status(201).json(data.employees);
}

async function update(req, res) {
  const employeeToUpdate = data.employees.find((employee) => employee.id === req.params?.id);

  if (!employeeToUpdate) {
    req.status(404).json({ message: `Employee ID ${req.params?.id} not found`});
  }

  if (req.body?.firstName) {
    employeeToUpdate.firstName = req.body.firstName
  }

  if (req.body?.lastName) {
    employeeToUpdate.lastName = req.body.lastName
  }

  await writeFile();

  res.json(data.employees);
}

async function deleteById(req, res) {
  const employeeToDelete = data.employees.find((employee) => employee.id === req.params?.id);

  if (!employeeToDelete) {
    res.status(404).json({ message: `Employee ID ${req.params?.id} not found` });
  }

  const filteredArray = data.employees.filter((employee) => employee.id != employeeToDelete.id );

  data.setEmployees(filteredArray);

  await writeFile();

  res.json(data.employees);
}

module.exports = {
  getAll,
  getById,
  createNew,
  update,
  deleteById
};
