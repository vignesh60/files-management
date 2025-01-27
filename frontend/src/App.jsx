import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import FileManagement from "./components/FileManagement";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserFileManagement from "./components/UserFileManagement";

// Function to check authentication
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null; // Returns true if token exists, false otherwise
};

// Protected Route component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/signin" />;
};

// Redirect if authenticated
const AuthRedirect = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/" /> : element;
};

function App() {
  return (
    <Router>
      {isAuthenticated() && <Header />}
      <div className="app">
        {isAuthenticated() && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/signin" element={<AuthRedirect element={<Login />} />} />
            <Route path="/signup" element={<AuthRedirect element={<Register />} />} />
            <Route path="/" element={<ProtectedRoute element={<UserFileManagement />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/upload" element={<ProtectedRoute element={<FileUpload />} />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
          </Routes>
        </div>
      </div>
      {isAuthenticated() && <Footer />}
    </Router>
  );
}

export default App;
