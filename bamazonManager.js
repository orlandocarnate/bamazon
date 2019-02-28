var mysql = require("mysql");
var inquirer = require("inquirer");

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

var menu = {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
};

function start() {
    console.log('Main Menu');
    menu();
}

const exitApp = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'gohome',
            message: 'Are you sure you want to Quit?',
            default: false
        }
    ]).then(answers => {
        if (answers.gohome) {
            console.log("Goodbye!");
            closeDB();
        } else {
            mainMenu();
        }
    })
}

function viewProducts(callback) {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // callback(); // CALLBACK
        products = response; // assign to global variable
        callback(response);
    });
}

function showProducts(arg) {
    console.log(arg.map(element => {
        return `ID: ${element.item_id} Name: ${element.product_name} Price: $${element.price} Qty Left: ${element.stock_quantity}`
    }).join("\n"));
    goHome();
}

function viewLowInventory() {
    // show inventory where QTY <= 5
}

function addToInventory() {
    // increase QTY of specific product
}

function addNewProduct() {
    // INSERT INTO a new product.
}

function mainMenu() {
    console.log('\033[2J'); // clears screen
    inquirer.prompt(menu).then(answers => {
        // console.log(answers);
        switch (answers.menu) {

            case 'View Products For Sale':
                viewProducts(showProducts)
                break;
            case 'View Low Inventory':
                viewLowInventory(goHome)
                break;
            case 'Add to Inventory':
                addToInventory(goHome)
                break;
            case 'Add New Product':
                addNewProduct(goHome)
                break;
            case 'Quit':
                exitApp();
                break;
        }
    });
}

function goHome() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'gohome',
            message: 'Return to Menu?',
            default: true
        }
    ]).then(answers => {
        if (answers.gohome) {
            mainMenu();
        } else {
            console.log("Goodbye!");
            closeDB();
        }
    })
}

mainMenu();
