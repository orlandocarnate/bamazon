DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

-- PRODUCTS - UPDATED to include department_id and department_name dropped.
CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 product_name VARCHAR(60) NULL,
 price DECIMAL(10,2),
 stock_quantity INTEGER(10),
 product_sales DECIMAL(10,2) DEFAULT 0,
 department_id INT
);

-- DEPARTMENTS
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(60),
    over_head_costs DECIMAL(10,2)
);