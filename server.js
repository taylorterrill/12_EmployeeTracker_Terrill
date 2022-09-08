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

// asks user what they'd like to do. runs corresponding functions based on user response.
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
    ]).then(answer => {
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role you would like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a valid role name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    console.log('Please enter a valid salary amount.')
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.role, answer.salary];
        const sqlRole = `SELECT name, id FROM department`;

        db.query(sqlRole, (err, res) => {
            if (err) throw err;

            const dept = res.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: "What department is this role in?",
                    choices: dept
                }
            ])
                .then(deptChoice => {
                    const dept = deptChoice.dept;
                    params.push(dept);

                    const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;

                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        console.log('Added' + answer.role + " to roles.");

                        showRoles();
                    });
                });
        });
    });
};

function addEmployee() {
    console.log('adding an employee...\n');
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log("Please enter the employee's first name");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log("Please enter the employee's last name.");
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]
            const sqlRole = `SELECT role.id, role.title FROM role`;

            db.query(sqlRole, (err, res) => {
                if (err) throw err;
                const roles = res.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const sqlMgr = `SELECT * FROM employee`;

                        db.query(sqlMgr, (err, res) => {
                            if (err) throw err;

                            const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;

                                    db.query(sql, params, (err, res) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")

                                        viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

function updateEmployeeRole() {
    console.log('updating employee role...\n');
    const sqlEmp = `SELECT * FROM employee`;

    db.query(sqlEmp, (err, res) => {
        if (err) throw err;

        const employees = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const sqlRole = `SELECT * FROM role`;

                db.query(sqlRole, (err, res) => {
                    if (err) throw err;

                    const roles = res.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, res) => {
                                if (err) throw err;
                                console.log("Employee has been updated.");

                                viewEmployees();
                            });
                        });
                });
            });
    });
};










