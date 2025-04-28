-- Drop tables if they exist (for reruns)
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS sessions;

-- Users
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    signup_source TEXT
);

-- Products
CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    created_at TEXT,
    active BOOLEAN
);

-- Orders
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    order_date TEXT,
    status TEXT,
    total REAL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Order Items
CREATE TABLE order_items (
    item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Reviews
CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    product_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Carts
CREATE TABLE carts (
    cart_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    created_at TEXT,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Cart Items
CREATE TABLE cart_items (
    item_id INTEGER PRIMARY KEY,
    cart_id INTEGER,
    product_id INTEGER,
    added_at TEXT,
    removed_at TEXT,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Sessions
CREATE TABLE sessions (
    session_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    source TEXT,
    start_time TEXT,
    end_time TEXT,
    purchase BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
