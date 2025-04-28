# E-commerce Analytics Dashboard

A modern analytics dashboard for e-commerce data visualization, built with React and FastAPI.

## Features

- Real-time analytics visualization
- Multiple data views including:
  - Top selling products
  - Abandoned cart analysis
  - Customer behavior metrics
  - Conversion rates
  - And more...
- Responsive design
- Error handling and loading states
- RESTful API architecture

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLite
- Python 3.8+

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database
python init_database.py
```

3. Set up the frontend:
```bash
cd ecommerce-dashboard
npm install
```

### Running the Application

1. Start the backend server:
```bash
# From the root directory
uvicorn server:app --reload --port 8001
```

2. Start the frontend development server:
```bash
# From the ecommerce-dashboard directory
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## API Documentation

The backend API provides the following endpoints:

- `GET /` - Welcome message and available endpoints
- `GET /health` - Health check endpoint
- `GET /top-products` - Top selling products
- `GET /abandoned-products` - Most abandoned products
- `GET /avg-time-to-purchase` - Average time to purchase
- `GET /top-rated-products` - Highest rated products
- `GET /repeat-customers` - Repeat customer analysis
- `GET /avg-order-value-by-month` - Average order value by month
- `GET /conversion-rate` - Product conversion rates
- `GET /orders-with-most-items` - Orders with most items

## Project Structure

```
ecommerce/
├── ecommerce-dashboard/     # Frontend React application
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
├── server.py               # FastAPI backend server
├── ecommerce.db            # SQLite database
├── init_database.py        # Database initialization script
├── requirements.txt        # Python dependencies
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
