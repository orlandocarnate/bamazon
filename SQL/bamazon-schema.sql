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

-- add product_sales column
ALTER TABLE products ADD product_sales DECIMAL(6,2);

UPDATE products SET product_sales = 0;

SELECT * FROM products;

SELECT 
department_id, department_name, overhead_costs, price*stock_quantity AS prod_sales, 
prod_sales-overhead_costs AS total_profit 
FROM products;