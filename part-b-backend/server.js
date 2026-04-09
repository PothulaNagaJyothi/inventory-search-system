const express = require('express');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(express.json());

// Create supplier
app.post('/supplier', async (req, res) => {
  const { name, city } = req.body;

  const result = await pool.query(
    'INSERT INTO suppliers (name, city) VALUES ($1, $2) RETURNING *',
    [name, city]
  );

  res.json(result.rows[0]);
});

// Create inventory
app.post('/inventory', async (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // Check supplier exists
  const supplier = await pool.query(
    'SELECT * FROM suppliers WHERE id = $1',
    [supplier_id]
  );

  if (supplier.rows.length === 0) {
    return res.status(400).json({ error: "Invalid supplier_id" });
  }

  if (quantity < 0 || price <= 0) {
    return res.status(400).json({ error: "Invalid quantity or price" });
  }

  const result = await pool.query(
    `INSERT INTO inventory (supplier_id, product_name, quantity, price)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [supplier_id, product_name, quantity, price]
  );

  res.json(result.rows[0]);
});

// Get all inventory
app.get('/inventory', async (req, res) => {
  const result = await pool.query('SELECT * FROM inventory');
  res.json(result.rows);
});

// Required query
app.get('/inventory-by-supplier', async (req, res) => {
  const result = await pool.query(`
    SELECT 
  s.id,
  s.name,
  s.city,
  SUM(i.quantity) AS total_items,
  SUM(i.quantity * i.price) AS total_value
FROM suppliers s
JOIN inventory i ON s.id = i.supplier_id
GROUP BY s.id, s.name, s.city
ORDER BY total_value DESC
  `);

  res.json(result.rows);
});

app.listen(4000, () => console.log("DB API running on port 4000"));