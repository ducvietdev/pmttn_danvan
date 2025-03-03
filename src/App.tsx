import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import QuizSelection from "./pages/QuizSelection";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu câu hỏi
interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
}

// Định nghĩa kiểu dữ liệu bộ đề
interface Quiz {
  id: number;
  name: string;
  questions: Question[];
}

// Hàm trộn mảng ngẫu nhiên (tránh lỗi sort() không an toàn trong TypeScript)
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetch("/questions.json")
      .then((response) => response.json())
      .then((data: Question[]) => {
        // Trộn câu hỏi và chia thành 10 bộ đề, mỗi bộ có 50 câu
        const shuffledQuestions = shuffleArray(data);
        const quizSets: Quiz[] = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Bộ đề ${i + 1}`,
          questions: shuffledQuestions.slice(i * 50, (i + 1) * 50),
        }));
        setQuizzes(quizSets);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<QuizSelection />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default App;
