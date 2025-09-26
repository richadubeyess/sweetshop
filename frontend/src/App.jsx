import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SweetsList from "./pages/SweetsList";
import AdminPage from "./pages/AdminPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 via-red-50 to-yellow-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-pink-600">🍬 Sweet Shop</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-pink-600">
            Home
          </Link>
          <Link to="/admin" className="text-gray-700 hover:text-pink-600">
            Admin
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<SweetsList />} />
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
