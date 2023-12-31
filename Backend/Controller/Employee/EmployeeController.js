const createEmployee = require("./createEmployee");
const getAllEmployees = require("./getAllEmployees");
const getEmployeeById = require("./getEmployeeById");
const updateEmployeeById = require("./updateEmployeeById");
const deleteEmployeeById = require("./deleteEmployeeById");
const adminsList = require("./adminsList");
const getTotalEmployees = require("./getTotalEmployees");
const RecentEmployee = require("./RecentEmployee");

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  adminsList,
  getTotalEmployees,
  RecentEmployee,
};
