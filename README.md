# bamazon
An Amazon-like storefront using MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

## Technology Used
* Node.js
* MySQL
* [MySQL](https://www.npmjs.com/package/mysql) Node module is a driver for MySQL. 
* [Inquirer](https://www.npmjs.com/package/inquirer) Node module prompts the user. A command line interface (CLI)
* [Easy Table](https://www.npmjs.com/package/easy-table) Node module for formatting tables in the console.
* [CLI table](https://www.npmjs.com/package/cli-table) Another Table alternative for the CLI.

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

## Callback workflow
Needed to use lots of callbacks to deal with async issues without installing sync modules.
Need to keep track the flow of callbacks.
1. Call sqlQueryCallFunction(callback)
    * Ex: `viewProducts(tableGenerator);`

### Regular Expressions - doesn't work without an npm module
[W3Schools .match(regexp)](https://www.w3schools.com/js/js_regexp.asp)