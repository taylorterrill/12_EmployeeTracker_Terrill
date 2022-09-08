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

// asks user what they'd like to do. runs various functions based on user response.
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

// -------------------- functions for switch cases -------------------- \\

function showDepartments() {
    console.log('showing departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

function showRoles() {
    console.log('showing roles...\n');
    const sql = `SELECT 
                role.id, role.title, department.name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

function viewEmployees() {
    console.log('viewing employees...\n');
    const sql = `SELECT 
                    employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name AS department,
                    role.salary, 
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    })
};

function addDepartment() {
    console.log('adding a department...\n');
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What is the name of the department you would like to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a valid department name.');
                    return false;
                }
            }
        }
    ]).then (answer => {
        const sql = `INSERT INTO department (name)
        VALUES (?)`;

        db.query(sql, answer.addDept, (err, res) => {
            if (err) throw err;
            console.log('Successfully added ' + answer.addDept + ' to list of departments.');

            showDepartments();
        });
    });
};

function addRole() {
    console.log('adding a role...\n');
};

function addEmployee() {
    console.log('adding an employee...\n');
};

function updateEmployeeRole() {
    console.log('updating employee role...\n');
};

function updateEmployeeManager() {
    console.log("updating employee's manager...\n");
};

function viewEmployeesByDpt() {
    console.log('viewing employees by department...\n');
};

function deleteDepartment() {
    console.log('deleting department...\n');
};

function deleteRole() {
    console.log('deleting role...\n');
};

function deleteEmployee() {
    console.log('deleting employee...\n');
};

function viewBudgets() {
    console.log('viewing budgets\n');
};










