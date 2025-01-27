import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import image_img from "../components/assets/image-img.png";
import pdf_img from "../components/assets/pdf-img.png";
import text_img from "../components/assets/text-img.png";
import docx_img from "../components/assets/docx-img.png";  
import json_img from "../components/assets/json-img.png";  
import other_img from "../components/assets/other-img.png";  
import { FaRegImage, FaFilePdf, FaRegFile, FaFileWord, FaFileCode } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

function UserFileManagement() {
  const [files, setFiles] = useState([]);
  const [fileCount, setFileCount] = useState({
    images: 0,
    pdfs: 0,
    texts: 0,
    docx: 0,
    json: 0,
    others: 0,
  });
  const [selectedFileId, setSelectedFileId] = useState(null);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
  
      const response = await fetch("http://localhost:5050/files", {
        method: "GET",
        headers: {
          "Authorization": token, // Pass the token in the Authorization header
        },
      });
  
      const data = await response.json();
      console.log(data); // Log the data to verify it has the 'fileName' property
  
      // Assuming data contains the file objects with fileName and fileId
      setFiles(data);
      countFileTypes(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const countFileTypes = (files) => {
    let imageCount = 0, pdfCount = 0, textCount = 0, docxCount = 0, jsonCount = 0, otherCount = 0;

    files.forEach((file) => {
      const fileExtension = file.fileName.split(".").pop().toLowerCase(); // Change `file.name` to `file.fileName`
      if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
        imageCount++;
      } else if (fileExtension === "pdf") {
        pdfCount++;
      } else if (fileExtension === "txt") {
        textCount++;
      } else if (fileExtension === "docx") {
        docxCount++;
      } else if (fileExtension === "json") {
        jsonCount++;
      } else {
        otherCount++;
      }
    });

    setFileCount({
      images: imageCount,
      pdfs: pdfCount,
      texts: textCount,
      docx: docxCount,
      json: jsonCount,
      others: otherCount,
    });
  };

  const renameFile = async (fileId, newName) => {
    if (!newName) return;
    try {
      const response = await fetch("http://localhost:5050/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, newName }),
      });
      alert(await response.text());
      fetchFiles();
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch("http://localhost:5050/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
  
      const responseText = await response.text();
      alert(responseText);
      
      if (response.ok) {
        fetchFiles(); // Refresh the list of files after deletion
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  

  const toggleOptions = (fileId) => {
    setSelectedFileId((prevFileId) => (prevFileId === fileId ? null : fileId)); 
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="files-management-container">
      <div className="file-counts-container">
        <span className="file-count-card">
          <FaRegImage className="icon image" />
          <p>Images <h2>{fileCount.images}</h2></p>
        </span>
        <span className="file-count-card">
          <FaFilePdf className="icon pdf" />
          <p>PDF's <h2>{fileCount.pdfs}</h2></p>
        </span>
        <span className="file-count-card">
          <IoDocumentText className="icon text" />
          <p>Text <h2>{fileCount.texts}</h2></p>
        </span>
        <span className="file-count-card">
          <FaFileWord className="icon docx" />
          <p>DOCX <h2>{fileCount.docx}</h2></p>
        </span>
        <span className="file-count-card">
          <FaFileCode className="icon json" />
          <p>JSON <h2>{fileCount.json}</h2></p>
        </span>
        <span className="file-count-card">
          <FaRegFile className="icon other" />
          <p>Other's <h2>{fileCount.others}</h2></p>
        </span>
      </div>

      <div className="file-actions">
        <button onClick={fetchFiles}>Refresh Files</button>
      </div>

      <div className="all-files-container">
        {files.map((file) => {
          const fileExtension = file.fileName.split(".").pop().toLowerCase();
          let fileIcon;

          if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
            fileIcon = image_img;
          } else if (fileExtension === "pdf") {
            fileIcon = pdf_img;
          } else if (fileExtension === "txt") {
            fileIcon = text_img;
          } else if (fileExtension === "docx") {
            fileIcon = docx_img;
          } else if (fileExtension === "json") {
            fileIcon = json_img; 
          } else {
            fileIcon = other_img;
          }

          return (
            <div key={file.fileId} className="file-item">
              <div className="file-details">
                {fileIcon && (
                  <div className="file-image">
                    <img src={fileIcon} alt={file.fileName} className="file-icon" />
                  </div>
                )}
                <span className="file-name">{file.fileName}</span>
              </div>

              <div className="options">
                <button
                  className="dots-btn"
                  onClick={() => toggleOptions(file.fileId)}
                >
                  &#x22EE;
                </button>

                {selectedFileId === file.fileId && (
                  <div className="options-menu">
                    <button
                      className="btn rename-btn"
                      onClick={() =>
                        renameFile(file.fileId, prompt("Enter new name:", file.fileName))
                      }
                    >
                      Rename
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => deleteFile(file.driveFileId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserFileManagement;
