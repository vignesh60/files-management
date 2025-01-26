import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import FileManagement from "./components/FileManagement";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload"; // Assuming you've created a new FileUpload component

function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<FileManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<FileUpload />} /> {/* New route */}
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
