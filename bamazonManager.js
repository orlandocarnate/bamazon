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

// ----- ALL ITEMS TABLE GENERATORS ----- \\
const tableGenerator = (arg, callback) => {

}

// ----- CRUD FUNCTIONS ----- \\

const viewInventory = () => {
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('All Inventory', { font: 'Small Slant' })));
    const queryStr = `
    SELECT 
    item_id, 
    product_name,
    price,
    stock_quantity,
    CAST(product_sales AS DECIMAL(6,2)) AS sales 
    FROM products
    `;
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        response; // assign to global variable
        let prodTable = new Table;
        response.forEach(element => {
            prodTable.cell("Item ID", element.item_id);
            prodTable.cell("Product Name", element.product_name);
            prodTable.cell("Price", element.price, Table.number(2));
            prodTable.cell("Stock Quantity", element.stock_quantity);
            prodTable.cell("Product Sales", element.sales, Table.number(2));
            prodTable.newRow();
        });
        console.log(prodTable.toString());
        goHome();
    });
}

const viewLowInventory = (callback) => {
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('Low Inventory', { font: 'Small Slant' })));
    // show inventory where QTY <= 5
    const queryStr = `
    SELECT 
    item_id, 
    product_name,
    price,
    stock_quantity,
    CAST(product_sales AS DECIMAL(6,2)) AS sales 
    FROM products
    WHERE stock_quantity <= 5`;
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        let prodTable = new Table;
        response.forEach(element => {
            prodTable.cell("Item ID", element.item_id);
            prodTable.cell("Product Name", element.product_name);
            prodTable.cell("Price", element.price, Table.number(2));
            prodTable.cell("Stock Quantity", element.stock_quantity);
            prodTable.cell("Product Sales", element.sales, Table.number(2));
            prodTable.newRow();
        });
        console.log(prodTable.toString());
        goHome();
    });
}

const updateInventoryList = () => {
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('Update Inventory', { font: 'Small Slant' })));
    // get all the products to insert as a list of choices
    const queryStr = "SELECT item_id, product_name FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // create array of objects with name and value as keys
        const prodArray = response.map(element => {
            let obj = {};
            obj.name = element.product_name;
            obj.value = element.item_id
            return obj
        });
        // pass prodArray as list of choices
        inquirer.prompt([
            {
                type: 'list',
                name: 'itemID',
                message: 'Please select from the list that you would like to add more of.\n',
                paginated: true,
                choices: prodArray
            },
            {
                type: 'input',
                name: 'itemQty',
                message: 'How much would you like to add? ',
                validate: value => {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    return "Please enter a number!";
                }
            }
        ]).then(answers => {
            const currentID = parseInt(answers.itemID);
            const addQty = parseInt(answers.itemQty);
            // console.log(`ID: ${currentID}, Qty to add: ${addQty}`);
            updateSingleItem(currentID, addQty); // update single item
        })
    });
}

const updateSingleItem = (currentID, currentQTY) => {
    const queryStr = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
    connection.query(queryStr, [currentQTY, currentID], function (err, response) {
        if (err) throw err;
        console.log(response.message);
        goHome();
    });
}

// ADD NEW ITEM
const insertPrompt = () => {
    console.log(chalk.yellow(figlet.textSync('Add New item', { font: 'Small Slant' })));
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
    console.log('\033[2J'); // clears screen
    console.log(chalk.yellow(figlet.textSync('Bamazon')));
    console.log(chalk.yellow(figlet.textSync('Manager Page')));
    console.log(chalk.yellow(figlet.textSync('Main Menu', {font: 'Small Slant'})));

    console.log("\n");
    const menu = {
        type: 'list',
        name: 'menu',
        message: 'Please select an option below:',
        choices: ['View Products For Sale', 'View Low Inventory', 'Update Inventory', 'Add New Product', 'Quit']
    };
    inquirer.prompt(menu).then(answers => {
        // console.log(answers);
        switch (answers.menu) {

            case 'View Products For Sale':
                viewInventory();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Update Inventory':
                updateInventoryList(); // SQL SELECT *, then set callback to UpdatePrompt
                break;
            case 'Add New Product':
                insertPrompt();
                break;
            case 'Quit':
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

// ----- END INQUIRER PROMPTS ----- \\

mainMenu(); // run program
