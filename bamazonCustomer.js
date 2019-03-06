var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
const colors = require('colors');
var Table = require('cli-table');
// var Table = require('easy-table');
let products; // save database response to global variable
let order; // save selected order to global variable
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
function orderItem(item, qty) {
    let prodTable = new Table({
        head: ["Item ID", "Product Name", "Price", "Quantity", "Total Price"]
    });
    prodTable.push(
        [item.item_id, item.product_name, item.price, qty, (item.price * qty).toFixed(2)]
    );

    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString()); // print the table
    const queryStr = `UPDATE products SET stock_quantity = stock_quantity - ?, 
        product_sales = product_sales + ( price * ? )
        WHERE item_id = ?`;
    connection.query(queryStr, [qty, qty, item.item_id], function (err, response) {
        if (err) throw err;
        console.log("Thanks for your order!\n", response.message);
        restartPrompt();
    });
}

// MYSQL READ All items and show in a table
const getAll = () => {
    let currentID;
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // get an array of ID's to be used to see if the item that the user ordered exists.
        const idArray = response.map(item => item.item_id);
        // generate table
        let prodTable = new Table({
            head: ["Item ID", "Product Name", "Price", "Stock Qty"]
        });
        response.forEach(product => {
            prodTable.push(
                [product.item_id, product.product_name, product.price.toFixed(2), product.stock_quantity]
            );
        });
        console.log(prodTable.toString());

        // get ID first to determine the quantity
        inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Enter the Product ID of the item you wish to buy',
                validate: value => {
                    // console.log(`\n idArray: ${idArray}, Value: ${value}, ${idArray.includes(parseInt(value))}`);
                    if (isNaN(value) === false && idArray.includes(parseInt(value))) {
                        return true;
                    }
                    return "Please enter a number!";
                }
            }
        ]).then(answers => {
            currentID = parseInt(answers.id);
            // depending on currentID, see if required quantity is less than or equal to stock_quantity
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'qty',
                    message: 'How many units do you wish to buy?',
                    validate: value => {
                        if (isNaN(value) === false) {
                            let tempItem = response.find(item => {
                                // console.log(item);
                                return (item.item_id === currentID)
                            });
                            // console.log(tempItem);
                            if (parseInt(value) <= tempItem.stock_quantity && parseInt(value) > 0) {
                                return true;
                            }
                        }
                        return "The quantity must be greater than 0 and less than or equal to current stock quantity!";
                    }
                }
            ]).then(answers => {
                const qty = parseInt(answers.qty);
                const item = response.find(item => {
                    return item.item_id === currentID
                });
                console.log(`Current ID: ${currentID}, Current QTY: ${qty}`);
                orderItem(item, qty);

            })
        });
    });
}

const start = () => {
    console.log('\033[2J'); // clears screen
    console.log(
            // figlet module
            figlet.textSync('The Bamazon Store', {
                font: 'Small Slant',
                kerning: 'fitted',
                horizontalLayout: 'fitted',
                verticalLayout: 'default'
            }).yellow
    );
    getAll();
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

