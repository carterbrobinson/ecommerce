from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List, Dict
from datetime import datetime
import os

# Configuration
class Config:
    DB_PATH = "ecommerce.db"
    API_VERSION = "v1"
    CORS_ORIGINS = ["*"]  # In production, replace with actual frontend URL

# Database operations
class Database:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def query(self, sql: str, params: tuple = None) -> List[Dict]:
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.execute(sql, params or ())
                return [dict(row) for row in cursor.fetchall()]
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Initialize FastAPI app
app = FastAPI(
    title="E-commerce Analytics API",
    description="API for e-commerce analytics dashboard",
    version=Config.API_VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = Database(Config.DB_PATH)

# API Routes
@app.get("/")
async def root():
    return {
        "message": "Welcome to E-commerce Analytics API",
        "version": Config.API_VERSION,
        "endpoints": [
            "/top-products",
            "/abandoned-products",
            "/avg-time-to-purchase",
            "/top-rated-products",
            "/repeat-customers",
            "/avg-order-value-by-month",
            "/conversion-rate",
            "/orders-with-most-items"
        ]
    }

@app.get("/top-products")
async def top_selling_products():
    sql = """
        SELECT p.name, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.order_date >= date('now', '-3 months')
        GROUP BY p.product_id
        ORDER BY total_sold DESC
        LIMIT 10;
    """
    return db.query(sql)

@app.get("/abandoned-products")
async def most_abandoned_products():
    sql = """
        SELECT p.name, COUNT(ci.item_id) AS times_abandoned
        FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.cart_id
        JOIN products p ON ci.product_id = p.product_id
        WHERE c.status = 'abandoned'
        GROUP BY ci.product_id
        ORDER BY times_abandoned DESC
        LIMIT 10;
    """
    return db.query(sql)

@app.get("/avg-time-to-purchase")
async def avg_time_from_cart_to_purchase():
    sql = """
        SELECT 
            ROUND(AVG(
                JULIANDAY(o.order_date) - JULIANDAY(ci.added_at)
            ) * 24 * 60, 2) AS avg_minutes_to_purchase
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN cart_items ci ON oi.product_id = ci.product_id
        WHERE ci.removed_at IS NULL;
    """
    return db.query(sql)

@app.get("/top-rated-products")
async def highest_rated_products():
    sql = """
        SELECT 
            p.name AS product_name,
            ROUND(AVG(r.rating), 2) AS avg_rating,
            COUNT(r.review_id) AS total_reviews
        FROM reviews r
        JOIN products p ON r.product_id = p.product_id
        GROUP BY r.product_id
        HAVING COUNT(r.review_id) >= 3
        ORDER BY avg_rating DESC
        LIMIT 10;
    """
    return db.query(sql)

@app.get("/repeat-customers")
async def repeat_customers():
    sql = """
        SELECT 
            u.name AS customer_name,
            COUNT(DISTINCT strftime('%Y-%m', o.order_date)) AS months_active
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        GROUP BY o.user_id
        HAVING months_active >= 2
        ORDER BY months_active DESC;
    """
    return db.query(sql)

@app.get("/avg-order-value-by-month")
async def average_order_value_by_month():
    sql = """
        SELECT 
            strftime('%Y-%m', order_date) AS month,
            ROUND(AVG(total), 2) AS avg_order_value
        FROM orders
        WHERE status = 'completed'
        GROUP BY month
        ORDER BY month DESC;
    """
    return db.query(sql)

@app.get("/conversion-rate")
async def product_conversion_rate():
    sql = """
        WITH cart_counts AS (
            SELECT product_id, COUNT(*) AS times_carted
            FROM cart_items
            GROUP BY product_id
        ), purchase_counts AS (
            SELECT product_id, COUNT(*) AS times_purchased
            FROM order_items
            GROUP BY product_id
        )
        SELECT 
            p.name,
            cc.times_carted,
            COALESCE(pc.times_purchased, 0) AS times_purchased,
            ROUND(1.0 * COALESCE(pc.times_purchased, 0) / cc.times_carted, 2) AS conversion_rate
        FROM cart_counts cc
        LEFT JOIN purchase_counts pc ON cc.product_id = pc.product_id
        JOIN products p ON p.product_id = cc.product_id
        WHERE cc.times_carted > 0
        ORDER BY conversion_rate DESC
        LIMIT 10;
    """
    return db.query(sql)

@app.get("/orders-with-most-items")
async def orders_with_most_items():
    sql = """
        SELECT 
            o.order_id,
            u.name AS customer_name,
            COUNT(oi.item_id) AS total_items,
            o.total
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN users u ON o.user_id = u.user_id
        GROUP BY o.order_id
        ORDER BY total_items DESC
        LIMIT 10;
    """
    return db.query(sql)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": os.path.exists(Config.DB_PATH)
    }