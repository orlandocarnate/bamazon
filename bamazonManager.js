var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require('figlet');
const colors = require('colors');
var Table = require('cli-table');

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

const viewInventory = () => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('All Inventory', { font: 'Small Slant' }).yellow);
    const queryStr = `
    SELECT 
    item_id, 
    product_name,
    departments.department_name AS department,
    price,
    stock_quantity,
    product_sales 
    FROM products
    INNER JOIN departments
    ON products.department_id = departments.department_id
    ORDER BY department
    `;
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        response; // assign to global variable
        let prodTable = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Stock Qty", "Product Sales"]
        });
        response.forEach(element => {
            prodTable.push(
                [element.item_id, element.product_name, element.department,
                element.price.toFixed(2), element.stock_quantity, element.product_sales.toFixed(2)]
            )
        });
        console.log(prodTable.toString());
        goHome();
    });
}

const viewLowInventory = (callback) => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Low Inventory', { font: 'Small Slant' }).yellow);
    // show inventory where QTY <= 5
    const queryStr = `
    SELECT 
    item_id, 
    product_name,
    price,
    stock_quantity,
    product_sales 
    FROM products
    WHERE stock_quantity <= 5`;
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        let prodTable = new Table({
            head: ["Item ID", "Product Name", "Price", "Stock Qty", "Product Sales"]
        });
        response.forEach(element => {
            prodTable.push(
                [element.item_id, element.product_name, element.price.toFixed(2),
                element.stock_quantity, element.product_sales.toFixed(2)]
            )
        });
        console.log(prodTable.toString());
        goHome();
    });
}

const updateInventoryList = () => {
    console.log('\033[2J'); // clears screen
    console.log(figlet.textSync('Update Inventory', { font: 'Small Slant' }).yellow);
    // get all the products to insert as a list of choices
    const queryStr = "SELECT item_id, product_name FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        // create array of objects with name and value as keys
        const prodArray = response.map(element => {
            let obj = {};
            obj.name = element.product_name;
            obj.value = element.item_id;
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
            updateSingleItem(currentID, addQty); // update single item
        })
    });
}

const updateSingleItem = (currentID, currentQTY) => {
    const queryStr = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?";
    connection.query(queryStr, [currentQTY, currentID], function (err, response) {
        if (err) throw err;
        const singleQuery = `
        SELECT * FROM products 
        INNER JOIN departments 
        ON products.department_id = departments.department_id 
        WHERE item_id = ?`;
        connection.query(singleQuery, currentID, function (err, response) {
            if (err) throw err;
            // generate table
            let prodTable = new Table({
                head: ["Item ID", "Product Name", "Price", "Dept", "Stock Qty"]
            });
            prodTable.push(
                [response[0].item_id, response[0].product_name, response[0].price.toFixed(2), response[0].department_name, response[0].stock_quantity]
                );
                console.log(prodTable.toString());
                console.log(`${response[0].product_name.toUpperCase()} Has been successfully updated!\n ${response.message}`);
            goHome();
        });
    })
}

// ADD NEW ITEM
const insertPrompt = () => {
        console.log('\033[2J'); // clears screen
        console.log(figlet.textSync('Add New item', { font: 'Small Slant' }).yellow);
        // get list of existing deparments
        const queryStr = "SELECT department_id, department_name FROM departments";
        connection.query(queryStr, function (err, response) {
            if (err) throw err;
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
            }); // ends .then()
        })
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
            console.log(product_name.toUpperCase() + " has been added!");
            
            // show single item from database
            const singleQuery = `
            SELECT * FROM products 
            INNER JOIN departments 
            ON products.department_id = departments.department_id 
            WHERE product_name = ?`;
            connection.query(singleQuery, product_name, function (err, response) {
                if (err) throw err;
                // get an array of ID's to be used to see if the item that the user ordered exists.
                // generate table
                let prodTable = new Table({
                    head: ["Item ID", "Product Name", "Price", "Dept", "Stock Qty"]
                });
                prodTable.push(
                    [response[0].item_id, response[0].product_name, response[0].price.toFixed(2), response[0].department_name, response[0].stock_quantity]
                    );
                    console.log(prodTable.toString());
                    console.log(`${response[0].product_name.toUpperCase()} Has been Added Sucessfully!\n ${response.message}`);
                goHome();
            })
        });
    }

    const mainMenu = () => {
        console.log('\033[2J'); // clears screen
        console.log(figlet.textSync('Bamazon').yellow);
        console.log(figlet.textSync('Manager Page').yellow);
        console.log(figlet.textSync('Main Menu', { font: 'Small Slant' }).yellow);

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

    mainMenu(); // run program
