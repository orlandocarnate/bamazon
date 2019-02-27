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
