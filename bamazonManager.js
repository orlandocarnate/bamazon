var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

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

function tableGenerator(arg, callback) {
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

const viewProducts = (callback) => {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        products = response; // assign to global variable
        callback(response, goHome);
    });
}


function viewLowInventory(callback) {
    // show inventory where QTY <= 5
    const queryStr = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        products = response; // assign to global variable
        callback(response, goHome);
    });
}

let prod;
function addToInventory(callback) {
    // get all the products
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        prod = response.map(element => {
            let obj = {};
            obj.name = element.product_name;
            obj.value = element.item_id
            return obj
        }); // assign to global variable
        // console.log(prod);
        callback(prod);
    });
    // increase QTY of specific product

}

function addInvPrompt (prod) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'itemID',
            message: 'Please select from the list that you would like to add more of.',
            paginated: true,
            choices: prod
        }
    ]).then(answers => {
        console.log(answers.itemID);
        // const currentID = parseInt(answers.itemID);
        //
    })
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
                viewProducts(tableGenerator);
                break;
            case 'View Low Inventory':
                viewLowInventory(tableGenerator);
                break;
            case 'Add to Inventory':
                addToInventory(addInvPrompt);
                break;
            case 'Add New Product':
                addNewProduct(goHome);
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
