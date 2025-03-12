import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
}

const QUIZ_STORAGE_KEY = "savedQuizzes";

// Hàm trộn ngẫu nhiên mảng
const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

// Hàm trộn ngẫu nhiên đáp án của một câu hỏi
const getShuffledOptions = (options: { [key: string]: string }) => {
  return Object.fromEntries(shuffleArray(Object.entries(options)));
};

// Lấy dữ liệu đề thi từ localStorage
const getStoredQuizzes = (): Record<number, Question[]> => {
  const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

const ExamSelection = () => {
  const navigate = useNavigate();

  const fetchRandomQuestions = async (quizId: number) => {
    try {
      console.log("Đang tải dữ liệu...");
      let quizzes = getStoredQuizzes();

      if (!quizzes[1] || !quizzes[2] || !quizzes[3]) {
        const response = await fetch("/questions.json");
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

        const data: Question[] = await response.json();
        if (!Array.isArray(data) || data.length < 140) {
          throw new Error("Dữ liệu không hợp lệ hoặc không đủ câu hỏi!");
        }

        // Lấy ngẫu nhiên 140 câu từ dữ liệu gốc
        const selectedPool = shuffleArray(data).slice(0, 140);

        // Tạo 3 bộ đề, mỗi đề có 50 câu, có thể có câu trùng nhau
        quizzes = {
          1: Array.from({ length: 50 }, () => selectedPool[Math.floor(Math.random() * 140)]),
          2: Array.from({ length: 50 }, () => selectedPool[Math.floor(Math.random() * 140)]),
          3: Array.from({ length: 50 }, () => selectedPool[Math.floor(Math.random() * 140)]),
        };

        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
      }

      // Lấy đề từ localStorage, xáo trộn thứ tự câu hỏi và xáo trộn đáp án
      const selectedQuestions = shuffleArray(quizzes[quizId]).map((q) => ({
        ...q,
        options: getShuffledOptions(q.options),
      }));

      console.log("Câu hỏi đã chọn:", selectedQuestions);
      navigate(`/quiz/${quizId}`, { state: { questions: selectedQuestions, from: "/exam" } });
    } catch (error) {
      console.error("Lỗi tải câu hỏi:", error);
      alert("Không thể tải câu hỏi, vui lòng thử lại!");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Chọn bộ đề</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {[1, 2, 3].map((quizId) => (
          <button
            key={quizId}
            style={{ marginRight: 8 }}
            className="btn btn-outline-primary m-2"
            onClick={() => fetchRandomQuestions(quizId)}
          >
            Bộ đề {quizId}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSelection;
