import { useContext, useEffect, useState } from "react";
import "./Filemenu.css";
import { data } from "react-router-dom";
import { MyContext } from "../context/MyContext";
function Filemenu() {
  const {selectedFiles, setSelectedFiles}=useContext(MyContext)
  const [files, setFiles] = useState(null);

  const fileSelctor = (e,id) => {
    e.stopPropagation();
     if (e.target.checked) {
    setSelectedFiles((prev) => [...prev, id]);
  } else {
    setSelectedFiles((prev) => 
   prev.filter((fileId) => fileId !== id)
    );
  }
  };

  const getFiles = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/documents", {
        credentials: "include",
      });
      const res = await response.json();

      setFiles(res);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteFile = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/documents/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log(data);

      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFiles();
  }, []);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("document", file);

    const response = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
  };
  return (
    <div className="file-menu">
      {files &&
        files.map((file) => (
          <div className="file-name" key={file._id}>
            <input
              type="checkbox"
              checked={selectedFiles.includes(file._id)}
              onChange={(e)=>{
                fileSelctor(e,file._id)}
              }
              
            />{" "}
            <span>{file.fileName}</span>
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
            console.log("clicked");
          }}
        >
          <i className="fa-solid fa-paperclip"></i>&nbsp;&nbsp;upload file
          <input
            id="file-upload"
            type="file"
            hidden
            onChange={(e) => {
              e.stopPropagation();
              console.log("cahnaged");
              handleFileUpload(e);
            }}
          />
        </label>
      </div>
    </div>
  );
}
export default Filemenu;
