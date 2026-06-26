import { useContext, useEffect, useState } from "react";
import "../styles/components/Filemenu.css";
import toast from "react-hot-toast";
import { MyContext } from "../context/MyContext";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../../services/documentApi";
import handleError from "../utils/handleError";
function Filemenu() {
  const { selectedFiles, setSelectedFiles, files, setFiles, setWithRag ,user,setFileBtn} =
    useContext(MyContext);
  const allowed = [".txt", ".pdf"];
  const [uploading, setUploading] = useState(false);
  // Add or remove file from selected RAG files
  const fileSelctor = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, id]);
    } else {
      setSelectedFiles((prev) => prev.filter((fileId) => fileId !== id));
    }
  };

  // Fetch all uploaded documents
  const getFiles = async () => {
    try {
      const res = await getDocuments();
      setFiles(res);
    } catch (err) {
      handleError(err);
    }
  };
  // Delete document and update local state
  const deleteFile = async (id) => {
    try {
      const response = await deleteDocument(id);
      // Remove deleted file from selected files
      setSelectedFiles((prev) => prev.filter((fileId) => fileId !== id));

      // Remove deleted file from file list
      setFiles((prev) => prev.filter((file) => file._id !== id));
      toast.success("File Deleted");
      if (!files) {
        setWithRag(false);
      }
    } catch (err) {
      handleError(err);
    }
  };
  // Load documents when component mounts

  useEffect(() => {
    if(!user){return;}
    getFiles();
  }, []);
  // Upload a new document for RAG
  const handleFileUpload = async (e) => {
    // Prevent multiple upload requests
  if(!user){setUploading(false);}
    if (uploading) return;
    if (!files) return;
    setUploading(true);
    try {
      // Prepare form data for file upload
      const file = e.target.files[0];
      if (!file) {
        setUploading(false);
        return;
      }
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowed.includes(ext)) {
        toast.error("Only TXT and PDF files are allowed.");
        setUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("document", file);
      // Send selected file to backend
      const res = await uploadDocument(formData);
      toast.success("file uploaded");
      // Refresh document list after upload
      await getFiles();
    } catch (err) {
      handleError(err);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };
  return (
    <div className="file-menu">
      {/* Display uploaded documents */}

      {files &&
        files.map((file) => (
          <div className="file-name" key={file._id}>
            {/* Select file for RAG queries */}
            <input
              type="checkbox"
              checked={selectedFiles.includes(file._id)}
              onChange={(e) => {
                fileSelctor(e, file._id);
              }}
            />{" "}
            <span
              style={{
                display: "inline-block",
                maxWidth: "130px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {file.fileName}
            </span>
            {/* Delete document */}
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteFile(file._id);
              }}
            >
              <i className="fa-regular fa-trash-can"></i>
            </span>
          </div>
        ))}
      <div className=" upload-btn">
        <label
          htmlFor="file-upload"
          onClick={(e) => {
            e.stopPropagation();
            if(!user){
              e.preventDefault();
              setFileBtn(false);
              toast.error("Sign in please ...");
             return;}
          }}
        >
          <i className="fa-solid fa-paperclip"></i>&nbsp;&nbsp;
          {uploading ? "uploading" : "upload"}
          {/* Hidden file input */}
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf"
            hidden
            onChange={(e) => {
              e.stopPropagation();
  handleFileUpload(e);
            }}
          />
        </label>
      </div>
    </div>
  );
}
export default Filemenu;
