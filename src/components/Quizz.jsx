import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Quizz.css";

const TOTAL_TIME = 60;
const QUIZ_STATE_KEY = "quiz_state";

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const fetchedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_STATE_KEY);

    if (saved) {
      const data = JSON.parse(saved);

      setQuestions(data.questions);
      setIndex(data.index);
      setCorrect(data.correct);
      setWrong(data.wrong);
      setTimeLeft(data.timeLeft);
    } else {
      fetchQuestions();
    }
  }, []);

  const fetchQuestions = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple"
      );

      const data = await res.json();
      setQuestions(data.results || []);
    } catch {
      alert("Server sibuk (429). Tunggu beberapa detik lalu refresh.");
    }
  };

  useEffect(() => {
    if (!questions.length) return;

    localStorage.setItem(
      QUIZ_STATE_KEY,
      JSON.stringify({
        questions,
        index,
        correct,
        wrong,
        timeLeft,
      })
    );
  }, [questions, index, correct, wrong, timeLeft]);

  useEffect(() => {
    if (!questions.length) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [questions]);

  useEffect(() => {
    if (timeLeft <= 0 && questions.length) {
      finishQuiz();
    }
  }, [timeLeft, questions]);

  const finishQuiz = (c = correct, w = wrong) => {
    localStorage.removeItem(QUIZ_STATE_KEY);

    navigate("/result", {
      state: {
        correct: c,
        wrong: w,
      },
    });
  };

  const answerQuestion = (selected) => {
    if (locked || !questions[index]) return;

    setLocked(true);

    const correctAnswer = questions[index].correct_answer;

    let newCorrect = correct;
    let newWrong = wrong;

    if (selected === correctAnswer) {
      newCorrect += 1;
      setCorrect(newCorrect);
    } else {
      newWrong += 1;
      setWrong(newWrong);
    }

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        finishQuiz(newCorrect, newWrong);
      } else {
        setIndex((i) => i + 1);
        setLocked(false);
      }
    }, 300);
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const options = useMemo(() => {
    if (!questions[index]) return [];

    return shuffle([
      ...questions[index].incorrect_answers,
      questions[index].correct_answer,
    ]);
  }, [index, questions]);

  return (
    <div className="quiz-page">

      {/* TIMER */}
      <div className={`timer-circle ${timeLeft <= 10 ? "danger" : ""}`}>
        {timeLeft}s
      </div>


      <div className="progress">
        {index + 1}/{questions.length}
      </div>

      <div key={index} className="question-card slide-in">
        <div className="question-number">{index + 1}</div>

        <h2
          dangerouslySetInnerHTML={{
            __html: questions[index]?.question,
          }}
        />
      </div>

      <div className="options">
        {options.map((opt, i) => (
          <button
            key={i}
            disabled={locked}
            className="option-btn fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
            onClick={() => answerQuestion(opt)}
          >
            <span dangerouslySetInnerHTML={{ __html: opt }} />
          </button>
        ))}
      </div>

    </div>
  );
}
