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
    const deptArray = [];
    // let newDeptId = 0;

    db.query("SELECT * FROM departments;", (err, res) => {
        if(err) throw err;
        // push dept names to an array
        res.forEach(obj => {
            deptArray.push(obj.department_name);
        })
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the new role name',
                name: 'newName'
            },
            {
                type: 'number',
                message: 'Enter the annual salary for the new role',
                name: 'newSalary'
            },
            {
                type: 'list',
                message: 'Choose a department for the new role',
                choices: deptArray,
                name: 'deptName'
            }
        ])
        .then(async function (res) {
                let promise = new Promise ((resolve, reject) => {
                    db.query(`SELECT id FROM departments WHERE department_name = "${res.deptName}"`, (err, res) => {
                        if(err) throw err;
                        resolve(res[0].id);
                    })
                });

                newDeptId = await promise;
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [res.newName, res.newSalary, newDeptId], (err, res) => {
                    if (err) throw err;
                    console.log('Add role successful');
                    whatNext();
                })

            }

        )
    })
};

// function to add employee
async function addEmp() {
    // request role info
    let roleProm = new Promise ((resolve, reject) => {
        const arr = [];
        db.query("SELECT id, title FROM roles;", (err, res) => {
            if(err) throw err;
            // push roles to an array
            res.forEach(obj => {
                const roleObj = {};
                roleObj.id = obj.id;
                roleObj.title = obj.title;
                arr.push(roleObj);
            })
            resolve(arr);
        })
    });
    // request employee info
    let empProm = new Promise ((resolve, reject) => {
        const arr = [];
        db.query("SELECT id, first_name, last_name FROM employees;", (err, res) => {
            if(err) throw err;
            // push employee full names and ids to an array
            res.forEach(obj => {
                const mgrObj = {};
                let fullName = obj.first_name + " " + obj.last_name
                mgrObj.id = obj.id;
                mgrObj.name = fullName;
                arr.push(mgrObj);
            })
            resolve(arr);
        })
    });
    // assign arrays once db requests resolve
    roleArray = await roleProm;
    empArray = await empProm;
    // seperate names from arrays
    const roleNames = [];
    roleArray.forEach( obj => {
        roleNames.push(obj.title);
    });
    const empNames = [];
    empArray.forEach( obj => {
        empNames.push(obj.name);
    });

    // promt user for info
    inquirer.prompt([
        {
            type: 'input',
            message: "Enter the new employee's first name",
            name: 'newFirstName'
        },
        {
            type: 'input',
            message: "Enter the new employee's last name",
            name: 'newLastName'
        },
        {
            type: 'list',
            message: 'Choose a role for the new employee',
            choices: roleNames,
            name: 'roleName'
        },
        {
            type: 'list',
            message: 'Choose a manager for the new employee',
            choices: empNames,
            name: 'mgrName'
        }
    ])
    .then((res) => {
        // assign id to chosen role
        let roleID = 0;
        roleArray.forEach(obj => {
            if (res.roleName == obj.title) {
                roleID = obj.id;
            }
        })
        // assign id for chosen manager
        let mgrID = 0;
        empArray.forEach(obj => {
            if (res.mgrName == obj.name) {
                mgrID = obj.id;
            }
        })

        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [res.newFirstName, res.newLastName, roleID, mgrID], (err, res) => {
            if (err) throw err;
            console.log( '\n', 'Employee successfully added', '\n');
            whatNext();
        })
    })

};


// function to update an employees role
async function updateEmpRole() {
    // request role info
    let roleProm = new Promise ((resolve, reject) => {
        const arr = [];
        db.query("SELECT id, title FROM roles;", (err, res) => {
            if(err) throw err;
            // push roles to an array
            res.forEach(obj => {
                const roleObj = {};
                roleObj.id = obj.id;
                roleObj.title = obj.title;
                arr.push(roleObj);
            })
            resolve(arr);
        })
    });
    // request employee info
    let empProm = new Promise ((resolve, reject) => {
        const arr = [];
        db.query("SELECT id, first_name, last_name FROM employees;", (err, res) => {
            if(err) throw err;
            // push employee full names and ids to an array
            res.forEach(obj => {
                const mgrObj = {};
                let fullName = obj.first_name + " " + obj.last_name
                mgrObj.id = obj.id;
                mgrObj.name = fullName;
                arr.push(mgrObj);
            })
            resolve(arr);
        })
    });
    // assign arrays once db requests resolve
    roleArray = await roleProm;
    empArray = await empProm;
    // seperate names from arrays
    const roleNames = [];
    roleArray.forEach( obj => {
        roleNames.push(obj.title);
    });
    const empNames = [];
    empArray.forEach( obj => {
        empNames.push(obj.name);
    });

        // promt user for employee and new role
        inquirer.prompt([
            {
                type: 'list',
                message: 'Choose an employee to update',
                choices: empNames,
                name: 'empName'
            },
            {
                type: 'list',
                message: 'Choose a new role for the new employee',
                choices: roleNames,
                name: 'roleName'
            },
        ])
        .then((res) => {
            // assign id to chosen role
            let roleID = 0;
            roleArray.forEach(obj => {
                if (res.roleName == obj.title) {
                    roleID = obj.id;
                }
            })
            // assign id for chosen employee
            let empID = 0;
            empArray.forEach(obj => {
                if (res.empName == obj.name) {
                    empID = obj.id;
                }
            })
    
            db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [roleID, empID], (err, res) => {
                if (err) throw err;
                console.log( '\n', 'Employee successfully updated', '\n');
                whatNext();
            })
        })
    
};

