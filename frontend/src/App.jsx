import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  const [status, setStatus] = useState("Checking backend...");

  //Check backend connectivity
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then(() => setStatus("Backend reachable"))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Full-Stack Todo App</h1>
        <p>
          <strong>Backend status:</strong> {status}
        </p>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
     
      </Routes>
    </Router>
  );
}

export default App;
