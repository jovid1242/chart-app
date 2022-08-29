import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Analitics from "./components/CircleChart";
import "./App.css";
import "@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css";

function App() {
  return (
    <div className="container">
      {/* <Analitics /> */}
      <Routes>
        <Route path="/" element={<Analitics />} />
      </Routes>
    </div>
  );
}

export default App;
