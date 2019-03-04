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
    // show inventory where QTY <= 5
    const queryStr = 'SELECT department_id, department_name FROM departments';
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        const deptArray = response.map(dept => {
            let obj = {};
            obj.name = dept.department_name;
            obj.value = dept.department_id
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
    // show inventory where QTY <= 5
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
        mainMenu(); // callback = mainMenu()
    });
}

// ADD NEW ITEM
const insertDept = () => {
    console.log(chalk.yellow(figlet.textSync('Add Department item', { font: 'Small Slant' })));
    // get list of existing deparments
    const queryStr = "SELECT department_id, department_name FROM departments";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        console.log(response);
        // create array of objects with name and value as keys
        const deptArray = response.map(dept => {
            let obj = {};
            obj.value = dept.department_id;
            obj.name = `[ID: ${dept.department_id}] ${dept.department_name}`;
            return obj
        });
        // pass deptArray as list of choices
        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Please select a department from the list.\n',
                paginated: true,
                choices: deptArray
            },
            {
                type: 'input',
                name: 'product_name',
                message: 'Please enter a product name: ',
            },
            {
                type: 'input',
                name: 'price',
                message: 'Enter price:',
                validate: value => {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    return "Please enter a number!";
                }
            },
            {
                type: 'input',
                name: 'stock_quantity',
                message: 'Enter initial stock quantity:',
                validate: value => {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return "Please enter a number!";
                }
            }
        ]).then(answers => {
            const department_id = parseInt(answers.department_id);
            const product_name = answers.product_name;
            const price = parseFloat(answers.price);
            const stock_quantity = parseInt(answers.stock_quantity);
            // 
            insertItem(department_id, product_name, price, stock_quantity); // update single item
        })

    });
}
// SQL INSERT/CREATE
const insertItem = (department_id, product_name, price, stock_quantity) => {
    const queryStr = "INSERT INTO products SET ?";
    const newitem = [{
        product_name: product_name,
        department_id: department_id,
        price: price,
        stock_quantity: stock_quantity
    }]
    connection.query(queryStr, newitem, function (err, response) {
        if (err) throw err;
        console.log(response.message);
        console.log(product_name.toUpperCase() + " has been added!");
        goHome();
    });
}
const mainMenu = () => {
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