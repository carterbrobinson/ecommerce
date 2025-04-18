from faker import Faker
import random
import csv
from datetime import datetime, timedelta

fake = Faker()
Faker.seed(0)
random.seed(0)

# Constants
NUM_USERS = 100
NUM_PRODUCTS = 50
NUM_ORDERS = 200
MAX_ITEMS_PER_ORDER = 5
NUM_REVIEWS = 150
NUM_CARTS = 120
NUM_SESSIONS = 150

# Helper functions
def random_date_this_year():
    return fake.date_time_between(start_date='-1y', end_date='now')

# Data containers
users, products, orders, order_items, reviews = [], [], [], [], []
carts, cart_items, sessions = [], [], []

# Generate users
for i in range(1, NUM_USERS + 1):
    users.append([
        i,
        fake.name(),
        fake.email(),
        random.choice(['organic', 'ad', 'referral', 'social'])
    ])

# Generate products
for i in range(1, NUM_PRODUCTS + 1):
    products.append([
        i,
        fake.catch_phrase(),
        random.choice(['Electronics', 'Apparel', 'Home', 'Toys', 'Books']),
        round(random.uniform(5.0, 300.0), 2),
        random_date_this_year().strftime('%Y-%m-%d'),
        random.choice([True, True, True, False])
    ])

# Generate orders and order_items
for order_id in range(1, NUM_ORDERS + 1):
    user_id = random.randint(1, NUM_USERS)
    order_date = random_date_this_year()
    status = random.choice(['completed', 'pending'])
    total = 0.0

    orders.append([
        order_id,
        user_id,
        order_date.strftime('%Y-%m-%d %H:%M:%S'),
        status,
        0  # Placeholder for total
    ])

    num_items = random.randint(1, MAX_ITEMS_PER_ORDER)
    for _ in range(num_items):
        product_id = random.randint(1, NUM_PRODUCTS)
        quantity = random.randint(1, 3)
        unit_price = round(random.uniform(10.0, 100.0), 2)
        total += unit_price * quantity
        order_items.append([
            len(order_items)+1,
            order_id,
            product_id,
            quantity,
            unit_price
        ])
    orders[-1][4] = round(total, 2)

# Generate reviews
for i in range(1, NUM_REVIEWS + 1):
    reviews.append([
        i,
        random.randint(1, NUM_USERS),
        random.randint(1, NUM_PRODUCTS),
        random.randint(1, 5),
        fake.sentence(),
        random_date_this_year().strftime('%Y-%m-%d %H:%M:%S')
    ])

# Generate carts and cart_items
for cart_id in range(1, NUM_CARTS + 1):
    user_id = random.randint(1, NUM_USERS)
    created_at = random_date_this_year()
    status = random.choice(['active', 'abandoned', 'converted'])

    carts.append([
        cart_id,
        user_id,
        created_at.strftime('%Y-%m-%d %H:%M:%S'),
        status
    ])

    for _ in range(random.randint(1, 4)):
        product_id = random.randint(1, NUM_PRODUCTS)
        added_at = created_at + timedelta(minutes=random.randint(1, 120))
        removed_at = added_at + timedelta(minutes=random.randint(1, 60)) if random.choice([True, False]) else None
        cart_items.append([
            len(cart_items)+1,
            cart_id,
            product_id,
            added_at.strftime('%Y-%m-%d %H:%M:%S'),
            removed_at.strftime('%Y-%m-%d %H:%M:%S') if removed_at else None
        ])

# Generate sessions
for session_id in range(1, NUM_SESSIONS + 1):
    user_id = random.choice([random.randint(1, NUM_USERS), None])
    source = random.choice(['Google Ads', 'Organic', 'Referral', 'Social Media'])
    start = random_date_this_year()
    end = start + timedelta(minutes=random.randint(1, 90))
    purchase = random.choice([True, False, False])  # more false than true

    sessions.append([
        session_id,
        user_id if user_id else '',
        source,
        start.strftime('%Y-%m-%d %H:%M:%S'),
        end.strftime('%Y-%m-%d %H:%M:%S'),
        purchase
    ])

# Write data to CSV files
with open('users.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['user_id', 'name', 'email', 'signup_source'])
    writer.writerows(users)

with open('products.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['product_id', 'name', 'category', 'price', 'created_at', 'active'])
    writer.writerows(products)

with open('orders.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['order_id', 'user_id', 'order_date', 'status', 'total'])
    writer.writerows(orders)

with open('order_items.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['item_id', 'order_id', 'product_id', 'quantity', 'unit_price'])
    writer.writerows(order_items)

with open('reviews.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['review_id', 'user_id', 'product_id', 'rating', 'comment', 'created_at'])
    writer.writerows(reviews)

with open('carts.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['cart_id', 'user_id', 'created_at', 'status'])
    writer.writerows(carts)

with open('cart_items.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['item_id', 'cart_id', 'product_id', 'added_at', 'removed_at'])
    writer.writerows(cart_items)

with open('sessions.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['session_id', 'user_id', 'source', 'start_time', 'end_time', 'purchase'])
    writer.writerows(sessions)

print("Data generation complete! CSV files have been created.")
