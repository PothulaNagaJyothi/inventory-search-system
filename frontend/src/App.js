import { useState } from "react";

function App() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (newPage = 1) => {
    try {
      setLoading(true);

      // basic validation
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        setError("Invalid price range");
        setResults([]);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();

      if (q) params.append("q", q);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);

      params.append("page", newPage);
      params.append("limit", 5);

      const res = await fetch(
        `https://inventory-search-system-1-73ku.onrender.com/search?${params}`
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setError("");
        setResults(data.data);
        setPage(newPage);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory Search</h2>

      <input
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option>Electronics</option>
        <option>Furniture</option>
        <option>Clothing</option>
        <option>Accessories</option>
      </select>

      <input
        placeholder="Min Price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        placeholder="Max Price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="asc">Low → High</option>
        <option value="desc">High → Low</option>
      </select>

      <button onClick={() => fetchResults(1)} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.length === 0 ? (
            <p>No results found</p>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                {item.product_name} - ₹{item.price}
              </li>
            ))
          )}
        </ul>
      )}

      <button
        onClick={() => fetchResults(page - 1)}
        disabled={page === 1 || loading}
      >
        Prev
      </button>

      <button onClick={() => fetchResults(page + 1)} disabled={loading}>
        Next
      </button>
    </div>
  );
}

export default App;