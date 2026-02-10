import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const startQuiz = () => {
    if (!name.trim()) {
      setError("Masukkan nama dulu ya");

      setTimeout(() => setError(""), 2500);
      return;
    }

    localStorage.setItem("username", name);
    navigate("/quiz");
  };

  return (
    <div className="login-container">
      <h1>WEBSITE KUIS</h1>
      <p>Belajar jadi lebih seru lewat kuis interaksi</p>

      <div className="login-box">
        <input
          type="text"
          placeholder="Masukkan nama anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={startQuiz}>MULAI KUIS</button>
      </div>

      {error && <div className="toast-error">{error}</div>}
    </div>
  );
}
