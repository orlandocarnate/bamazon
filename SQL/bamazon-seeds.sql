USE bamazon;

-- product seeds
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("The Hobbit", 1, 6.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Diary of a Wimpy Kid", 1, 4.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("pants", 2, 24.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("t-shirt", 2, 9.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Star Wars", 3, 9.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Enter The Dragon", 3, 19.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Smartphone", 4, 499.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("10in Android tablet", 4, 249.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Minecraft", 5, 29.95, 1000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Halo 6", 5, 59.95, 1000);

-- department seeds
INSERT INTO departments (department_name, over_head_costs)
VALUES ("books", 300000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("clothes", 400000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("movies", 500000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 900000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("video games", 800000);





