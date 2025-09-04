import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../features/analysisSlice";
import API from "../features/api";
import "./UploadForm.css";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await API.post("/analysis/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      dispatch(uploadFile(file));
      navigate("/charts");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12"
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a valid Excel file (.xlsx, .xls)");
        return;
      }
      
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleClickArea = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Upload Your Data</h2>
          <p>Select an Excel file to analyze your data</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickArea}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="file-input"
            />
            
            <div className="upload-content">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 15H13V9H16L12 4L8 9H11V15Z" fill="currentColor"/>
                  <path d="M20 18H4V11H2V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V11H20V18Z" fill="currentColor"/>
                </svg>
              </div>
              
              {file ? (
                <div className="file-info">
                  <h3>{file.name}</h3>
                  <p>{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <>
                  <h3>Drag & Drop your file here</h3>
                  <p>or click to browse</p>
                  <p className="file-types">Supported formats: .xlsx, .xls</p>
                </>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="upload-button"
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Analyze Data'
            )}
          </button>
        </form>

        <div className="upload-tips">
          <h4>Tips for best results:</h4>
          <ul>
            <li>Ensure your Excel file has a clear header row</li>
            <li>Remove any empty rows or columns</li>
            <li>Format dates consistently</li>
            <li>Keep file size under 10MB for optimal performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UploadForm;