import { useState } from "react";
import upload from "../components/assets/upload.png";
import { toast } from "react-toastify";
import { LuRefreshCcw } from "react-icons/lu";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State for loader animation

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const token = localStorage.getItem("token"); // Get JWT token
    if (!token) {
      toast.error("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true); // Show loader animation
      const response = await fetch("http://localhost:5050/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in headers
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "File uploaded successfully.");
      } else {
        toast.error(result.message || "Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during file upload.");
    } finally {
      setIsUploading(false); // Hide loader animation
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <img src={upload} alt="upload" />
        <form onSubmit={uploadFile}>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              required
            />
            <label htmlFor="file" className="file-label">
              Choose a file
            </label>
          </div>
          <button type="submit" className="upload-btn" disabled={isUploading}>
            {isUploading ? (
              <LuRefreshCcw className="loader" />
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FileUpload;
