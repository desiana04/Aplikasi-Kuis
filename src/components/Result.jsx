import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Result.css";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const correct = location.state?.correct ?? 0;
  const wrong = location.state?.wrong ?? 0;
  const answered = correct + wrong;

  const accuracy =
    answered === 0 ? 0 : Math.round((correct / answered) * 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (accuracy / 100) * circumference;

  useEffect(() => {
    if (!location.state) navigate("/");
  }, [location.state, navigate]);

  return (
    <div className="result-page">
      <div className="result-card">

        <h1 className="result-title">Hasil Kuis</h1>

        <div className="circle-container">
          <svg width="180" height="180">
            <circle
              className="circle-bg"
              cx="90"
              cy="90"
              r={radius}
            />

            <circle
              className="circle-progress"
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="circle-text">
            <div className="percent">{accuracy}%</div>
            <div className="label">Akurasi</div>
          </div>
        </div>

        <div className="stats-box">

          <div className="stat total">
            <strong>{answered}</strong>
            <p>Dijawab</p>
          </div>

          <div className="stat correct">
            <strong>{correct}</strong>
            <p>Benar</p>
          </div>

          <div className="stat wrong">
            <strong>{wrong}</strong>
            <p>Salah</p>
          </div>

        </div>
        
        <div className="result-actions">
          <button
            className="btn replay"
            onClick={() => navigate("/quiz")}
          >
            Ulangi
          </button>

          <button
            className="btn home"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>

      </div>
    </div>
  );
}
