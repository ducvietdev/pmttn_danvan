import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      className="container text-center mt-5"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>PHẦN MỀM THI TRẮC NGHIỆM DÂN VẬN</h1>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
        <button
          style={{ border: 'solid 1px green', color: "green" }}
          className="btn btn-primary mt-3"
          onClick={() => navigate("/select")}
        >
          Luyện tập
        </button>
        <button
          style={{ border: 'solid 1px red', color: "red" }}
          className="btn btn-primary mt-3"
          onClick={() => navigate("/exam")}
        >
          Thi thử
        </button>
      </div>
    </div>
  );
};

export default Home;
