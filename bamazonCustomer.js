var mysql = require("mysql");
var inquirer = require("inquirer");
let products;
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

// show items as a table
const showTable = () => {
    const items = products.map(product => {
        return `ID: ${product.item_id}, Name: ${product.product_name} \t Price: $${product.price} \t QTY: ${product.stock_quantity}`;

    })
    console.log(items.join("\n"));
    buyPrompt();
}

const getItem = (id, callback) => {

}

// MYSQL READ All items
const getAll = (callback) => {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // callback(); // CALLBACK
        products = response; // assign to global variable
        callback();
    });
}

// MYSQL Update
const updateProduct = (id, quantity, callback) => {
    const queryStr = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";
    connection.query(queryStr, [quantity, id], function (err, response) {
        if (err) throw err;
        callback(response.message); // CALLBACK
    });
}

const updateStatus = (arg) => {
    console.log(arg);
    restartPrompt();
}

const processOrder = (id, qty) => {
    const order = products.find(element => {
        if (element.item_id = id) {
            return element
        }
    });
    const total = order.price * qty;
    console.log(`Selected Item: ID: ${order.item_id} Name: ${order.product_name} Price: $${order.price} Qty Left: ${order.stock_quantity}`);
    console.log(`Your order Qty: ${qty}, Total Price: $${total}`);
    if (qty <= order.stock_quantity) {
        console.log("You ordered the proper qty.")
        // update order
        updateProduct(id, qty, updateStatus)
    } else {

        console.log("you ordered too much!");
        restartPrompt();
    }
}

    const start = () => {
        console.log('\033[2J'); // clears screen
        getAll(showTable);
    }

    const buyPrompt = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Enter the Product ID of the item you wish to buy'
            },
            {
                type: 'input',
                name: 'qty',
                message: 'How many units do you wish to buy?'
            }

        ]).then(answers => {
            const id = answers.id;
            const qty = answers.qty;

            processOrder(id, qty);

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
            }
        })
    }

    start();

    closeDB();