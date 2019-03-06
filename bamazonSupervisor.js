var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
const colors = require('colors');
var Table = require('cli-table');

// MySQL Config
const config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
}

// ESTABLISH CONNECTION object
var connection = mysql.createConnection(config);

// show list of existing departments to select from
const viewAllDept = () => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Department Page', { font: 'Small Slant' }));
    const queryStr = 'SELECT department_id, department_name FROM departments';
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        const deptArray = response.map(dept => {
            let obj = {};
            obj.name = dept.department_name;
            obj.value = dept.department_id;
            return obj
        });
        const menu = {
            type: 'list',
            name: 'deptid',
            message: 'Please select a department from the list:',
            paginated: true,
            choices: deptArray
        };
        inquirer.prompt(menu).then(answers => {
            const department_id = parseInt(answers.deptid);
            viewSingleDept(department_id);
        });
    });
}

const viewSingleDept = (id) => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Department Page', { font: 'Small Slant' }).yellow);
    const queryStr = `
    SELECT products.department_id, 
        departments.department_name, 
        departments.over_head_costs, 
        SUM(products.product_sales) AS product_sales, 
        SUM(products.product_sales)-departments.over_head_costs AS total_profit
    FROM products 
    INNER JOIN departments
    ON products.department_id = departments.department_id
    WHERE departments.department_id = ?
    GROUP BY departments.department_name;`;
    connection.query(queryStr, id, function (err, response) {
        if (err) throw err;
        console.log('\033[2J'); // clears screen
        let deptTable = new Table({
            head: ["Dept ID", "Dept Name", "Overhead Costs", "Product Sales", "Total Profit"]
        });
        response.forEach(dept => {
            deptTable.push(
                [dept.department_id, dept.department_name, dept.over_head_costs.toFixed(2), dept.product_sales.toFixed(2), dept.total_profit.toFixed(2)]
            );
        });
        console.log('\033[2J'); // clears screen
        console.log(figlet.textSync('Department Page', { font: 'Small Slant' }).yellow);
        console.log(deptTable.toString());
        goHome(); // callback = mainMenu()
    });
}

// ADD NEW DEPT
const insertDept = () => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Add New Department', { font: 'Small Slant' }).yellow);
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'Please enter a new department name: '
        },
        {
            type: 'input',
            name: 'over_head_costs',
            message: 'Please enter overhead cost: ',
            validate: value => {
                if (isNaN(value) === false) {
                    return true;
                }
                return "Please enter a number!";
            }
        }
    ]).then(answers => {
        const department_name = answers.department_name;
        const over_head_costs = parseFloat(answers.over_head_costs);
        // 
        insertItem(department_name, over_head_costs); // update single item
    })
}

// SQL INSERT/CREATE
const insertItem = (department_name, over_head_costs) => {
    const queryStr = "INSERT INTO departments SET ?";
    const newitem = [{
        department_name: department_name.trim(),
        over_head_costs: over_head_costs
    }]
    connection.query(queryStr, newitem, function (err, response) {
        if (err) throw err;
        console.log(department_name.toUpperCase() + " has been added successfully!\n" + response.message);
        const singleQuery = `
        SELECT * FROM departments 
        WHERE department_name = ?`;
        connection.query(singleQuery, department_name, function (err, response) {
            if (err) throw err;
            // get an array of ID's to be used to see if the item that the user ordered exists.
            // generate table
            let deptTable = new Table({
                head: ["Dept ID", "Dept Name", "Overhead Costs"]
            });
            deptTable.push(
                [response[0].department_id, response[0].department_name, response[0].over_head_costs.toFixed(2)]
            );
            console.log(deptTable.toString());
            console.log(`${response[0].department_name.toUpperCase()} Has been Added Sucessfully!`);
            goHome();
        });
    })
}

const mainMenu = () => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Bamazon').yellow);
    console.log(figlet.textSync('Supervisor Page').yellow);
    console.log(figlet.textSync('Main Menu', { font: 'Small Slant' }).yellow);
    const menu = {
        type: 'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit Program']
    };
    inquirer.prompt(menu).then(answers => {
        // console.log(answers);
        switch (answers.menu) {
            case 'View Product Sales by Department':
                viewAllDept();
                break;
            case 'Create New Department':
                insertDept();
                break;
            case 'Exit Program':
                quit();
                break;
        }
    });
}

const goHome = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Return to Menu or Quit?',
            choices: ["Main Menu", "Quit"]
        }
    ]).then(answers => {
        switch (answers.menu) {
            case 'Main Menu':
                mainMenu();
                break;
            case 'Quit':
                quit();
                break;
        }
    })
}

const quit = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'menu',
            message: 'Are you sure you want to quit?',
            default: true
        }
    ]).then(answers => {
        if (answers.menu) {
            console.log("Goodbye!");
            connection.end();
        } else {
            mainMenu();
        }

    })
}

mainMenu();