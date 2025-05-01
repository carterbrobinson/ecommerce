import psycopg2
from pymongo import MongoClient

def cleanup_postgres():
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user="carterrobinson",
            password="",
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()
        
        # Drop all tables
        cur.execute("""
            DROP TABLE IF EXISTS reviews CASCADE;
            DROP TABLE IF EXISTS order_items CASCADE;
            DROP TABLE IF EXISTS orders CASCADE;
            DROP TABLE IF EXISTS products CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        """)
        
        conn.commit()
        print("PostgreSQL cleanup complete!")
        
    except Exception as e:
        print(f"PostgreSQL cleanup error: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def cleanup_mongodb():
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['ecommerce_mongodb']
        
        # Drop all collections
        db.users.drop()
        db.products.drop()
        db.orders.drop()
        db.reviews.drop()
        
        print("MongoDB cleanup complete!")
        
    except Exception as e:
        print(f"MongoDB cleanup error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("Starting database cleanup...")
    cleanup_postgres()
    cleanup_mongodb()
    print("Cleanup complete!") 