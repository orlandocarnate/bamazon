var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');


// View Product Sales By Department
// Table Header: dept_id, dept_name, over_head_costs, product_sales, total_profits
// total_profit = product_sales - over_head_costs


// Create New Department