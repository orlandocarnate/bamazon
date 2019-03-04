SELECT * FROM bamazon.products;
SELECT * FROM departments;

SELECT * FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE department_id = 3;

-- show products by department
SELECT products.product_name, products.price, products.stock_quantity, departments.department_name, product_sales
FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE products.department_id = 2;

-- show product sales by department
SELECT products.department_id, 
	departments.department_name, 
	SUM(products.product_sales) AS total_sale, 
    departments.over_head_costs, 
    SUM(products.product_sales)-departments.over_head_costs AS profit
FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE departments.department_id = 2
GROUP BY departments.department_name;