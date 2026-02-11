import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      onLogin(res.data.token, res.data.role);

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">Login</h2>

      <input
        placeholder="Email"
        className="border p-2 block mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
