var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 product_name VARCHAR(60) NULL,
 department_name VARCHAR(60) NULL,
 price DECIMAL(6,2),
 stock_quantity INTEGER(6)
);

-- For bamazonSupervisor.js
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(60),
    over_head_costs DECIMAL(6,2)
);

-- add column
ALTER TABLE products ADD product_sales DECIMAL(6,2);