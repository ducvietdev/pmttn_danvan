import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
}

const generateQuizSets = (questions: Question[]) => {
  if (questions.length < 140) throw new Error("Dữ liệu không đủ số lượng câu hỏi!");

  return [
    questions.slice(0, 50), // Đề 1: 50 câu đầu
    questions.slice(50, 100), // Đề 2: 50 câu tiếp theo
    [...questions.slice(100, 140), ...questions.slice(0, 10)], // Đề 3: 40 câu còn lại + 10 câu đầu tiên
  ];
};

const ExamSelection = () => {
  const navigate = useNavigate();
  const [quizSets, setQuizSets] = useState<Question[][]>(() => {
    const savedSets = localStorage.getItem("quizSets");
    return savedSets ? JSON.parse(savedSets) : [];
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Đang tải dữ liệu...");
        const response = await fetch("/questions.json");
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

        const data: Question[] = await response.json();
        const quizSets = generateQuizSets(data);

        setQuizSets(quizSets);
        localStorage.setItem("quizSets", JSON.stringify(quizSets));
      } catch (error) {
        console.error("Lỗi tải câu hỏi:", error);
        alert("Không thể tải câu hỏi, vui lòng thử lại!");
      }
    };

    if (!localStorage.getItem("quizSets")) {
      fetchQuestions();
    }
  }, []);

  const handleQuizStart = (quizId: number) => {
    if (quizSets[quizId - 1]) {
      navigate(`/quiz/${quizId}`, { state: { questions: quizSets[quizId - 1], from: "/exam" } });
    } else {
      alert("Không tìm thấy bộ đề, vui lòng thử lại!");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Chọn bộ đề</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {quizSets.length > 0 ? quizSets.map((_, i) => (
          <button
            style={{ marginRight: 8 }}
            key={i + 1}
            className="btn btn-outline-primary m-2"
            onClick={() => handleQuizStart(i + 1)}
          >
            Bộ đề {i + 1}
          </button>
        )) : <p>Đang tải câu hỏi...</p>}
      </div>
    </div>
  );
};

export default ExamSelection;
