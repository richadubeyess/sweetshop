import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSweets = () => {
    fetch("http://localhost:5054/api/sweets", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sweets");
        return res.json();
      })
      .then(setSweets)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:5054/api/sweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Sweet added!");
      fetchSweets();
    } else {
      const err = await res.json();
      setError(err.message || " Failed to add sweet");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    const res = await fetch(`http://localhost:5054/api/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      alert(" Sweet deleted!");
      fetchSweets();
    } else {
      const err = await res.json();
      alert("❌ " + (err.message || "Failed to delete sweet"));
    }
  };

  const handleRestock = async (id) => {
    const qty = prompt("Enter quantity to restock:");
    if (!qty || isNaN(qty)) return;
    const res = await fetch(`http://localhost:5054/api/sweets/${id}/restock?qty=${qty}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      alert(" Sweet restocked!");
      fetchSweets();
    } else {
      const err = await res.json();
      alert("❌ " + (err.message || "Failed to restock sweet"));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-pink-700 flex items-center gap-2">
          🍬 Sweet Shop - Admin Panel
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Add Sweet Form */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8 w-full max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🛠️ Add Sweet
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Sweet name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 shadow-lg"
          >
            ➕ Add Sweet
          </button>
        </form>
      </div>

      {/* Sweet List */}
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📋 All Sweets
        </h2>
        {sweets.length === 0 ? (
          <p className="text-gray-600">No sweets added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sweets.map((s) => (
              <li key={s.id} className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-700">
                  {s.name} ({s.category}) - ₹{s.price} | Stock: {s.quantity}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestock(s.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 shadow"
                  >
                    📦 Restock
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 shadow"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
