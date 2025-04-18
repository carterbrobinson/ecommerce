import sqlite3
import pandas as pd

# Step 1: Connect to SQLite DB (creates if it doesn't exist)
conn = sqlite3.connect("ecommerce.db")
cursor = conn.cursor()

# Step 2: Run schema to create tables
with open("ecommerce.sql", "r") as f:
    schema_sql = f.read()
    cursor.executescript(schema_sql)

print("[✓] Tables created successfully.")

# Step 3: Helper to load CSVs into tables
def import_csv_to_table(csv_path, table_name):
    df = pd.read_csv(csv_path)
    df.to_sql(table_name, conn, if_exists="append", index=False)
    print(f"[✓] Imported {len(df)} rows into '{table_name}'")

# Step 4: Import all CSVs from the data/ subdirectory
csv_table_map = {
    "data/users.csv": "users",
    "data/products.csv": "products",
    "data/orders.csv": "orders",
    "data/order_items.csv": "order_items",
    "data/reviews.csv": "reviews",
    "data/carts.csv": "carts",
    "data/cart_items.csv": "cart_items",
    "data/sessions.csv": "sessions",
}

for csv_path, table in csv_table_map.items():
    import_csv_to_table(csv_path, table)

conn.commit()
conn.close()
print("[✓] All data imported and database initialized.")
