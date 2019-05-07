-- creating our database called bamazon --  
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon; 

USE bamazon;

-- creating our products table that will store our inventory -- 
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL, 
    product_name VARCHAR(50) NOT NULL, 
    department_name VARCHAR(20) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL, 
    stock_quantity INTEGER(11) NOT NULL, 
    PRIMARY KEY (item_id)
); 

-- inserting information into the products table -- 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('Molang Planner', 'Stationary', 9.99, 100), 
('Hello Kitty Airpods Case', 'Stationary', 14.99, 50),
('Red Anklet', 'Jewelery', 17.95, 25), 
('Oragami Stars', 'Stationary', 10.99, 300), 
('Heart Shape Sunglasses', 'Fashion', 11.99, 50), 
('Gudetama Tamagotchi', 'Toys', 15.95, 20), 
('Hello Kitty Plush', 'Toys', 12.99, 100), 
('Star Necklace Choker', 'Jewelery', 25.95, 10), 
('Rilakkuma Plush Doll', 'Toys', 29.99, 150), 
('Pink Pens', 'Stationary', 7.99, 500),
('Cute Cat Paw Memo Pad', 'Stationary', 9.96, 200), 
('Platform Boots', 'Fashion', 39.59, 30), 
('Stars and Moon Earrings', 'Jewelery', 12.99, 20), 
('Pusheen Travel Mug', 'Stationary', 14.59, 70), 
('Shiba iPhone X Case', 'Stationary', 8.99, 80), 
('Cat Paw Mug', 'Stationary', 15.99, 80), 
('FILA Disrupters', 'Fashion', 65.99, 60), 
('Rose Gold Hoop Earrings', 'Jewelery', 13.59, 20), 
('Rilakkuma Writing Paper', 'Stationary', 5.99, 200), 
('Shiba Theme Stickers', 'Stationary', 7.99, 150);  