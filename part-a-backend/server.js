const express = require('express');
const cors = require('cors');
const inventory = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/search', (req, res) => {
  let { q, category, minPrice, maxPrice, page = 1, limit = 5, sort } = req.query;

  page = Number(page);
  limit = Number(limit);

  let results = inventory;

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ error: "Invalid price range" });
  }

  if (q) {
    results = results.filter(item =>
      item.product_name.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category) {
    results = results.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    results = results.filter(item => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(item => item.price <= Number(maxPrice));
  }

  if (sort === "asc") results.sort((a, b) => a.price - b.price);
  if (sort === "desc") results.sort((a, b) => b.price - a.price);

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);

  res.json({
    total: results.length,
    page,
    limit,
    data: paginated
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});