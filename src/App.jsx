import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Quiz from "./components/Quizz";
import Result from "./components/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {< Login/>}/>
        <Route path="Quiz" element = {< Quiz/>}/>
        <Route path="Result" element = {< Result/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App ;