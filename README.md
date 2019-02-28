# bamazon
An Amazon-like storefront using MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

## Technology Used
* Node.js
* MySQL
* [MySQL](https://www.npmjs.com/package/mysql) Node module is a driver for MySQL. 
* [Inquirer](https://www.npmjs.com/package/inquirer) Node module prompts the user. A command line interface (CLI)
* [Easy Table](https://www.npmjs.com/package/easy-table) Node module for formatting tables in the console.
* [CLI table](https://www.npmjs.com/package/cli-table) Another Table alternative for the CLI.


## Programmer's Notes
* Inquirer can have paginated lists
    * Each item in list can have a value
    * EX: [{name: "item 1, value: 1}]

### Regular Expressions - doesn't work without an npm module
[W3Schools .match(regexp)](https://www.w3schools.com/js/js_regexp.asp)