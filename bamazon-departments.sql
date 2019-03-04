USE bamazon;

-- For bamazonSupervisor.js
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(60),
    over_head_costs DECIMAL(6,2)
);

-- copy from products table to departments table without creating duplicates using SELECT DISTINCT
INSERT INTO departments (department_name) 
SELECT DISTINCT department_name FROM products;

-- check department_name table
SELECT * FROM departments;

-- delete empty rows accidentally created in products table
DELETE FROM products WHERE product_name IS NULL;

-- Add department_id to products table, which references departments
ALTER TABLE products ADD COLUMN department_id INT, 
    ADD FOREIGN KEY (department_id) REFERENCES departments(department_id);
    
-- update products table with corresponding department_id, based on JOIN of department_name in both tables. Multi-Table UPDATE is MySQL only syntax.
UPDATE products JOIN departments USING (department_name)
SET products.department_id = departments.department_id;

-- delete redundant department_name from products table.
ALTER TABLE products DROP COLUMN department_name;

-- make department_name NOT NULL in product table.
ALTER TABLE products MODIFY department_id INT NOT NULL;