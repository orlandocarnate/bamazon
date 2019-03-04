# bamazon
An Amazon-like storefront using MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

## Technology Used
* Node.js
* MySQL
* [MySQL](https://www.npmjs.com/package/mysql) Node module is a driver for MySQL. 
* [Inquirer](https://www.npmjs.com/package/inquirer) Node module prompts the user. A command line interface (CLI)
* [Easy Table](https://www.npmjs.com/package/easy-table) Node module for formatting tables in the console.
* [CLI table](https://www.npmjs.com/package/cli-table) Another Table alternative for the CLI.

## How the storefront works
### `bamazonCustomer.js`
This program starts with loading the screen with the current list of items available to buy.
![Customer Section 1](/assets/customer-1.jpg)

User then enters the Item ID and quantity. I made sure to validate each entry so that the ID is valid and a number, and that the quantity greater than 0 and less than or equal to the item's stock quantity.
![Customer Section 2](/assets/customer-2.jpg)

### `bamazonManager.js`
The Manager program starts 4 choices: View Products for Sale, View Low Inventory (of less than 5), Update Inventory, and Add New Product.
![Customer Page](/assets/manager-1.jpg)

View Products for Sale section:
![Manager View Inventory](/assets/manager-allinventory.jpg)

View Low Inventory section shows all items that have 5 or less stock quantity:
![Manager View Low Inventory](/assets/manager-low-inv.jpg)

Update Inventory section first shows a list of current items taken from the database table. Then you can add more stock.
![Manager Update Inventory](/assets/manager-update-stock.jpg)

Add New Product section lets you first select from a list the current departments available. 
![Manager Add New Product 1](/assets/manager-insert-1.jpg)

Then it asks for a new product name, price, and stock quantity. Then answers are INSERT INTO products table with a primary key automatically generated.
![CManager Add New Product 2](/assets/manager-insert-2.jpg)

### `bamazonSupervisor.js`
The Supervisor main menu gives you two choices: View Product Sales by Department and Create a New Department. 
![Supervisor Main section](/assets/supervisor-main.jpg)

The View Product Sales by Department menu lets you choose a department from a paginated list. 
![Supervisor View Product Sales](/assets/supervisor-dept1.jpg)

Results from the **video games** department: 
![Supervisor View Product Sales 2](/assets/supervisor-dept2.jpg)

Create a New Department asks you to enter a new department name and overhead costs.
![Supervisor Add New Department](/assets/supervisor-dept2.jpg)


## SQL Commands
* `SELECT * FROM products` - shows all the items in the products table.
* `UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?` - updates the quatity of the selected item by item ID
* INSERT INTO products SET - adds a new item

```
ALTER TABLE table_name ADD column_name datatype --add column
ALTER TABLE table_name DROP COLUMN column_name --delete column
ALTER TABLE table_name ALTER COLUMN column_name datatype --SQL Server
ALTER TABLE table_name MODIFY COLUMN column_name datatype --MySQL
ALTER TABLE table_name MODIFY column_name datatype --Oracle 10G+
```

## Programmer's Notes
* Inquirer can have paginated lists
    * Each item in list can have a value
    * EX: [{name: "item 1, value: 1}]
* [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) was used to see if an array **includes** a certain value, returning *true* or *false*

## Callback workflow
Needed to use lots of callbacks to deal with async issues without installing sync modules.
Need to keep track the flow of callbacks.
1. Call sqlQueryCallFunction(callback)
    * Ex: `viewProducts(tableGenerator);`

### Regular Expressions - doesn't work without an npm module
[W3Schools .match(regexp)](https://www.w3schools.com/js/js_regexp.asp)