import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1>PHẦN MỀM THI TRẮC NGHIỆM DÂN VẬN</h1>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/select")}
      >
        Bắt đầu
      </button>
    </div>
  );
};

export default Home;
