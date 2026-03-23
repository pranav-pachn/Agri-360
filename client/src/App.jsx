import { useState } from "react";
import API from "./services/api";

function App() {
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await API.post("/analyze", {
      crop: "Rice",
      location: "Andhra Pradesh",
    });
    setResult(res.data);
  };

  return (
    <div>
      <h1>AgriMitra 360</h1>
      <button onClick={analyze}>Analyze</button>

      {result && (
        <div>
          <p>Health: {result.health}%</p>
          <p>Risk: {result.risk}</p>
          <p>Yield: {result.yield}</p>
          <h2>Trust Score: {result.trustScore}</h2>
        </div>
      )}
    </div>
  );
}

export default App;