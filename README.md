# Inventory Search System

A full-stack application that allows users to search surplus inventory across suppliers and manage supplier-inventory relationships.

---

## 🚀 Live Demo

Frontend: https://inventory-search-system-blue.vercel.app/
Search API: https://inventory-search-system-1-73ku.onrender.com/search
Inventory API: https://inventory-search-system-s08c.onrender.com/inventory

### Example Search

https://inventory-search-system-1-73ku.onrender.com/search?q=laptop&category=electronics

---

## Tech Stack

* Backend: Node.js, Express
* Frontend: React
* Database: PostgreSQL
* Deployment: Render (Backend), Vercel (Frontend), Neon (Database)

---

## Features

### Part A: Inventory Search

* Search by product name (partial, case-insensitive)
* Filter by category
* Filter by price range (minPrice, maxPrice)
* Combine multiple filters
* Pagination support (page, limit)
* Sorting by price (ascending / descending)
* Handles edge cases:

  * Empty search → returns all results
  * Invalid price range → returns error
  * No matches → shows “No results found”

---

### Part B: Inventory Management

* Create suppliers
* Add inventory linked to suppliers
* Enforce constraints:

  * Quantity ≥ 0
  * Price > 0
* Validate supplier existence before adding inventory
* Foreign key relationship (1 supplier → many inventory items)
* Aggregated query:

  * Inventory grouped by supplier
  * Sorted by total inventory value

---

## Project Structure

```
inventory-search-system/
│
├── part-a-backend/      # Search API
├── part-a-frontend/     # React UI
├── part-b-backend/      # Database APIs
├── database/            # SQL schema
├── .gitignore
└── README.md
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/PothulaNagaJyothi/inventory-search-system
cd inventory-search-system
```

---

### 2. Setup Database (PostgreSQL)

Open pgAdmin → Query Tool → run:

```sql
CREATE DATABASE inventory_db;

-- Connect to inventory_db before running below

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  city VARCHAR(100)
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  supplier_id INT REFERENCES suppliers(id),
  product_name VARCHAR(100),
  quantity INT CHECK (quantity >= 0),
  price DECIMAL CHECK (price > 0)
);

CREATE INDEX idx_supplier_id ON inventory(supplier_id);
CREATE INDEX idx_product_name ON inventory(product_name);
```

---

### 3. Setup Part A Backend

```bash
cd part-a-backend
npm install
npm start
```

Runs on: http://localhost:3000

---

### 4. Setup Part B Backend

```bash
cd part-b-backend
npm install
npm start
```

Runs on: http://localhost:4000

---

### 5. Setup Frontend

```bash
cd part-a-frontend
npm install
npm start
```

---

## API Endpoints

### Search API

```
GET /search?q=&category=&minPrice=&maxPrice=&page=&limit=&sort=
```

Example:

```
/search?q=laptop&category=electronics&minPrice=10000&maxPrice=60000&page=1&limit=5&sort=asc
```

---

### Supplier APIs

```
POST /supplier  
POST /inventory  
GET /inventory  
GET /inventory-by-supplier  
```

---

## Required SQL Query (Assignment)

```sql
SELECT 
  s.id,
  s.name,
  SUM(i.quantity * i.price) AS total_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id, s.name
ORDER BY total_value DESC;
```

---

## Enhanced Query (Improved Output)

```sql
SELECT 
  s.id,
  s.name,
  s.city,
  SUM(i.quantity) AS total_items,
  SUM(i.quantity * i.price) AS total_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id, s.name, s.city
ORDER BY total_value DESC;
```

---

## Environment Variables

Create a `.env` file in backend folders:

```
DATABASE_URL=your_database_connection_string
PORT=3000
```

---

## Deployment

* Backend deployed on Render
* Frontend deployed on Vercel
* Database hosted on Neon

---

## Performance Improvements (for large datasets)

* Move filtering logic to database queries instead of in-memory filtering
* Add indexing on frequently queried fields (product_name, supplier_id)
* Implement pagination to limit response size
* Use connection pooling for database efficiency

---

## Common Issues

### Database not connecting

* Check DATABASE_URL
* Ensure PostgreSQL is running
* Verify password and port (default: 5432)

### CORS errors

Enable CORS in backend:

```js
app.use(cors({ origin: '*' }));
```

### Empty results

* Ensure data is inserted into tables before querying

---

## Author

**Pothula Naga Jyothi**
