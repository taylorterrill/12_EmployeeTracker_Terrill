// dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

//connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('connected as ' + db.threadId);
    loadWelcome();
});

// welcome screen
loadWelcome = () => {
    console.log("***********************************");
    console.log("*                                 *");
    console.log("*        EMPLOYEE MANAGER         *");
    console.log("*                                 *");
    console.log("***********************************");
    promptUser();
};

// asks user what they'd like to do.
function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices:
                [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Update an employee manager',
                    'View employees by department',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View department budgets',
                    'No Action'
                ]
        }]).then(userInput => {
            switch (userInput.choices) {
                case 'View all departments':
                    showDepartments();
                    break;
                case 'View all roles':
                    showRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Update an employee manager':
                    updateEmployeeManager();
                    break;
                case 'View employees by department':
                    viewEmployeesByDpt();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'View department budgets':
                    viewBudgets();
                    break;
                default:
                    db.end();
            };
        });
};

// functions for switch cases
function showDepartments() {
    console.log('showing departments...');
};

function showRoles() {
    console.log('showing roles...');
};

function viewEmployees() {
    console.log('viewing employees...');
};

function addDepartment() {
    console.log('adding a department...');
};

function addRole() {
    console.log('adding a role...');
};

function addEmployee() {
    console.log('adding an employee...');
};

function updateEmployeeRole() {
    console.log('updating employee role...');
};

function updateEmployeeManager() {
    console.log("updating employee's manager...");
};

function viewEmployeesByDpt() {
    console.log('viewing employees by department...');
};

function deleteDepartment() {
    console.log('deleting department...');
};

function deleteRole() {
    console.log('deleting role...');
};

function deleteEmployee() {
    console.log('deleting employee...');
};

function viewBudgets() {
    console.log('viewing budgets');
};










