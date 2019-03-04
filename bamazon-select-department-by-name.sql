SELECT * FROM bamazon.products;
SELECT * FROM departments;

SELECT * FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE department_id = 3;

SELECT products.product_name, products.price, products.stock_quantity, departments.department_name
FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE products.department_id = 3;