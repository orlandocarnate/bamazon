var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

const getAllDept = (callback) => {
    const queryStr = "SELECT department_name FROM products";
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        callback(response, selectDeptPrompt); // Callback = tableGenerator()
    });
}
// View Product Sales By Department
// Table Header: dept_id, dept_name, over_head_costs, product_sales, total_profits
// total_profit = product_sales - over_head_costs
const viewSingleDept = (callback) => {
    // show inventory where QTY <= 5
    const queryStr = `SELECT department_id,
        department_name,
        overhead_costs,
        price*stock_quantity AS prod_sales,
        prod_sales-overhead_costs AS total_profit
        FROM products`;
    connection.query(queryStr, function (err, response) {
        if (err) throw err;
        products = response; // assign to global variable
        callback(response, mainMenu); // callback = tableGenerator()
    });
}

// Create New Department


// ----- TABLE GENERATORS ----- \\
const tableGenerator = (arg, callback) => {
    console.log('\033[2J'); // clears screen
    let prodTable = new Table;
    arg.forEach(element => {
        prodTable.cell("Dept. ID", element.item_id);
        prodTable.cell("Dept. Name", element.product_name);
        prodTable.cell("Overhead Costs", element.overhead, Table.number(2));
        prodTable.cell("Product Sales", element.prod_sales, Table.number(2));
        prodTable.cell("total_profit", element.total_profit, Table.number(2))
        prodTable.newRow();
    });
    console.log('\033[2J'); // clears screen
    console.log(prodTable.toString());
    callback(); // callback = mainMenu()
}

const selectDeptPrompt = (deptArray, callback) => {
    const deptArray = response.map(element => {
        let obj = {};
        obj.name = element.product_name;
        obj.value = element.item_id
        return obj
    });
    const menu = {
        type: 'list',
        name: 'cateID',
        message: 'Please select a department from the list:',
        paginated: true,
        choices: deptArray
    };
    inquirer.prompt(menu).then(answers => {
        currentID = parseInt(answers.catID);
        callback(currentID, viewSingleDept); // call viewSingleDept()
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
                getAllDept(tableGenerator);
                break;
            case 'Create New Department':
                insertDept(tableGenerator);
                break;
            case 'Quit':
                exitApp();
                break;
        }
    });
}

const exitApp = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'exitapp',
            message: 'Are you sure you want to quit?',
            default: false
        }
    ]).then(answers => {
        if (answers.exitapp) {
            console.log("Goodbye!");
            connection.end();// end connection
        } else {
            mainMenu();
        }
    })
}