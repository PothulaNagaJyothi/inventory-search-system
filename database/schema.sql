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