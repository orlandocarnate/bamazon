# bamazon
An Amazon-like storefront usingNode.js for the Command Line Interface and MySQL for the database. The app will take in orders from customers and deplete stock from the store's inventory.

## Technology Used
* [Node.js](https://nodejs.org/)
* [MySQL database](https://www.mysql.com/)
* [MySQL module](https://www.npmjs.com/package/mysql) Node module is a driver for MySQL. 
* [Inquirer module](https://www.npmjs.com/package/inquirer) Node module prompts the user. A command line interface (CLI)
* [Easy Table module](https://www.npmjs.com/package/easy-table) Node module for formatting tables in the console.
* [CLI table module](https://www.npmjs.com/package/cli-table) Another Table alternative for the CLI.

## SQL Schema and Seeds for the product and department table
* [SQL Product Table Schema](/SQL/bamazon-schema.sql)
* [SQL Department Table Schema](/SQL/bamazon-departments.sql)
* [Sample Seeds](/SQL/bamazon-seeds.sql)

## How the storefront works
### `bamazonCustomer.js`
This program starts with loading the screen with the current list of items available to buy.
![Customer Section 1](/assets/customer-1.JPG)

User then enters the Item ID and quantity. I made sure to validate each entry so that the ID is valid and a number, and that the quantity greater than 0 and less than or equal to the item's stock quantity.
![Customer Section 2](/assets/customer-2.JPG)

#### SQL commands used:
* `SELECT * FROM products` gets all the products from the product table
* Once the order has been entered, the product table is updated with the following SQL commands:
```
UPDATE products 
SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ( price * ? ) 
WHERE item_id = ?
```

### `bamazonManager.js`
The Manager program starts with 4 choices: 
    * View Products for Sale
    * View Low Inventory (of less than 5)
    * Update Inventory
    * Add New Product.
![Customer Page](/assets/manager-1.JPG)

View Products for Sale section:
![Manager View Inventory](/assets/manager-allinventory.JPG)

View Low Inventory section shows all items that have 5 or less stock quantity:
![Manager View Low Inventory](/assets/manager-low-inv.JPG)

Update Inventory section first shows a list of current items taken from the database table. Then you can add more stock.
![Manager Update Inventory](/assets/manager-update-stock1.JPG)

Add New Product section lets you first select from a list the current departments available. 
![Manager Add New Product 1](/assets/manager-insert-1.JPG)

Then it asks for a new product name, price, and stock quantity. Then answers are INSERT INTO products table with a primary key automatically generated.
![CManager Add New Product 2](/assets/manager-insert-2.JPG)

#### SQL commands used:
* An `INNER JOIN` and `ON products.department_id = departments.department_id` was used to join the `product` and `departments` table by their IDs.
* `CAST()` was used to display product_sales in decimal form at two decimal places.
* `ORDER BY` was used to sort the table by department
```
SELECT 
item_id, product_name,
departments.department_name AS department,
price,
stock_quantity,
CAST(product_sales AS DECIMAL(6,2)) AS sales 
FROM products
INNER JOIN departments
ON products.department_id = departments.department_id
ORDER BY department
```
* `INSERT INTO products SET product_name, price, department_id ` is used to add a new product.
* `UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?` is used to add stock to existing item.

### `bamazonSupervisor.js`
The Supervisor main menu gives you two choices: View Product Sales by Department and Create a New Department. 
![Supervisor Main section](/assets/supervisor-main.JPG)

The View Product Sales by Department menu lets you choose a department from a paginated list. 
![Supervisor View Product Sales](/assets/supervisor-dept1.JPG)

Results from the **movies** department: 
![Supervisor View Product Sales 2](/assets/supervisor-dept2.JPG)

Create a New Department asks you to enter a new department name and overhead costs.
![Supervisor Add New Department](/assets/supervisor-dept2.JPG)

#### SQL commands used
I needed to modify the product table so that each department name was replaced with the correct department_id.
I found a way to change it from [Stackoverflow - Can I move a column from one table to another...](https://stackoverflow.com/questions/13633965/can-i-move-a-column-from-one-mysql-table-to-another-and-replace-the-original-co)
```
-- For bamazonSupervisor.js
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(60),
    over_head_costs DECIMAL(6,2)
);

-- copy from products table to departments table without creating duplicates using SELECT DISTINCT
INSERT INTO departments (department_name) 
SELECT DISTINCT department_name FROM products;

-- Add department_id to products table, which references departments
ALTER TABLE products ADD COLUMN department_id INT, 
    ADD FOREIGN KEY (department_id) REFERENCES departments(department_id);

-- update products table with corresponding department_id, based on JOIN of department_name in both tables. Multi-Table UPDATE is MySQL only syntax.
UPDATE products JOIN departments USING (department_name)
SET products.department_id = departments.department_id;

-- delete redundant department_name from products table.
ALTER TABLE products DROP COLUMN department_name;
```

To get the total profits, the product and department tables needed to be joined so that the sum of the product sales by department is subtracted by the department overhead.
* `SUM(products.product_sales)-departments.over_head_costs AS total_profit`
```
SELECT products.department_id, 
    departments.department_name, 
    departments.over_head_costs, 
    SUM(products.product_sales) AS product_sales, 
    SUM(products.product_sales)-departments.over_head_costs AS total_profit
FROM products 
INNER JOIN departments
ON products.department_id = departments.department_id
WHERE departments.department_id = ?
GROUP BY departments.department_name;
```
* To add a new department, `INSERT INTO` is used

## Programmer's Notes
* Inquirer can have paginated lists
    * Each item in list can have a value
    * EX: [{name: "item 1, value: 1}]
* [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) was used to see if an array **includes** a certain value, returning *true* or *false*

## Callback workflow
Needed to use lots of callbacks to deal with async issues without installing sync modules.
Need to keep track the flow of callbacks.
1. Call sqlQueryCallFunction(callback)
    * Ex: `viewProducts(tableGenerator);`

### Regular Expressions - doesn't work without an npm module
[W3Schools .match(regexp)](https://www.w3schools.com/js/js_regexp.asp)