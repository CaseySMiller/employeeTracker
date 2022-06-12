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
                    "Update an employee's role"
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
            }
        });
};
// function to view departments
function viewDepts() {

    db.query(`SELECT * FROM departments`, (err, res) => {
        console.clear();
        console.log('\n', 'All Departments:', '\n');
        // log with cTable formatting
        const table = cTable.getTable(res);
        console.log(table);
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
    });
};
// function to view employees
function viewEmps() {
    console.log('ayup');
};
// funtion to add department
function addDept() {
    console.log('ayup');
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

