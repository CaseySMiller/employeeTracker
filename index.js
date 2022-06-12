const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'eNB*iL9TG@LxMY3JhMVW',
        database: 'employeeRoles_db'
    },
    console.log(`Connected to the classlist_db database.`)
);

askStuff();
// function to ask user what to do
function askStuff() {
    console.clear();
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "operation",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee's role",
                    "Quit"
                ]
            }
        ])
        .then((response) => {
            //call functions for response
            switch(response.operation) {
                case "View all departments":
                    console.log(`you answered ${response.operation}`);
                    viewDepts();
                    break;
                case "View all roles":
                    console.log(`you answered ${response.operation}`);
                    viewRoles();
                    break;
                case "View all employees":
                    console.log(`you answered ${response.operation}`);
                    viewEmps();
                    break;
                case "Add a department":
                    console.log(`you answered ${response.operation}`);
                    addDept();
                    break;
                case "Add a role":
                    console.log(`you answered ${response.operation}`);
                    addRole();
                    break;
                case "Add an employee":
                    console.log(`you answered ${response.operation}`);
                    addEmp();
                    break;
                case "Update an employee's role":
                    console.log(`you answered ${response.operation}`);
                    updateEmpRole();
                    break;
                case "Quit":
                    process.exit();
            };
        });
};
// function to ask what to do next
function whatNext() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do next?',
                name: 'doNext',
                choices: [
                    'Back to main menu',
                    'quit'
                ]
            }
        ])
        .then((res) => {
            if (res.doNext == 'Back to main menu') {
                askStuff();
            } else {
                process.exit();
            }
        }

        )
}
// function to view departments
function viewDepts() {

    db.query(`SELECT * FROM departments`, (err, res) => {
        console.clear();
        console.log('\n', 'All Departments:', '\n');
        // log with cTable formatting
        const table = cTable.getTable(res);
        console.log(table);
        whatNext();
    });
};

// function to view roles
function viewRoles() {
    db.query(`SELECT * FROM roles`, (err, res) => {
        console.clear();
        console.log('\n', 'All Roles:', '\n');
        // log with cTable formatting
        const table = cTable.getTable(res);
        console.log(table);
        whatNext();
    });
};

// function to view employees
function viewEmps() {
    db.query(`SELECT employees.id, first_name, last_name, title, department_name, salary, manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id;`, (err, res) => {
        console.clear();
        console.log('\n', 'All Employees:', '\n');
        // log with cTable formatting
        const table = cTable.getTable(res);
        console.log(table);
        whatNext();
    });
};

// funtion to add department
function addDept() {
    console.log('\n', 'Add department:', '\n'); 
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the department name?',
                name: 'newDept'
            }
        ])
        .then((res) => {
            // console.log(res.newDept);
            // db.query(`INSERT INTO departments (department_name) VALUES ("${res.newDept}");`);
            db.query("INSERT INTO departments (department_name) VALUES (?)", [res.newDept], (err, res) => {
                if (err) throw err;
            })
            console.log( '\n', `${res.newDept} has been added.`, '\n');
            whatNext();
        })
    
};

// funtion to add a role
function addRole() {
    console.log('ayup');
};
// function to add employee
function addEmp() {
    console.log('ayup');
};
// function to update an employees role
function updateEmpRole() {
    console.log('ayup');
};

