var mysql = require("mysql");
var inquirer = require("inquirer");
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

function showTable(arg, callback) {
    let prodTable = new Table;
    arg.forEach(element => {
        prodTable.cell("Item ID", element.item_id);
        prodTable.cell("Product Name", element.product_name);
        prodTable.cell("Price", element.price, Table.number(2));
        prodTable.cell("Stock Quantity", element.stock_quantity);
        prodTable.newRow();
    });
    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString());
    callback();
}
function showItem(arg, callback) {
    const total = order.price * currentQTY;
    let prodTable = new Table;
        prodTable.cell("Item ID", arg.item_id);
        prodTable.cell("Product Name", arg.product_name);
        prodTable.cell("Price", arg.price, Table.number(2));
        // prodTable.cell("Stock Quantity", arg.stock_quantity);
        prodTable.cell("Order Quantity", currentQTY);
        prodTable.cell("Total Price", arg.price*currentQTY, Table.number(2));
        prodTable.newRow();
    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString());
    callback();
}

// MYSQL READ All items
const getAll = () => {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // callback(); // CALLBACK
        products = response; // assign to global variable
        showTable(products, buyPrompt);
    });
}

// MYSQL Update
const updateProduct = (callback) => {
    const queryStr = "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ( price * ? ) WHERE item_id = ?";
    connection.query(queryStr, [currentQTY, currentQTY, currentID], function (err, response) {
        if (err) throw err;
        callback(response.message); // CALLBACK
    });
}

const updateStatus = (arg) => {
    console.log(arg);
    restartPrompt();
}

const processOrder = () => {
    if (currentQTY <= order.stock_quantity) {
        console.log("You ordered the proper qty.")
        // update order
        updateProduct(updateStatus)
    } else {
        console.log("you ordered too much!");
        restartPrompt();
    }
}

const start = () => {
    console.log('\033[2J'); // clears screen
    getAll();
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
        showItem(order, processOrder);

    })
}

const restartPrompt = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'continue',
            message: 'Do you want to order again?',
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

