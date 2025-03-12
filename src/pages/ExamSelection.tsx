import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateQuizSets = (questions: Question[], setCount: number, setSize: number) => {
  const shuffledQuestions = shuffleArray(questions);
  return Array.from({ length: setCount }, (_, i) => {
    return shuffledQuestions.slice(i * setSize, (i + 1) * setSize);
  });
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
        if (!Array.isArray(data) || data.length < 140) {
          throw new Error("Dữ liệu không hợp lệ hoặc không đủ số lượng câu hỏi!");
        }
        
        const quizSets = generateQuizSets(data, 3, 50);
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
    const questionsWithShuffledOptions = quizSets[quizId - 1]?.map((q) => ({
      ...q,
      options: shuffleArray(Object.entries(q.options)).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string }),
    }));

    if (questionsWithShuffledOptions) {
      navigate(`/quiz/${quizId}`, { state: { questions: questionsWithShuffledOptions, from: "/exam" } });
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