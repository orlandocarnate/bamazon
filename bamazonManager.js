var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');
let prod;

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

var menu = {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
};

// ----- CRUD FUNCTIONS ----- \\

const viewProducts = (callback) => {
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        products = response; // assign to global variable
        callback(response, goHome); // Callback = tableGenerator()
    });
}

const viewLowInventory = (callback) => {
    // show inventory where QTY <= 5
    const queryStr = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        products = response; // assign to global variable
        callback(response, goHome); // callback = tableGenerator()
    });
}

const updateInventoryList = (callback) => {
    // get all the products
    const queryStr = "SELECT * FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        const prodArray = response.map(element => {
            let obj = {};
            obj.name = element.product_name;
            obj.value = element.item_id
            return obj
        });
        //
        callback(prodArray, updateSingleItem); // Callback = updateInventoryPrompt()
    });
}

const updateSingleItem = (currentID, currentQTY, callback) => {
    const queryStr = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
    connection.query(queryStr, [currentQTY, currentID], function (err, response) {
        if (err) throw err;
        console.log(response.message);
        callback(); // CALLBACK -> goHome()
    });
}

const insertItem = (product_name, department_name, price, stock_quantity, callback) => {
    const queryStr = "INSERT INTO products SET ?";
    const newitem = [{
        product_name: product_name,
        department_name: department_name,
        price: price,
        stock_quantity: stock_quantity
    }]
    connection.query(queryStr, newitem, function (err, response) {
        if (err) throw err;
        console.log(response.message);
        callback(); // CALLBACK -> goHome()
    });
}

// ----- END CRUD FUNCTIONS ----- \\


// ----- TABLE GENERATORS ----- \\
const tableGenerator = (arg, callback) => {
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
    callback(); // callback = goHome()
}

const singleItemTable = (arg, callback) => {
    const total = order.price * currentQTY;
    let prodTable = new Table;
    prodTable.cell("Item ID", arg.item_id);
    prodTable.cell("Product Name", arg.product_name);
    prodTable.cell("Price", arg.price, Table.number(2));
    // prodTable.cell("Stock Quantity", arg.stock_quantity);
    prodTable.cell("Order Quantity", currentQTY);
    prodTable.cell("Total Price", arg.price * currentQTY, Table.number(2));
    prodTable.newRow();
    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString());
    callback();
}
// ----- END TABLE GENERATORS ----- \\


// ----- INQUIRER PROMPTS ----- \\
const updateInventoryPrompt = (prodArray, callback) => {
    let currentID;
    let addQty;
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
        currentID = parseInt(answers.itemID);
        addQty = parseInt(answers.itemQty);
        console.log(answers);
        console.log(`ID: ${currentID}, Qty to add: ${addQty}`);
        callback(currentID, addQty, goHome); // call updateSingleItem()
    })
}

const insertNewProduct = (callback) => {
    // INSERT INTO a new product.
    let currentID;
    let addQty;
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter a product name: ',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Enter department name:',
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
        currentID = parseInt(answers.itemID);
        addQty = parseInt(answers.itemQty);
        console.log(`New item you are adding:\nName: ${answers.product_name}, Dept: ${answers.department_name}, Price: $${answers.price}, Stock Qty: ${answers.stock_quantity}`);
        callback(answers.product_name, answers.department_name, parseInt(answers.price), parseInt(answers.stock_quantity), goHome); // call updateSingleItem()
    })
}

const mainMenu = () => {
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
                updateInventoryList(updateInventoryPrompt); // SQL SELECT *, then set callback to UpdatePrompt
                break;
            case 'Add New Product':
                insertNewProduct(insertItem);
                break;
            case 'Quit':
                goHome();
                break;
        }
    });
}

const goHome = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'gohome',
            message: '(Y) for Menu, (N) to Quit: ',
            default: true
        }
    ]).then(answers => {
        if (answers.gohome) {
            mainMenu();
        } else {
            console.log("Goodbye!");
            connection.end();// end connection
        }
    })
}
// ----- END INQUIRER PROMPTS ----- \\

mainMenu(); // run program
