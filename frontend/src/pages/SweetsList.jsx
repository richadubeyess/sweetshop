import { useEffect, useState } from "react";

export default function SweetsList() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");

  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchSweets = async () => {
    try {
      let url = "http://localhost:5054/api/sweets/search?";
      if (search) url += `name=${search}&`;
      if (category) url += `category=${category}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch sweets");
      const data = await res.json();
      setSweets(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5054/api/sweets/${id}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!res.ok) throw new Error("Purchase failed");
      alert(" Purchase successful!");
      fetchSweets(); // refresh
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        🍭 Available Sweets
      </h2>

      {/* Filter Bar */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={fetchSweets}
            className="bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center font-medium mb-4">{error}</p>
      )}

      {sweets.length === 0 ? (
        <p className="text-gray-600 text-center">No sweets found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {sweets.map((s) => (
            <div
              key={s.id}
              className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{s.category}</p>
                <p className="text-lg font-semibold text-pink-600">
                  ₹{s.price}
                </p>
                <p
                  className={`mt-2 ${
                    s.quantity > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {s.quantity > 0
                    ? `In stock: ${s.quantity}`
                    : "Out of stock"}
                </p>
              </div>

              <button
                onClick={() => handlePurchase(s.id)}
                disabled={s.quantity === 0}
                className={`mt-4 py-2 rounded-lg font-semibold ${
                  s.quantity > 0
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {s.quantity > 0 ? "🛒 Buy Now" : "Sold Out"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
