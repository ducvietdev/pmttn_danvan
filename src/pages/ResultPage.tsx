import { Link } from "react-router-dom";

const ResultPage = () => {
  return (
    <div className="container mt-5 text-center">
      <h2>Kết quả bài thi</h2>
      <p>Điểm số: --/50</p>
      <Link to="/" className="btn btn-primary">
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default ResultPage;
