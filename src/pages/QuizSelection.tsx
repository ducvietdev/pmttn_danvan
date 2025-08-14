import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
}

const QuizSelection = () => {
  const navigate = useNavigate();

  // Hàm trộn ngẫu nhiên và lấy 50 câu
  const fetchRandomQuestions = async (quizId: number) => {
    try {
      console.log("Đang tải dữ liệu...");

      const response = await fetch("/questions_ct.json");
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const data: Question[] = await response.json();
      console.log("Dữ liệu nhận được:", data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Dữ liệu không hợp lệ hoặc rỗng!");
      }

      // Trộn câu hỏi ngẫu nhiên và lấy 50 câu
      const shuffledQuestions = [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 50);

      console.log("Câu hỏi đã chọn:", shuffledQuestions);

      navigate(`/quiz/${quizId}`, { state: { questions: shuffledQuestions } });
    } catch (error) {
      console.error("Lỗi tải câu hỏi:", error);
      alert("Không thể tải câu hỏi, vui lòng thử lại!");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Chọn bộ đề</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            style={{marginRight: 8}}
            key={i + 1}
            className="btn btn-outline-primary m-2"
            onClick={() => fetchRandomQuestions(i + 1)}
          >
            Bộ đề {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizSelection;
