var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
const chalk = require('chalk');

var Table = require('easy-table');
let products; // save database response to global variable
let order; // save selected order to global variable
let currentID;
let currentQTY;
const heading = [
    ['Id', 'Product Name', 'Department', 'Price', 'Stock Qty']
]
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

// End connection when done.
const closeDB = () => {
    connection.end();
}

// show selected item with quantity and total price
function showItem(item) {
    const total = order.price * currentQTY;
    let prodTable = new Table;
    prodTable.cell("Item ID", item.item_id);
    prodTable.cell("Product Name", item.product_name);
    prodTable.cell("Price", item.price, Table.number(2));
    // prodTable.cell("Stock Quantity", arg.stock_quantity);
    prodTable.cell("Order Quantity", currentQTY);
    prodTable.cell("Total Price", item.price * currentQTY, Table.number(2));
    prodTable.newRow();
    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString());
    // callback();
    if (currentQTY <= order.stock_quantity) {
        console.log("You ordered the proper qty.")
        // update order
        // updateProduct(updateStatus)
        const queryStr = "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ( price * ? ) WHERE item_id = ?";
        connection.query(queryStr, [currentQTY, currentQTY, item.item_id], function (err, response) {
            if (err) throw err;
            // callback(response.message); // CALLBACK
            console.log(response.message);
            restartPrompt();
        });
    } else {
        console.log("you ordered too much!");
        restartPrompt();
    }
}

// MYSQL READ All items and show in a table
const getAll = () => {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // callback(); // CALLBACK
        products = response; // assign to global variable

        // generate table
        let prodTable = new Table;
        products.forEach(product => {
            prodTable.cell("Item ID", product.item_id);
            prodTable.cell("Product Name", product.product_name);
            prodTable.cell("Price", product.price, Table.number(2));
            prodTable.cell("Stock Quantity", product.stock_quantity);
            prodTable.newRow();
        });
        // console.log('\033[2J'); // clears screen
        console.log(prodTable.toString());
        buyPrompt();
    });
}

const start = () => {
    console.log('\033[2J'); // clears screen
    console.log(
        // chalk module
        chalk.yellow(
            // figlet module
            figlet.textSync('The Bamazon Store', {
                font: 'Small Slant',
                kerning: 'fitted',
                horizontalLayout: 'fitted',
                verticalLayout: 'default'
            })
        )
    );
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: 'Welcome to Bamazon! Press enter to continue...',
            default: true
        }

    ]).then(answers => {
        if (answers.continue) {
            getAll();
        } else {
            console.log("Goodbye!");
            closeDB();
        }
    })
    
}

const buyPrompt = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the Product ID of the item you wish to buy',
            validate: value => {
                if (isNaN(value) === false) {
                    return true;
                }
                return "Please enter a number!";
            }
        },
        {
            type: 'input',
            name: 'qty',
            message: 'How many units do you wish to buy?',
            validate: value => {
                if (isNaN(value) === false) {
                    return true;
                }
                return "Please enter a number!";
            }
        }

    ]).then(answers => {
        currentID = parseInt(answers.id);
        currentQTY = parseInt(answers.qty);
        order = products.find(element => {
            // console.log(element, currentID);
            return element.item_id === currentID
        });
        console.log(order);
        showItem(order);

    })
}

const restartPrompt = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: 'Would you like to continue shopping?',
            default: true
        }

    ]).then(answers => {
        if (answers.continue) {
            start();
        } else {
            console.log("Goodbye!");
            closeDB();
        }
    })
}

start();

