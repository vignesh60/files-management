import { useState, useEffect } from "react";
import image_img from "../components/assets/image-img.png";
import pdf_img from "../components/assets/pdf-img.png";
import text_img from "../components/assets/text-img.png";
import docx_img from "../components/assets/docx-img.png";  
import json_img from "../components/assets/json-img.png";  
import other_img from "../components/assets/other-img.png";  
import { FaRegImage } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { FaRegFile } from "react-icons/fa6";
import { FaFileWord } from "react-icons/fa"; // Add Word Icon
import { FaFileCode } from "react-icons/fa"; 

function FileManagement() {
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
      const response = await fetch("http://localhost:5050/files");
      const data = await response.json();
      setFiles(data);
      countFileTypes(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const countFileTypes = (files) => {
    let imageCount = 0;
    let pdfCount = 0;
    let textCount = 0;
    let docxCount = 0;
    let jsonCount = 0;
    let otherCount = 0;

    files.forEach((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
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
      alert(await response.text());
      fetchFiles();
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
          <p>
            Images <h2>{fileCount.images}</h2>
          </p>
        </span>
        <span className="file-count-card">
          <FaFilePdf className="icon pdf" />
          <p>
            PDF's <h2>{fileCount.pdfs}</h2>
          </p>
        </span>
        <span className="file-count-card">
          <IoDocumentText className="icon text" />
          <p>
            Text <h2>{fileCount.texts}</h2>
          </p>
        </span>
        <span className="file-count-card">
          <FaFileWord className="icon docx" />
          <p>
            DOCX <h2>{fileCount.docx}</h2>
          </p>
        </span>
        <span className="file-count-card">
          <FaFileCode className="icon json" />
          <p>
            JSON <h2>{fileCount.json}</h2>
          </p>
        </span>
        <span className="file-count-card">
          <FaRegFile className="icon other" />
          <p>
            Other's <h2>{fileCount.others}</h2>
          </p>
        </span>
      </div>

      <div className="file-actions">
        <button onClick={fetchFiles}>Refresh Files</button>
      </div>

      <div className="all-files-container">
        {files.map((file) => {
          const fileExtension = file.name.split(".").pop().toLowerCase();
          let fileIcon;

          // Set the icon based on the file type
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
            <div key={file.id} className="file-item">
              <div className="file-details">
                {fileIcon && (
                  <div className="file-image">
                    <img src={fileIcon} alt={file.name} className="file-icon" />
                  </div>
                )}
                <span className="file-name">{file.name}</span>
              </div>

              <div className="options">
                <button
                  className="dots-btn"
                  onClick={() => toggleOptions(file.id)}
                >
                  &#x22EE;
                </button>

                {selectedFileId === file.id && (
                  <div className="options-menu">
                    <button
                      className="btn rename-btn"
                      onClick={() =>
                        renameFile(
                          file.id,
                          prompt("Enter new name:", file.name)
                        )
                      }
                    >
                      Rename
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => deleteFile(file.id)}
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

export default FileManagement;
