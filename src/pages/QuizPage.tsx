import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  question: string;
  options: { [key: string]: string };
  answer: string;
}

const QuizPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // const [timeLeft, setTimeLeft] = useState(1500); // 25 phút
  const [timeLeft, setTimeLeft] = useState(10); // 25 phút

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState(false);

  const questions: Question[] = location.state?.questions || [];

  useEffect(() => {
    if (questions.length === 0) {
      alert("Vui lòng chọn bộ đề trước!");
      navigate("/select");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!submitted) {
            alert("Thời gian làm bài của bạn đã hết, vui lòng kiểm tra kết quả!");
            handleSubmit(true); // Không gọi confirm khi hết giờ
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, navigate, submitted]); // Thêm `submitted` vào dependencies


  const handleChange = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm("Bạn có chắc chắn muốn nộp bài không?")) {
      return;
    }

    if (!submitted) {  // Tránh việc chạy lại nhiều lần
      setSubmitted(true);
      setTimeLeft(0); // Dừng thời gian
    }
  };


  const correctAnswers = questions.reduce((count, q) => {
    return answers[q.id] === q.answer ? count + 1 : count;
  }, 0);

  return (
    <div className="container mt-5">
      <h2>Bộ đề {id}</h2>
      {!submitted && (
        <p><strong>Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} phút</strong></p>
      )}

      {questions.map((q, index) => (
        <div key={q.id} className="mb-3" style={{ position: "relative" }}>
          {submitted && review && (
            <span style={{
              position: "absolute",
              left: "-20px",
              color: answers[q.id] === q.answer ? "green" : "red",
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              {answers[q.id] === q.answer ? "✔" : "✘"}
            </span>
          )}
          <p><strong>{index + 1}. {q.question}</strong></p>
          {Object.entries(q.options).map(([key, value]) => (
            <div key={key}>
              <input
                type="radio"
                name={`question-${q.id}`}
                id={`option-${q.id}-${key}`}
                onChange={() => handleChange(q.id, key)}
                checked={answers[q.id] === key}
                disabled={submitted}
              />
              <label htmlFor={`option-${q.id}-${key}`}
                style={submitted && review ? {
                  color: key === q.answer ? "green" : (answers[q.id] === key ? "red" : "black"),
                  fontWeight: key === q.answer ? "bold" : "normal"
                } : {}}>
                {key}. {value}
              </label>
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button className="btn btn-primary" onClick={() => handleSubmit()}>Nộp bài</button>
      ) : (
        <div className="mt-4">
          <h3>Kết quả bài thi</h3>
          <p>Bạn đã trả lời đúng {correctAnswers} / {questions.length} câu.</p>
          <button className="btn btn-secondary" onClick={() => setReview(true)}>Xem lại đáp án</button>
          {review && (
            <button className="btn btn-warning mt-2" onClick={() => navigate("/select")}>Quay về chọn bộ đề mới</button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
