import psycopg2
from pymongo import MongoClient
import random
from datetime import datetime, timedelta
import uuid
import names
from faker import Faker

# Initialize Faker for realistic data
fake = Faker()

# Database connections
def get_pg_connection():
    return psycopg2.connect(
        dbname="postgres",
        user="carterrobinson",
        password="",
        host="localhost",
        port="5432"
    )

def get_mongo_client():
    return MongoClient('mongodb://localhost:27017/')

def generate_users(num_users=100):
    """Generate users for both databases"""
    users_pg = []
    users_mongo = []
    
    for _ in range(num_users):
        user_id = str(uuid.uuid4())
        name = names.get_full_name()
        email = fake.email()
        signup_source = random.choice(['organic', 'referral', 'social', 'paid'])
        created_at = fake.date_time_between(start_date='-1y', end_date='now')
        
        # PostgreSQL format
        users_pg.append((
            user_id,
            name,
            email,
            signup_source,
            created_at
        ))
        
        # MongoDB format
        users_mongo.append({
            '_id': user_id,
            'name': name,
            'email': email,
            'signup_source': signup_source,
            'created_at': created_at
        })
    
    return users_pg, users_mongo

def generate_products(num_products=50):
    """Generate products for both databases"""
    categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Beauty']
    products_pg = []
    products_mongo = []
    
    for _ in range(num_products):
        product_id = str(uuid.uuid4())
        name = fake.catch_phrase()
        category = random.choice(categories)
        price = round(random.uniform(10, 1000), 2)
        description = fake.text(max_nb_chars=200)
        created_at = fake.date_time_between(start_date='-1y', end_date='now')
        is_active = random.choice([True, True, True, False])  # 75% active
        
        # PostgreSQL format
        products_pg.append((
            product_id,
            name,
            category,
            price,
            description,
            created_at,
            is_active
        ))
        
        # MongoDB format
        products_mongo.append({
            '_id': product_id,
            'name': name,
            'category': category,
            'price': price,
            'description': description,
            'created_at': created_at,
            'is_active': is_active
        })
    
    return products_pg, products_mongo

def generate_orders(users, products, num_orders=200):
    """Generate orders and order items for both databases"""
    orders_pg = []
    order_items_pg = []
    orders_mongo = []
    
    for _ in range(num_orders):
        order_id = str(uuid.uuid4())
        user = random.choice(users)
        order_date = fake.date_time_between(start_date='-1y', end_date='now')
        status = random.choice(['completed', 'completed', 'completed', 'cancelled'])
        
        # Generate 1-5 items per order
        num_items = random.randint(1, 5)
        order_items = random.sample(products, num_items)
        total_amount = sum(item[3] for item in order_items)  # price is at index 3
        
        # PostgreSQL orders
        orders_pg.append((
            order_id,
            user[0],  # user_id
            order_date,
            status,
            total_amount
        ))
        
        # PostgreSQL order items
        for product in order_items:
            order_item_id = str(uuid.uuid4())
            quantity = random.randint(1, 3)
            unit_price = product[3]  # price
            
            order_items_pg.append((
                order_item_id,
                order_id,
                product[0],  # product_id
                quantity,
                unit_price
            ))
        
        # MongoDB format
        orders_mongo.append({
            '_id': order_id,
            'user_id': user[0],
            'order_date': order_date,
            'status': status,
            'total_amount': total_amount,
            'items': [
                {
                    'product_id': item[0],
                    'quantity': random.randint(1, 3),
                    'unit_price': item[3]
                }
                for item in order_items
            ]
        })
    
    return orders_pg, order_items_pg, orders_mongo

def generate_reviews(users, products, num_reviews=300):
    """Generate reviews for both databases"""
    reviews_pg = []
    reviews_mongo = []
    
    for _ in range(num_reviews):
        review_id = str(uuid.uuid4())
        user = random.choice(users)
        product = random.choice(products)
        rating = random.randint(1, 5)
        comment = fake.text(max_nb_chars=200)
        review_date = fake.date_time_between(start_date='-1y', end_date='now')
        
        # PostgreSQL format
        reviews_pg.append((
            review_id,
            user[0],  # user_id
            product[0],  # product_id
            rating,
            comment,
            review_date
        ))
        
        # MongoDB format
        reviews_mongo.append({
            '_id': review_id,
            'user_id': user[0],
            'product_id': product[0],
            'rating': rating,
            'comment': comment,
            'review_date': review_date
        })
    
    return reviews_pg, reviews_mongo

def main():
    print("Starting data generation...")
    
    # Generate data
    users_pg, users_mongo = generate_users()
    products_pg, products_mongo = generate_products()
    orders_pg, order_items_pg, orders_mongo = generate_orders(users_pg, products_pg)
    reviews_pg, reviews_mongo = generate_reviews(users_pg, products_pg)
    
    # PostgreSQL insertion
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        
        # Clear existing data
        print("Clearing existing PostgreSQL data...")
        cur.execute("TRUNCATE TABLE reviews, order_items, orders, products, users CASCADE;")
        
        # Insert new data
        print("Inserting users...")
        cur.executemany("""
            INSERT INTO users (user_id, name, email, signup_source, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, users_pg)
        
        print("Inserting products...")
        cur.executemany("""
            INSERT INTO products (product_id, name, category, price, description, created_at, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, products_pg)
        
        print("Inserting orders...")
        cur.executemany("""
            INSERT INTO orders (order_id, user_id, order_date, status, total_amount)
            VALUES (%s, %s, %s, %s, %s)
        """, orders_pg)
        
        print("Inserting order items...")
        cur.executemany("""
            INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price)
            VALUES (%s, %s, %s, %s, %s)
        """, order_items_pg)
        
        print("Inserting reviews...")
        cur.executemany("""
            INSERT INTO reviews (review_id, user_id, product_id, rating, comment, review_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, reviews_pg)
        
        conn.commit()
        print("PostgreSQL data generation complete!")
        
    except Exception as e:
        print(f"PostgreSQL error: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()
    
    # MongoDB insertion
    try:
        client = get_mongo_client()
        db = client['ecommerce_mongodb']
        
        # Clear existing data
        print("Clearing existing MongoDB data...")
        db.users.delete_many({})
        db.products.delete_many({})
        db.orders.delete_many({})
        db.reviews.delete_many({})
        
        # Insert new data
        print("Inserting users...")
        db.users.insert_many(users_mongo)
        
        print("Inserting products...")
        db.products.insert_many(products_mongo)
        
        print("Inserting orders...")
        db.orders.insert_many(orders_mongo)
        
        print("Inserting reviews...")
        db.reviews.insert_many(reviews_mongo)
        
        print("MongoDB data generation complete!")
        
    except Exception as e:
        print(f"MongoDB error: {str(e)}")
    finally:
        client.close()
    
    print("Data generation complete!")

if __name__ == "__main__":
    main() 