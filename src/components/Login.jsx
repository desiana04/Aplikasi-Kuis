import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const QUIZ_STATE_KEY = "quiz_state";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    const savedQuiz = localStorage.getItem(QUIZ_STATE_KEY);

    if (savedName && savedQuiz) {
      navigate("/quiz");
      return;
    }

    if (savedName) {
      setName(savedName);
    }
  }, []);

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
