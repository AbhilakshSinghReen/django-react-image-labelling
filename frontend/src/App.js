import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import NewUpload from "./components/NewUpload";
import Labelling from "./components/Labelling";
import History from "./components/History";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/upload-new" element={<NewUpload />} />
          <Route path="/labelling/:id" element={<Labelling />} />
          <Route path="/history" element={<History />} />
          <Route path="/" element={<Navigate to="/upload-new" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
