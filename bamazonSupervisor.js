var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
var figlet = require('figlet');
const chalk = require('chalk');

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
    console.log(chalk.yellow(figlet.textSync('Department Page', { font: 'Small Slant' })));
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
    console.log(chalk.yellow(figlet.textSync('Department Page', { font: 'Small Slant' })));
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
        let prodTable = new Table;
        response.forEach(dept => {
            prodTable.cell("Dept. ID", dept.department_id);
            prodTable.cell("Dept. Name", dept.department_name);
            prodTable.cell("Overhead Costs", dept.over_head_costs, Table.number(2));
            prodTable.cell("Product Sales", dept.product_sales, Table.number(2));
            prodTable.cell("total_profit", dept.total_profit, Table.number(2))
            prodTable.newRow();
        });
        console.log('\033[2J'); // clears screen
        console.log(prodTable.toString());
        goHome(); // callback = mainMenu()
    });
}

// ADD NEW ITEM
const insertDept = () => {
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('Add New Department', { font: 'Small Slant' })));
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
        console.log(department_name.toUpperCase() + " has been added!\n" + response.message);
        goHome();
    });
}
const mainMenu = () => {
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('Bamazon')));
    console.log(chalk.yellow(figlet.textSync('Supervisor Page')));
    console.log(chalk.yellow(figlet.textSync('Main Menu', { font: 'Small Slant' })));
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